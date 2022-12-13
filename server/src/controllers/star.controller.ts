import { Request, Response, NextFunction } from "express";
import { Correspondence } from "../models/cors.model";

export const starMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let id = req.params.id;
		let star: boolean = req.body.starred
		let threadId = req.body.threadId
		let location = req.query.location
		let data
		
		
		if (typeof star != "boolean") {
			return res.status(400).json({message:'body Should be boolean', errorCode:"400.001"})
		}
		if (star) {
			data = await Correspondence.findOneAndUpdate({ _id: id }, { "content.Starred": true}, { new: true })
		}
		else {
			if (location === "inbox") {
				data = await unStarAll(threadId)
			} else {
				data = await Correspondence.findOneAndUpdate({ _id: id }, { "content.Starred": false }, { new: true })
			}
		}

		await ThreadStarred(threadId, star)

		if(star)
			return res.status(200).json({message:'staring process done successfully', data:data});
		else
			return res.status(200).json({message:'unstaring process done successfully' ,data:data});
	} catch (err) {
		console.log(err);
		next(err)
	}
}

const getThreadIds = async (threadId: string) =>{
	let threadIds = await Correspondence.find({threadId:threadId}, {'_id':1})
	return threadIds
}

const ThreadStarred = async (threadId:string, star:boolean) =>{
	let threadIds = await getThreadIds(threadId)
	
	threadIds.forEach( async (item:any)=>{
		await Correspondence.findByIdAndUpdate({_id:item._id}, {"content.ThreadStarred":star}, {new:true})
	})
}

const unStarAll = async (threadId: string) => {
	let arrOfIds: any = []
	let data = await Correspondence.find({ threadId: threadId }).select({ _id: 1 })
	data.map((item) => {
		arrOfIds.push(item._id)
	})
	if(arrOfIds.length == 1){
		await Correspondence.findByIdAndUpdate({ _id: arrOfIds[0].toString() }, {
			"content.Starred": false
		}, { new: true })
	}
	else{
		arrOfIds.forEach(async (item: any) => {
			await Correspondence.findByIdAndUpdate({ _id: item.toString() }, {
				"content.Starred": false
			}, { new: true })
		});
	}
	return data
}

export const getStarredMessages = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let { page = 1, limit = 20 }: any = req.query;
	try {

		if( page <= 0 )
			page = 1
		if( limit <= 0 )
			limit = 20
		
		let data = await getStarredData(limit, page)

		// console.log(data[0].Correspondence)
		data = formatDataSent(data)

		if (data.length ==0) return res.status(404).json({message : 'Not Found', numOfRecords:0, errorCode:"404.003"});

		let count = await getStarCount()

		return res.json({
			data,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
			numOfRecords: count,
			limit: limit,
			message:'Starred Messages returned successfully'
		});
	} catch (err) {
		console.log(err);
		next(err)
	}
}

export const getStarredData = async (limit:any, page:any) => {
	return await Correspondence.aggregate
	([
		{
			$group: {
				_id: "$threadId",

				Correspondence: { $push: "$$ROOT" },
				isStarred: { $max: "$content.Starred" },
				isDrafted: {$max: "$content.isDrafted"}

			},
		},
		{
			$match: {
				$and: [
					{ "Correspondence.content.isDeleted": false },
					// { "Correspondence.content.isDrafted": false },
					{ "isStarred": true }
				]
			}
		},
		{
			$project: {
				"threadId": 1,
				"Correspondence.content": 1,
				"Correspondence._id": 1,
				"isStarred": 1,
				"isDrafted":1
			},
		},
		{
			$sort: { "Correspondence.content.sent_date": -1 }
		},
		{
			$skip:(page - 1) * limit
		},
		{
			$limit:(limit * 1)
		}

])
}


const getStarCount = async () => {
	let count :any =  await Correspondence.aggregate
	([
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
				isStarred: { $max: "$content.Starred" },
			},
		},
		{
			$match: {
				$and: [
					{ "Correspondence.content.isDeleted": false },
					// { "Correspondence.content.isDrafted": false },
					{ "isStarred": true }
				]
			}
		},
		{
			$count:"count"
		}
	])

	count = count[0].count

	return count
}

export const formatDataSent = (data: any) => {
	return data.map((item: any) => {
		let isDraftedReplyExists = false
		let length = item.Correspondence.length - 1;
		if(item.isDrafted && item.Correspondence.replyTo != null)
			isDraftedReplyExists=true
		while(length > 0 ){
			if(item.Correspondence[length].content.isDrafted){
				length--
			}else{
				break;
			}
		}
		return { threadId: item._id, _id: item.Correspondence[length]._id, ...item.Correspondence[length].content, ThreadStarred: item.isStarred, isDraftedReplyExists:isDraftedReplyExists }
	})
}

