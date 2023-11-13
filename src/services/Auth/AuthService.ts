import jwt, { TokenExpiredError } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '@src/server';
import User, { ILogin, IRegister } from '@src/models/User';
import { NextFunction,Request,Response } from 'express';
import { BadRequestExcepetion, ForbiddenException, NotFoundException, RouteError, UnauthorizedException } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';


async function Register(req:IRegister,res:Response) {
        const findUser = await prisma.user.findUnique({
            where:{
                username:req.username
            }
        })
        if(findUser){
            throw new BadRequestExcepetion("Username Is Already Exist")
        }
        const hashed = await bcrypt.hash(req.password,10)
        const newUser = await prisma.user.create({
            data:{
                username:req.username,
                password:hashed,
                name:req.name,
                age:req.age,
                jabatan_id:req.jabatan_id
            }
        })
        return newUser
    

    
}

async function Login(req:ILogin) {
    const findUsername = await prisma.user.findUnique({
        where:{
            username:req.username
        },include:{
            jabatan: {
                include:{
                    role:true
                }
            }
            
        }
    })
    if(!findUsername){
        throw new NotFoundException ('Username Not Found')
    }

    const match = await bcrypt.compare(req.password,findUsername.password)


    if(match){
        const token = jwt.sign({id:findUsername.id,username:findUsername.username,jabatan: findUsername.jabatan?.name,role: findUsername.jabatan?.role?.name},'secret-key',{expiresIn:'1h'})
        return token
    }else{
        throw new BadRequestExcepetion("Email or Password Doesn't Match")
    }

}

    export function verifyJwt(req:Request,res:Response,next: NextFunction) {
        const token = req.header('Authorization') as string
        const secertKey = "secret-key"
        
        try {
            if(!token){
                throw new UnauthorizedException("Token Tidak Valid")
            }
            const decode = jwt.verify(token,secertKey,)
            next()
        } catch (error) {
            
            // console.log(TokenExpiredError.)
            if (error instanceof TokenExpiredError) {
                
                return res.status(401).json({
                    status: false,
                    message: 'Token Expired',
                    data: null
                });
            }else {
                res.status(error.status).send({
                    status:false,
                    message:error.message,
                    data:null
                })
            }
            
            
        }

        

    }

    export function checkRole(role : string[]){
        return (req:Request,res:Response,next:NextFunction)=>{
        try {
            const user = req.body
               if(role.includes(user.role)){
                next()
               }else{
                throw new ForbiddenException("Permission Denied")
               }
        } catch (error) {
            res.status(error.status).send({
                status:false,
                message:error.message,
                data:null
            })
        }
            
        }

    }
export default {
    Register,
    Login,
    // verifyJwt
}
