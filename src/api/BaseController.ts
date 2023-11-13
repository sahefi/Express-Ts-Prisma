import { Request, Response } from "express";
import { validationResult } from "express-validator";




    async function requestValidator(request: Request,response: Response){
        const error = validationResult(request)
    if(!error.isEmpty()){
      
      response.status(400).send({
        status:true,
        message:error.array().map((item)=>item.msg).join('')
      })
    }
    }


export {
    requestValidator
}
// @param request

