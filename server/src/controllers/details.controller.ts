import { Request, Response, NextFunction } from "express";
import { Correspondence } from "../models/cors.model";
var mongoose = require('mongoose');

export const getMessageDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let id = req.params.id;

		let data, count: any = 0, messagesCount: any
		
		const { title = "home" }: any = req.query;

		id = mongoose.Types.ObjectId(id)

		let details = await handleTitle(id, title)

		if(!details) return res.status(404).json({message: 'Thread Not found', errorCode:"404.004"})
		messagesCount = details.messagesCount
		count = details.count
		data = details.data

		
		let drafts = await getDraftedReplies(id)

		return res.status(200).json({
			data: data,
			messageCount: count,
			messagesCount: messagesCount,
			drafts: drafts
		});
	} catch (err) {
		next({message: 'Invalid thread Id', errorCode:"500.003"})
	}
}

const handleTitle = async(id:string, title:string) => {
	let details
	if (title === "starred") {
		details = await getStarredDetails(id)
	}
	else if (title === "trash") {
		details = await getTrashDetails(id)
	}
	else {
		details = await getHomeDetails(id)
	}	
	return details
}

const getDraftedReplies = async (id: any) => {
	let drafts = await Correspondence.aggregate([
		{
			$match: {
				$and: [
					{ "content.isDrafted": true },
					{ "threadId": id }
				]
			}
		},
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
			},
		},
		{
			$project: {
				"threadId": 1,
				"Correspondence.content": 1,
				"Correspondence._id": 1
			},
		},
	])

	return drafts
}

const getTrashDetails = async (id: any) => {
	let messagesCount = await Correspondence.aggregate([
		{
			$match: {
				$and: [
					{ "content.isDeleted": true },
				]
			}
		},
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
			},
		},
		// {
		// 	$sort: { "Correspondence.content.sent_date": -1 }
		// },
		{
			$count: "count"
		},
	])

	messagesCount = messagesCount[0].count

	let data = await Correspondence.aggregate
		([
			{
				$match: {
					$and: [
						{ "content.isDeleted": true },
						// { "content.isDrafted": false },
						{ "threadId": id }
					]
				}
			},
			{
				$group: {
					_id: "$threadId",
					Correspondence: { $push: "$$ROOT" },
				},
			},
			{
				$project: {
					"threadId": 1,
					"Correspondence.content": 1,
					"Correspondence._id": 1
				},
			},
		])
	if(data.length == 0) return null

	let length = data[0].Correspondence.length
	let lastReply = data[0].Correspondence[length - 1]._id

	let count: any = await Correspondence.aggregate([
		{
			$match: {
				$and: [
					{ "content.isDeleted": true },
					{"content.isDrafted":false},
					// { "content.isDrafted": false },
					// { "content.Starred": true },
					{ _id: { $gt: lastReply } }
				]
			}
		},
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
				isDeleted:{$max:"content.isDeleted"}
			},
		},
		{
			$sort: { "_id": -1 }
		},
		{
			$count: "count"
		},
	])

	if (count.length == 0) {
		count = 1
	} else {
		count = count[0].count + 1
	}

	return { messagesCount, data, count }
}

const getHomeDetails = async (id: any) => {
	let messagesCount = await Correspondence.aggregate([
		{
			$match: {
				$and: [
					{ "content.isDeleted": false },
					{ "content.isDrafted": false },
					{"content.replyTo": {$ne: null}},
				]
			}
		},
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
			},
		},
		{
			$sort: { "Correspondence.content.sent_date": -1 }
		},
		{
			$count: "count"
		},
	])

	messagesCount = messagesCount[0].count

	let data = await Correspondence.aggregate
		([
			{
				$sort:{
					"content.sent_date":1
				}
			},
			{
				$match: {
					$and: [
						{ "content.isDeleted": false },
						{ "content.isDrafted": false },
						{"content.replyTo": {$ne: null}},
						{ "threadId": id }
					]
				}
			},
			{
				$group: {
					_id: "$threadId",
					Correspondence: { $push: "$$ROOT" },
				},
			},
			{
				$project: {
					"threadId": 1,
					"Correspondence.content": 1,
					"Correspondence._id": 1
				},
			},

	])
	
	if(data.length == 0) return null

	let length = data[0].Correspondence.length
	let lastReply = data[0].Correspondence[length - 1]._id
	let count: any = await Correspondence.aggregate([
		{
			$match: {
				$and: [
					{ "content.isDeleted": false },
					{ "content.isDrafted": false },
					{"content.replyTo": {$ne: null}},
					{ _id: { $gt: lastReply } }
				]
			}
		},
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
			},
		},
		{
			$sort: { "_id": -1 }
		},
		{
			$count: "count"
		},
	])

	if (count.length == 0) {
		count = 1
	} else {
		count = count[0].count  +1
	}

	return { messagesCount, data, count }
}

const getStarredDetails = async (id: string) => {
	let messagesCount = await Correspondence.aggregate([
		{
			$match: {
				$and: [
					{ "content.isDeleted": false },
					{ "content.isDrafted": false },
					{"content.replyTo": {$ne: null}},
					{ "content.Starred": true },
				]
			}
		},
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
			},
		},
		{
			$sort: { "Correspondence.content.sent_date": -1 }
		},
		{
			$count: "count"
		},
	])

	messagesCount = messagesCount[0].count
	

	let data = await Correspondence.aggregate
		([
			{
				$sort:{
					"content.sent_date":1
				}
			},
			{
				$match: {
					$and: [
						{ "content.isDeleted": false },
						{ "content.isDrafted": false },
						// { "content.Starred": true },
						{"content.replyTo": {$ne: null}},
						{ "threadId": id }
					]
				}
			},
			{
				$group: {
					_id: "$threadId",
					Correspondence: { $push: "$$ROOT" },
				},
			},
			{
				$project: {
					"threadId": 1,
					"Correspondence.content": 1,
					"Correspondence._id": 1
				},
			},
		])

	if(data.length == 0) return null

	let length = data[0].Correspondence.length
	let lastReply = data[0].Correspondence[length - 1]._id

	let count: any = await Correspondence.aggregate([
		{
			$match: {
				$and: [
					{ "content.isDrafted": false },
				]
			}
		},
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
				isStarred: { $max: "$content.Starred" },
			},
		},
		{
			$match:{
				$and:[
					{ "isStarred": true },
					{ "Correspondence.content.isDeleted": false },
					{ "Correspondence.content.isDrafted": false },
					{ "Correspondence._id": { $gt: lastReply } }
				]
			}
		},
		{
			$sort: { "_id": -1 }
		},
		{
			$count: "count"
		},
	])

	if (count.length == 0) {
		count = 1
	} else {
		count = count[0].count + 1
	}

	return { messagesCount, data, count }
}