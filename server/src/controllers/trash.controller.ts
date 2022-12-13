import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Correspondence } from "../models/cors.model";

export const deleteThread = async (
	req: Request,
	res: Response,
	next:NextFunction
) => {
	try {
		let arrOfIds = req.body.arrOfIds

		if(arrOfIds == undefined)
			return res.status(404).json({message:"Messages Not Found", errorCode:"404.004"})
		arrOfIds.forEach(async (id: any) => {
			await Correspondence.findByIdAndUpdate(id, { "content.isDeleted": true, "content.trashDate": new Date() }, { new: true })
		})

		let records = await Correspondence.countDocuments({ "content.isDeleted": false, "content.isDrafted": false })
		return res.status(200).json({ message: "message deleted successfully", records: records })
	} catch (err) {
		console.log(err)
		next(err)
	}
}

export const deleteThreads = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let threadIds = req.body.threadIds

		if(threadIds == null) return res.status(400).json({message:"Thread Ids are not sent", errorCode:"400.002" })
		
		let ids :any = await getThreadsIds(threadIds)
		
		if (ids.length == 0) return res.status(404).json({message:"Thread Ids are not found", errorCode: "404.004"})
		
		ids.forEach(async (id: any) => {
			await Correspondence.findByIdAndUpdate(id, { "content.isDeleted": true, "content.trashDate": new Date() }, { new: true })
		})

		return res.status(200).json({message:"deleted Successfully"})
	} catch (err) {
		// console.log(err)
		return next({message:"Invalid thread Id"})
	}
}

export const getDeletedMessages = async (
	req: Request,
	res: Response,
	next:NextFunction
) => {
	try {
		let { page = 1, limit = 20 }: any = req.query;

		if(page <= 0)
			page = 1

		if(limit <= 0)
			limit = 20

		let data = await getDeletedData(limit, page)

		data = formatDeletedDataSent(data)

		if (data.length == 0) res.status(404).json({message:'Not found', numOfRecords:0, errorCode:"404.005"});

		let count = await getDeletedCount()

		res.status(200).json({
			data,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
			numOfRecords: count,
			limit: limit
		});
	} catch (err) {
		console.log(err)
		next(err)
	}
}

export const getDeletedData  = async (limit:any , page:any) => {
	return  await Correspondence.aggregate
	([
		{
			$match:{
				$and:[
					{"content.isDrafted":false},
					{"content.isDeleted":true}
				]
				
			}
		},
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
				isDeleted: { $max: "$content.isDeleted" },
			},
		},
		{
			$match: {
				$and: [
					// { "Correspondence.content.isDeleted": true },
					{ "isDeleted": true },
					// {"Correspondence.content.isDrafted":false}
				]
			}
		},
		{
			$project: {
				"threadId": 1,
				"Correspondence.content": 1,
				"Correspondence._id": 1,
				"isDeleted": 1
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

export const formatDeletedDataSent = (data :any) => {
	return data.map((item: any) => {
		let length = item.Correspondence.length - 1;
		let isDraftedReplyExists = false
		while(length >= 0 ){
			if(item.Correspondence[length].content.isDrafted){
				isDraftedReplyExists=true
				length--
			}else if(item.Correspondence[length].content.isDeleted == false){
				length--
			}
			else{
				break;
			}
		}
		return { threadId: item._id, _id: item.Correspondence[length]._id, ...item.Correspondence[length].content, ThreadStarred: item.isStarred, isDraftedReplyExists:isDraftedReplyExists }
	})
}

const getDeletedCount = async () => {
	let count :any =  await Correspondence.aggregate
	([
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
				isDeleted: { $max: "$content.isDeleted" },
			},
		},
		{
			$match: {
				$and: [
					{ "Correspondence.content.isDrafted": false },
					{ "isDeleted": true }
				]
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

const getThreadsIds = async (threadIds: String[]) => {
			let data = await Correspondence.find({
				threadId: {
					$in: threadIds
				}
			}, {_id:1})
			
			return data
}
