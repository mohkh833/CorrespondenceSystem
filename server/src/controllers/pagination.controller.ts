import { Request, Response, NextFunction } from "express";
import { Correspondence } from "../models/cors.model";
var mongoose = require('mongoose');

export const paginationNext = async (
    req:Request,
    res:Response,
	next:NextFunction
) =>{
    try {
		const currentId = req.params.id
		let lastReply = req.params.lastReply
		
		const { title = "home" }: any = req.query;
		let data
		if (title === "starred") {
			data = await starPaginationNext(lastReply, currentId)
		}
		else if (title === "trash") {
			data = await trashPaginationNext(lastReply, currentId)
		}
		else {
			/*	 
				first we sort by Ids to get the last reply Id in the top of the grouping array then we make a idForSort to get the last reply ID outside the stage then we do the match (!= threadId) and then we do greater than sorting to get the next one
			*/
			data = await inboxPaginationNext(lastReply, currentId)
		}
		
		if (data.length == 0) return res.status(404).json({message:"There is no next thread found", errorCode: "404.009" })
		return res.status(200).json(data);
	} catch (err) {
		console.log(err)
		return next(err)
	}
}

export const paginationPrev = async (
    req:Request,
    res:Response,
	next:NextFunction
) => {
    try {
		let currentId = req.params.id
		let lastReply = req.params.lastReply
		const { title = "home" }: any = req.query;
		let data
		if (title === "starred") {
			data = await starPaginationPrev(lastReply, currentId)
		}
		else if (title === "trash") {
			data = await trashPaginationPrev(lastReply, currentId)
		}
		else {
			/*	 
				first we sort by Ids to get the last reply Id in the top of the grouping array then we make a idForSort desc to get higher ids sorted to get the last reply ID outside the stage then we do the match (!= threadId) and then we do less than sorting to get the next one
			*/
			data = await inboxPaginationPrev(lastReply, currentId)
		}
		if (data.length==0) return res.status(404).json({message:"There is no prev thread found" , errorCode: "404.009"})
		return res.status(200).json(data);
	} catch (err) {
		console.log(err)
		return next(err)
	}
}

const starPaginationNext = async (lastReply: string, currentId: string) => {
	currentId = mongoose.Types.ObjectId(currentId)
	let id =  mongoose.Types.ObjectId(lastReply)
	let data = await Correspondence.aggregate([
		{$match:{
			$and:[
				{"content.isDrafted":false}
			]
		}},
		{
			$group:{
				_id: "$threadId",
				Correspondence: {$push:"$$ROOT"},
				idForSort:{"$last": "$_id"}
			},
		},
		{
			$match:{
				$and:[
					{"Correspondence.content.isDeleted": false},
					// {"Correspondence.content.replyTo":{$ne: null}},
					{"Correspondence.content.Starred": true},
					{"idForSort":{$gt:id }},
					{"_id": {$ne:  currentId }},
				]
			}
		},
		{
			$sort:{"idForSort": 1}
		}
	])
	return data
}

const starPaginationPrev = async (lastReply: string, currentId: string) => {
	currentId = mongoose.Types.ObjectId(currentId)
	let id =  mongoose.Types.ObjectId(lastReply)
	let data = await Correspondence.aggregate([
		{$match:{
			$and:[
				{"content.isDrafted":false}
			]
		}},
		{
			$group:{
				_id: "$threadId",
				Correspondence: {$push:"$$ROOT"},
				idForSort:{"$last": "$_id"}
			},
		},
		{
			$match:{
				$and:[
					{"Correspondence.content.isDeleted": false},
					{"Correspondence.content.Starred": true},
					{"Correspondence.content.isDrafted": false},
					// {"Correspondence.content.replyTo":{$ne: null}},
					{"idForSort":{$lt:id }},
					{"_id": {$ne:  currentId }},
				]
			}
		},
		{
			$sort:{"idForSort": -1}
		}
	])
	return data
}

