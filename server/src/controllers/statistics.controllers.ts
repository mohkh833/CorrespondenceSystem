import { Request, Response, NextFunction } from "express";
import { Correspondence } from "../models/cors.model";



export const getMessageStats = async(
    req:Request,
    res:Response,
	next:NextFunction
) => {

	try{
		
		const {starredCount, draftedCount, trashedCount, unreadCount, sentCount} = await getCount()
	
		// let test = await getCount()
		res.status(200).json(
			{
				unreadCount,
				starredCount,
				trashedCount,
				draftedCount,
				sentCount,
			}
		)
	} catch(err){
		console.log(err)
		next(err)
	}

}

export const getCount = async () => {
	const unreadCount = await Correspondence.countDocuments({ "content.isDeleted": false, "content.isDrafted": false, "content.message_status": 'sent'})
	const sentCount = await Correspondence.countDocuments({ "content.isDeleted": false, "content.isDrafted": false, "content.from_user": 'mohkh' })

	let data = await Correspondence.aggregate
	([
		{
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
				isStarred: { $max: "$content.Starred" },
				isTrashed: { $max: "$content.isDeleted" },
				isDrafted: { $max: "$content.isDrafted" },

			},
		},
		{
			$project: {
				"threadId": 1,
				"isStarred": 1,
				"isTrashed":1,
				"isDrafted":1
			},
		},
		{
			$sort: { "Correspondence.content.sent_date": -1 }
		},

	])
	let starredCount = 0;
	let trashedCount = 0;
	let draftedCount = 0;
	data.map((item)=>{
		if(item.isStarred && !item.isTrashed){
			starredCount++;
		}
		if(item.isTrashed ){
			trashedCount++;
		}
		if(item.isDrafted && !item.isTrashed){
			draftedCount++;
		}
	})
	// console.log(starCount,trashCount, draftedCount)
	return {starredCount,trashedCount, draftedCount, unreadCount, sentCount}
}



