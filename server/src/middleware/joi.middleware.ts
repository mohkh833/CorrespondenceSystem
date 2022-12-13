import { NextFunction , Request, Response} from "express";
const Joi = require('joi'); 

export const middleware = (schema:any) => {
    return (req:Request, res:Response, next:NextFunction) => {
        console.log(req.body.data)
        const {error} = schema.validate(req.body.data,{abortEarly:false}); 
        const valid = error == null
        
        if(valid){
            next();
        } else {
            const {details} = error
            let errorCodes:any = []
            // const message = details.map((i:any )=> i.message).join(',')
            // console.log("error", message)
            details.map((item:any)=>{
                errorCodes.push(item.message)
            })
            res.status(422).json({ error: details, errorCodes:errorCodes}) 
        }

    }
}