const inboxPaginationNext = async (lastReply: string, currentId: string) => {
	currentId = mongoose.Types.ObjectId(currentId)
	let id =  mongoose.Types.ObjectId(lastReply)
	// let data = await Correspondence.aggregate([
	// 	{
	// 		$sort: {"_id": -1}
	// 	},
	// 	{
	// 		$group:{
	// 			_id: "$threadId",
	// 			Correspondence: {$push:"$$ROOT"},
	// 			idForSort:{"$first": "$_id"}
	// 		},
	// 	},
	// 	{
	// 		$sort: {"idForSort": 1}
	// 	},
	// 	{
	// 		$match:{
	// 			$and:[
	// 				{"Correspondence.content.isDeleted": false},
	// 				// {"Correspondence.content.isDrafted": false},
	// 				{"Correspondence.content.replyTo":{$ne: null}},
					
	// 				{"idForSort":{$gt:id }},
	// 				{"_id": {$ne:  currentId }},
	// 			],
	// 		},
	// 	},
	// ])0
	let data = await Correspondence.aggregate([
		{$match:{
			$and:[
				{"content.isDrafted":false}
			]
		}},
		{
			$group:{
				_id: "$threadId",
				Correspondence: {$push:"$$ROOT"},
				idForSort:{"$last": "$_id"}
			},
		},
		{
			$match:{
				$and:[
					{"Correspondence.content.isDeleted": false},
					// {"Correspondence.content.replyTo":{$ne: null}},
					{"idForSort":{$gt:id }},
					{"_id": {$ne:  currentId }},
				]
			}
		},
		{
			$sort:{"idForSort": 1}
		}
	])
	return data
}

const inboxPaginationPrev = async (lastReply: string, currentId:string) => {
	currentId = mongoose.Types.ObjectId(currentId)
	let id =  mongoose.Types.ObjectId(lastReply)
	let data = await Correspondence.aggregate([
		{$match:{
			$and:[
				{"content.isDrafted":false}
			]
		}},
		{
			$group:{
				_id: "$threadId",
				Correspondence: {$push:"$$ROOT"},
				idForSort:{"$last": "$_id"}
			},
		},
		{
			$match:{
				$and:[
					{"Correspondence.content.isDeleted": false},
					// {"Correspondence.content.replyTo":{$ne: null}},
					{"idForSort":{$lt:id }},
					{"_id": {$ne:  currentId }},
				]
			}
		},
		{
			$sort:{"idForSort": -1}
		}
	])
	return data
}

const trashPaginationPrev = async(lastReply: string, currentId: string) =>{
	currentId = mongoose.Types.ObjectId(currentId)
	let id =  mongoose.Types.ObjectId(lastReply)
	return await Correspondence.aggregate([
		{$match:{
			$and:[
				{"content.isDrafted":false},
				{"content.isDeleted":true}
			]
		}},
		{
			$sort: {"_id": -1}
		},
		{
			$group:{
				_id: "$threadId",
				Correspondence: {$push:"$$ROOT"},
				idForSort:{"$first": "$_id"}
			},
		},
		{
			$sort: {"idForSort": -1}
		},
		{
			$match:{
				$and:[
					{"Correspondence.content.isDeleted": true},
					{"_id": {$ne:  currentId }},
					
					{"idForSort":{$lt:id }}
				]
			},
		},
	]).limit(1)
}

const trashPaginationNext = async(lastReply: string, currentId: string)  => {
	currentId = mongoose.Types.ObjectId(currentId)
	let id =  mongoose.Types.ObjectId(lastReply)
	return await Correspondence.aggregate([
		{$match:{
			$and:[
				{"content.isDrafted":false},
				{"content.isDeleted":true}
			]
		}},
		{
			$sort: {"_id": -1}
		},
		{
			$group:{
				_id: "$threadId",
				Correspondence: {$push:"$$ROOT"},
				idForSort:{"$first": "$_id"}
			},
		},
		{
			$sort: {"idForSort": 1}
		},
		{
			$match:{
				$and:[
					{"Correspondence.content.isDeleted": true},
					{"_id": {$ne:  currentId }},
					{"idForSort":{$gt:id }}
				]
			},
		},
	]).limit(1)
}