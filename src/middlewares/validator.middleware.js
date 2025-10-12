import { validationResult } from "express-validator"
import {apierror} from "../utils/apierror.js"

export const validate =(req,res,next) =>{
    const errors= validationResult(req)
    if(errors.isEmpty()){
        return next()
    }
    const extractedErrors=[]
        errors.array().map((err)=> extractedErrors.push({ [err.path] : err.msg}))
        throw new apierror(422, "received data is not valid", extractedErrors)
}