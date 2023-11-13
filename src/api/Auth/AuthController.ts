import { ILogin, IRegister } from '@src/models/User';
import AuthService from '@src/services/Auth/AuthService';
import { registerValidator } from '@src/services/Validations/UserValidations';
import express, { Request, Response } from 'express';
import { requestValidator } from '../BaseController';
import { BadRequestExcepetion, NotFoundException, RouteError } from '@src/other/classes';

const router = express.Router()
router.post('/register',registerValidator,async(req:Request,res:Response)=>{
    await requestValidator(req,res)
    try {
        const reqDto = req.body as IRegister
        const register = await AuthService.Register(reqDto,res)
        console.log(register)
        res.status(200).send({
            status:true,
            message:'Success',
            data:register
        })
    } catch (error) {
        if(error.status){
            return res.status(error.status).send({
                status:false,
                message:error.message,
                data:null
            })
        }else{
            return res.status(500).send({
                status:false,
                message:error.message,
                data:null
            })
        }
    }
})
router.post('/login',async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body as ILogin
        const login = await AuthService.Login(reqDto)
        res.status(200).send({
            status:true,
            message:('Success Login'),
            data:login
        })
    } catch (error) {
        if(error.status){
            res.status(error.status).send({
                status:false,
                message:error.message,
                data:null
            })
        }else{
            res.status(500).send({
                status:false,
                message:error.message,
                data:null
            })
        }
    }
})

export default router