

import { IAddGame, IAssigneGame, IAssignedCategory, IlistGame } from '@src/models/User';
import { app } from '@src/server';
import GameService from '@src/services/Game/GameService';
import UserService from '@src/services/User/UserService';
import { addGameValidator, assignedValidator } from '@src/services/Validations/UserValidations';
import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { requestValidator } from "../BaseController";
import { checkRole, verifyJwt} from "src/services/Auth/AuthService"

const router = express.Router()

router.post('/add',verifyJwt,addGameValidator,async(req:Request,res:Response)=>{
  await requestValidator(req,res)
    const reqDto = req.body.game
    try {
      const addGame = await GameService.addGame(reqDto)
      return res.status(200).send({
        status : true,
        message : 'Succes Create Game Data',
        data : reqDto
      })
    } catch (error) {
      res.status(400).send({
        status : false,
        message : error.message,
        data : null
      })
    }
  
  })

  router.post('/assigned',verifyJwt,assignedValidator,async(req:Request,res:Response)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
    res.status(400).send({
      status:true,
      message:error.array()
    })
  }
  try {
    const reqDto = req.body as IAssigneGame
  const assignedGame = await GameService.assignedGame(reqDto)
  res.send({
    status : true,
    message : 'Succes Assigned Game',
    data : assignedGame
  })
  
  } catch (error) {
    res.status(400).send({
      status : false,
      message : error.message,
      data : null
    })
  }
  
  })

  router.get ('/listGameUser',verifyJwt,async(req:Request,res:Response)=>{
    try {
      const listGameUser = await GameService.listGameUser()
      res.send({
        status : true,
        message : 'Success',
        data : listGameUser
      })
    } catch (error) {
      
    }
  })

  router.post ('/assigned/category',verifyJwt,async(req:Request,res:Response)=>{
    try {
      const reqDto = req.body as IAssignedCategory
      const assignedCategory = await GameService.assignedCategory(reqDto)
      res.send({
        status:true,
        message:"Success",
        data:reqDto
      })
    } catch (error) {
      
    }
  })

  router.get('/list',async(req:Request,res:Response)=>{
    try {
      const reqDto:IlistGame = {page:Number(req.query.page),per_page:Number(req.query.per_page)}
      const listGame =  await GameService.listGame(reqDto)
      res.status(200).send(listGame)
    } catch (error) {
      res.status(400).send({
        status : false,
        message : error.message,
        data : null
      })
    }
  })


  
export default router