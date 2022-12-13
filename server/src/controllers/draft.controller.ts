import { Request, Response, NextFunction } from "express";
import { Correspondence } from "../models/cors.model";

export const draftMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let data = { ...req.body.data };

		if (Object.keys(data).length === 0) return res.status(400).json({ message: "Data not sent" , errorCode:"400.003"})
		data.sent_date = new Date().toISOString();
		// data.due_date = new Date(data.due_date);
		data.isDrafted = true
		data.ThreadDrafted = true
		data.replyTo = null
		data.draftedDate = new Date().toISOString();
		const correspondence = new Correspondence({
			"content": data

		})
		await correspondence.save()
		return res.status(200).json({ data: correspondence, message: "Drafted Successfully" })

	} catch (err) {
		console.log(err);
		return next()
	}
}

export const getDraftedMessages = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let { page = 1, limit = 20 }: any = req.query;
	try {
		if (page <= 0)
			page = 1
		if (limit <= 0)
			limit = 20
		let data = await Correspondence.aggregate
			([
				{
					$group: {
						_id: "$threadId",

						Correspondence: { $push: "$$ROOT" },
						isStarred: { $max: "$content.Starred" },
						isDrafted: { $max: "$content.isDrafted" },

					},
				},
				{
					$match: {
						$and: [
							{ "Correspondence.content.isDeleted": false },
							{ "isDrafted": true }
						]
					}
				},
				{
					$project: {
						"threadId": 1,
						"Correspondence.content": 1,
						"Correspondence._id": 1,
						"isStarred": 1,
						"isDrafted": 1
					},
				},
				{
					$sort: { "Correspondence.content.draftedDate": -1 }
				},

				{
					$skip: (page - 1) * limit
				},
				{
					$limit: (limit * 1)
				}

			])

		data = formatDraftedMessages(data)

		if (data.length == 0) return res.status(404).json({ message: "Drafted Message not found", errorCode:"404.006" });

		let count = await getDraftedCount()

		return res.json({
			data,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
			numOfRecords: count,
			limit: limit,
			message: 'Drafted Message returned Successfully'
		});
	} catch (err) {
		console.log(err);
		return next(err)
	}
}

const formatDraftedMessages = (data: any) => {

	return data.map((item: any) => {
		let length = item.Correspondence.length - 1;
		let isDraftedReplyExists = false
		if (item.Correspondence[length].content.replyTo != null)
			isDraftedReplyExists = true
		return { threadId: item._id, _id: item.Correspondence[length]._id, ...item.Correspondence[length].content, ThreadStarred: item.isStarred, isDraftedReplyExists: isDraftedReplyExists }
	})

}

const getDraftedCount = async () => {
	let count: any = await Correspondence.aggregate
		([
			{
				$group: {
					_id: "$threadId",
					Correspondence: { $push: "$$ROOT" },
					isStarred: { $max: "$content.Starred" },
					isDrafted: { $max: "$content.isDrafted" },
				},
			},
			{
				$match: {
					$and: [
						{ "Correspondence.content.isDeleted": false },
						// { "Correspondence.content.isDrafted": false },
						{ "isDrafted": true }
					]
				}
			},
			{
				$count: "count"
			}
		])

	if (count.length != 0)
		count = count[0].count

	return count
}

export const getDraftedMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let id = req.params.id;
		let data = await Correspondence.findById(id);

		if (!data) return res.status(404).json({ message: 'Draft Message is not found',errorCode:"404.010" })
		let response = { ...data?.content, _id: data?._id }
		return res.status(200).json({ message: 'Draft Message returned Successfully', data: response })
	} catch (err) {
		console.log(err)
		return next({ message: 'Drafted Id is invalid' , errorCode:"500.004"})
	}
}

export const unDraftMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { draft = false }: any = req.query;
		let id = req.params.id;
		let data = { ...req.body.data }

		if (!JSON.parse(draft)) {
			data.isDrafted = false
			data.sent_date = new Date().toISOString();
			data.due_date = new Date(data.due_date);
			data.replyTo = "none"
			data.ThreadDrafted = false
		}

		let draftedCors = await Correspondence.findByIdAndDelete(id);

		if (!draftedCors) return res.status(404).json({ message: "Draft Message is not found", errorCode:"404.010" })

		let cors = new Correspondence({
			"content": data
		})
		cors.save()

		return res.status(200).json({ data: cors, message: 'Message undrafted successfully' })
		
	} catch (err) {
		console.log(err)
		return next({ message: 'Invalid Draft Id', errorCode: "500.004" })
	}
}

