import { Request, Response, NextFunction } from "express";
import { Correspondence } from "../models/cors.model";


export const sendMessage = async (
	req: Request,
	res: Response,
) => {

	try {
		let data = { ...req.body.data };
		data.sent_date = new Date().toISOString();
		data.due_date = new Date(data.due_date);
		data.from_user = "mohkh"
		data.from_email = "mohkh@gmail.com"
		const correspondence = new Correspondence({
			"content": data
		})
		await correspondence.save()
		return res.status(200).json({message: "correspondence Sent" , data: correspondence})
	} catch (err) {
		console.log(err);
	}
}

export const getInboxMessages = async (
	req: Request,
	res: Response,
	next:NextFunction
) => {
	let { page = 1, limit = 20 }: any = req.query;
	try {

		if(page <= 0)
			page = 1
		
		if(limit <= 0)
			limit=20

		let data = await getInboxData(limit, page)

		if (data.length==0) return res.status(404).json({
			message:'Not Found',
			numOfRecords: 0,
			errorCode:"404.001"
		});

		data = formatDataSent(data)

		let count : any = await getInboxCount()
		return res.json({
			data,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
			numOfRecords: count,
			limit: limit,
			message:'Inbox Message returned successfully'
		});
	} catch (err) {
		console.log(err);
		return next(err)
	}
}

export const getInboxData = async (limit:any, page:any) => {
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
					{ "Correspondence.content.isDrafted": false },
					{"Correspondence.content.replyTo": {$ne: null}}
				],
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

export const getInboxCount = async () =>{
	let count :any =  await Correspondence.aggregate
	([
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
			},
		},
		{
			$match: {
				$and: [
					{ "Correspondence.content.isDeleted": false },
					{"Correspondence.content.replyTo": {$ne: null}}
				],
			}
		},
		{
			$count:"count"
		}
	])

	if(count.length !=0)
		count = count[0].count
	return count
}

const getSentCount = async () =>{
	let count :any =  await Correspondence.aggregate
	([
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
			},
		},
		{
			$match: {
				$and: [
					{ "Correspondence.content.isDeleted": false },
					{"Correspondence.content.replyTo": {$ne: null}},
					{"Correspondence.content.from_user": "mohkh"}
				],
			}
		},
		{
			$count:"count"
		}
	])

	if(count.length !=0)
		count = count[0].count
	return count
}

export const formatDataSent = (data: any) => {
	return data.map((item: any) => {
		let isDraftedReplyExists = false
		let length = item.Correspondence.length - 1;
		if(item.isDrafted)
			isDraftedReplyExists=true
		while(length >= 0 ){
			if(item.Correspondence[length].content.isDrafted){
				length--
			}else{
				break;
			}
		}
		return { threadId: item._id, _id: item.Correspondence[length]._id, ...item.Correspondence[length].content, ThreadStarred: item.isStarred, isDraftedReplyExists:isDraftedReplyExists }
	})
}

export const getSentMessages = async (
	req: Request,
	res: Response,
	next:NextFunction
) => {
	let { page = 1, limit = 20 }: any = req.query;
	try {

		if(page <=0)
			page = 1
		if(limit <=0)
			limit = 20
		let data = await Correspondence.aggregate
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
							{ "Correspondence.content.isDrafted": false },
							{"Correspondence.content.replyTo": {$ne: null}},
							{"Correspondence.content.from_user": 'mohkh'}
						],
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

		if (data.length==0) return res.status(404).json({
			message:'Not Found',
			numOfRecords: 0,
			errorCode:"404.002"
		});

		data = formatDataSent(data)

		let count : any = await getSentCount()

		res.json({
			data,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
			numOfRecords: count,
			limit: limit
		});
	} catch (err) {
		console.log(err);
		return next(err)
	}
}

export const readMessage = async (
	req: Request,
	res: Response,
	next:NextFunction
) => {
	try {
		let id = req.params.id;

		let data = await Correspondence.findByIdAndUpdate(id, {
			"content.message_status": "seen"
		}, { new: true })

		if (!data) return res.status(404).json({message:'data is not found', errorCode:"404.009"});

		await data?.save()
		return res.status(200).json( {message:"read successfully"} );

	} catch (err) {
		console.log(err);
		return next({message: 'Invalid Id', errorCode:"500.002"})
	}
}




