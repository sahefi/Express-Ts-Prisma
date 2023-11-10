import { IDeleteUser, IReqFilter, IUpdateUser, IlistUser } from "@src/models/User";
import { prisma } from "@src/server";
import UserService from "@src/services/User/UserService";
import { createValidator, deleteValidator, updateValidator } from "@src/services/Validations/UserValidations";
import express, { Request, Response } from 'express';
import { validationResult } from "express-validator";
import { requestValidator } from "../BaseController";
import {checkRole, verifyJwt} from "src/services/Auth/AuthService"


const router = express.Router()

// router.post('/add',createValidator,async(req: Request, res: Response)=>{
//    await requestValidator(req,res)
//    const dataUser = req.body.user
//    try {
//      const newUser = await UserService.createUser(dataUser)
//      return res.send({
//       status : true,
//       message: 'Success Create Data',
//       data:dataUser
//      })
//    } catch (error) {
//     res.status(500).send({
//       status: false,
//       message: "Error: " + error.message,
//       data: null,
//     })
//    }
  
//   })

  router.get('/all',verifyJwt,checkRole(['Admin']),async(req: Request, res: Response) => {
    await requestValidator(req,res)
    const filter_nama = req.query.filter_nama as String
    try {
        console.log(filter_nama)
        const userList = await UserService.getUser(filter_nama);
        res.send({
          status:true,
          message:'Succes Get Data',
          data:userList
        })

    } catch (error) {
      res.status(500).send({
        status: false,
        message: "Error: " + error.message,
        data: null,
      });
    }

    
})

router.get('/detail/:id',verifyJwt,async(req:Request,res:Response)=>{
    const id = req.params.id;
  
    try {
      const userDetail = await UserService.getDetail(id)
  
      res.send({
        status: true,
        message: "Success Get Detail",
        data: userDetail,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "Error: " + error.message,
        data: null,
      });
    }
  
  })

  router.post('/update',verifyJwt,updateValidator,async(req:Request,res:Response)=>{
    await requestValidator(req,res)
    const reqDto = req.body as IUpdateUser
  
    const userId = await UserService.updateUser(reqDto)
    res.send({
      status:true,
      message:'Succes Update Data',
      data: reqDto
    })
  })

  router.delete('/delete',verifyJwt,async(req:Request,res:Response)=>{
    const id = req.body.id
    const userDelete = await prisma.user.delete({
      where:{
        id:id
      }
    })
    return res.send({
      status : true,
      message : "Succes Delete",
      data : userDelete 
    })
  })

  router.delete('/softdelete',verifyJwt,deleteValidator,async(req:Request,res:Response)=>{
    await requestValidator(req,res)
    try {
    const reqDto = req.body as IDeleteUser
    const deletUser = await UserService.deletUser(reqDto)
    res.send({
      status:true,
      message: 'Succes Delete Data',
      data:deletUser
    })
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "Error: " + error.message,
        data: null,
      });
    }
    
     
  })

  router.post('/restore',verifyJwt,async(req:Request,res:Response)=>{
    const {id} = req.body
    
    const restore = await prisma.user.update({
      where: {
        id:id
      },
      data :{
        deletedAt : null
      }
    }) 
    return res.send({
      status : true,
      message : "Succes Restore Data",
      data : restore
    })
  })

  router.get ('/listUserGame',verifyJwt,async(req:Request,res:Response)=>{
    const nama:IReqFilter = {name_user: req.query.name_user as string,name_game: req.query.name_game as string}
    console.log(nama)
    const listUserGame = await UserService.listUserGame(nama)
    res.send({
        status:true,
        messgae:'success',
        data:listUserGame

    })
  })

    router.get ('/list',async(req:Request,res:Response)=>{
      const reqDto:IlistUser = {page:Number(req.query.page),per_page:Number(req.query.per_page),filter_name:req.query.filter_name as string}
      console.log(req.query.filter_name)
      const listUser = await UserService.listUser(reqDto)
      res.status(200).send(listUser)
    })
  export default router
  