import { Request, Response, NextFunction } from "express";
import {formSchema} from "../models/corsForm.model"


export const renderForm = (req:Request, res:Response, next:NextFunction) => {
    try {
        let form = formSchema
        return res.status(200).json(form)
    } catch (err) {
        console.log(err)
        return next(err)
    }
}