import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '@src/server';
import { ILogin, IRegister } from '@src/models/User';
import { NextFunction,Request,Response } from 'express';


async function Register(req:IRegister) {
        const findUser = await prisma.user.findUnique({
            where:{
                username:req.username
            }
        })
        if(findUser){
            throw new Error('username Is Already Exist')
        }
        const hashed = await bcrypt.hash(req.password,10)
        const newUser = await prisma.user.create({
            data:{
                username:req.username,
                password:hashed,
                name:req.name,
                age:req.age
            }
        })
        return newUser
    

    
}

async function Login(req:ILogin) {
    const findUsername = await prisma.user.findUnique({
        where:{
            username:req.username
        }
    })
    if(!findUsername){
        throw new Error ('Username Not Found')
    }

    const match = await bcrypt.compare(req.password,findUsername.password)

    if(match){
        const token = jwt.sign({id:findUsername.id,username:findUsername.username},'secret-key',{expiresIn:'1h'})
        return token
    }else{
        throw new Error("Email or Password doesn't match")
    }
}

    export function verifyJwt(req:Request,res:Response,next: NextFunction) {
        const token = req.header('Authorization') as string
        const secertKey = "secret-key"

        try {
            const verify = jwt.verify(token,secertKey)
        } catch (error) {
            return res.send({
                status:false,
                message:'Token tidak valid'
            })
        }

        next()

    }
export default {
    Register,
    Login,
    // verifyJwt
}
