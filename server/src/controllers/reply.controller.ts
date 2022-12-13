import { Request, Response, NextFunction } from 'express';
import { Correspondence } from '../models/cors.model';
var mongoose = require('mongoose');

export const replyToMessage = async (req: Request, res: Response, next: NextFunction) => {

	const replyTo = req.body.replyTo;

	let reply = { ...req.body.data };

	if(Object.keys(reply).length === 0){
		return res.status(400).json({message:'data is not sent', errorCode:"404.003"})
	}
	reply.from_user = 'max';
	reply.from_email = 'max@gmail.com';

	reply.sent_date = new Date().toISOString();
	reply.replyTo = replyTo;

	try {
		const data = new Correspondence({
			content: reply,
			threadId: req.body.threadId
		});

		data.save();
		return res.status(200).json({ message: 'replied successfully', data: data });
	} catch (err) {
		// console.log(err);
		return next(err);
	}
};


export const getReply = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { replyId } = req.params;
		let data = await Correspondence.findById(replyId);

		if (!data)
			return res.status(404).json({
				message: 'Reply not found',
				errorCode:"404.008"
			});
		let result = { ...data.content, _id: data._id, threadId: data.threadId };
		return res.status(200).json(result);
	} catch (err) {
		// console.log(err);
		next({ message: 'Not Object reply Id' });
	}
};

export const draftReply = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { isReply = false } = req.query;
		const id = req.params.id;

		let reply = { ...req.body.data };

		if(Object.keys(reply).length === 0){
			return res.status(400).json({message:'data is not sent', errorCode:"400.003"})
		}

		let threadId = req.body.threadId;
		reply.isDrafted = true;

		if (isReply == 'false') {
			reply.from_user = 'max';
			reply.from_email = 'max@gmail.com';
		} else {
			reply.from_user = 'mohkh';
			reply.from_email = 'mohkh@gmail.com';
		}
		// reply.sent_date = new Date().toISOString();
		reply.replyTo = id;
		reply.draftedDate = new Date().toISOString();
		reply.ThreadDrafted = true

		const data = await new Correspondence({
			content: reply,
			threadId: threadId
		});

		data.save();

		if (!data) return res.status(404).json({message:'Not found', errorCode:"404.009"});

		await ThreadDrafted(threadId, true)

		return res.status(200).json({
			data: data,
			message: 'Reply Drafted Successfully'
		});
	} catch (err) {
		// console.log(err);
		return next(err);
	}
};

export const getDraftedReply = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, replyId } = req.params;

		let data = await Correspondence.findById(replyId);
		if (!data) return res.status(404).json({ message: 'This drafted Reply are not found' , errorCode:"404.010"});

		let result = { ...data.content, _id: data._id };

		return res.status(200).json(result);
	} catch (err) {
		// console.log(err);
		return next({ message: 'Not Object Id Type' });
	}
};

export const undraftReply = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, replyId } = req.params;
		let data = { ...req.body.data };
		if(Object.keys(data).length === 0){
			return res.status(400).json({message:'data is not sent', errorCode:"400.003"})
		}
		data.isDrafted = false;
		data.sent_date = new Date().toISOString();
		data.due_date = new Date(data.due_date);
		data.replyTo = req.body.replyTo;

		let draft = await Correspondence.findByIdAndDelete(replyId);

		let threadExists = await checkThreadExists(id);

		if (!threadExists) return res.status(404).json({ message: 'Thread Not exists', errorCode:"404.009" });

		if (draft != null) {
			const createdData = new Correspondence({
				content: data,
				threadId: id
			});

			createdData.save();

			await ThreadDrafted(id, false)

			return res.status(200).json({ message: 'UnDrafting process success', id:createdData._id });
		} else {
			return res.status(404).json({ message: 'Draft Not exists' , errorCode:"404.010"});
		}
	} catch (err) {
		// console.log(err);
		next({ message: 'Not Object reply Id or Thread Type' });
	}
};

const checkThreadExists = async (threadId: string) => {
	let data = await Correspondence.findOne({ threadId: threadId });
	if (!data) return false;
	else return true;
};

export const editDraft = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let draftId = req.params.draftedId;
		let data = req.body.data;
        if(!data)
            return res.status(400).json({message: 'Data is not send', errorCode:"400.003"})
		let draft = await Correspondence.findByIdAndUpdate(
			draftId,
			{
				content: data
			},
			{ new: true }
		);

		if (!draft) return res.status(404).json({message:'draft Not found', errorCode:"404.010"});

		return res.status(200).json({message:'draft edited', data:draft.content, Id:draftId});
	} catch (err) {
		// console.log(err);
		next({ message: 'Not Object reply Id' });
	}
};

const getThreadIds = async (threadId: string) =>{
	let threadIds = await Correspondence.find({threadId:threadId}, {'_id':1})
	return threadIds
}
const ThreadDrafted = async (threadId: string, isDraftExists:boolean) => {
	let threadIds = await getThreadIds(threadId)
	threadIds.forEach( async (item)=>{
		
		await Correspondence.findByIdAndUpdate({
			_id:item._id
		},{"content.ThreadDrafted":isDraftExists},{new:true})
	})

}
