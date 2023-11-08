/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import BaseRouter from '@src/routes/api';
import Paths from '@src/constants/Paths';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';
import {PrismaClient} from "@prisma/client"
import User, { IAddGame, IAssigneGame, IDeleteUser, IUpdateUser } from './models/User';
import UserService from './services/User/UserService';
import { addGameValidator, assignedValidator, createValidator, deleteValidator, updateValidator } from './services/Validations/UserValidations';
import userController from './api/User/userController';
import gameController from './api/Game/gameController';
import categoryController from './api/Category/categoryController';
import authController from './api/Auth/AuthController';
import jabatanController from './api/Jabatan/JabatanController'


// **** Variables **** //
const { body,query, param, check, validationResult } = require('express-validator');
const app = express();
const router = express.Router()
const prisma = new PrismaClient()
app.locals.prisma = prisma;

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});


// ** Front-End Content ** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to users pg by default
app.get('/', (_: Request, res: Response) => {
  return res.redirect('/users');
});

app.use('/users',userController)
app.use('/game',gameController)
app.use('/category',categoryController)
app.use('/auth',authController)
app.use('/jabatan',jabatanController)

// app.post('/users/add',createValidator,async(req: Request, res: Response)=>{
//   const error = validationResult(req)
//   if(!error.isEmpty()){
//     res.status(400).send({
//       status:true,
//       message:error.array()
//     })
//   }
//   const dataUser = req.body.user
//  try {
//    const newUser = await UserService.createUser(dataUser)
//    return res.send({
//     status : true,
//     message: 'Success Create Data',
//     data:dataUser
//    })
//  } catch (error) {
//   res.status(500).send({
//     status: false,
//     message: "Error: " + error.message,
//     data: null,
//   })
//  }

// })

// Redirect to login if not logged in.
// app.get('/users/all', async(req: Request, res: Response) => {
//     const filter_nama = req.query.filter_nama as String
//     try {
//         console.log(filter_nama)
//         const userList = await UserService.getUser(filter_nama);
//         res.send({
//           status:true,
//           message:'Succes Get Data',
//           data:userList
//         })

//     } catch (error) {
//       res.status(500).send({
//         status: false,
//         message: "Error: " + error.message,
//         data: null,
//       });
//     }

    
// });

// app.get('/user/detail/:id',async(req:Request,res:Response)=>{
//   const id = req.params.id;

//   try {
//     const userDetail = await UserService.getDetail(id)

//     res.send({
//       status: true,
//       message: "Success Get Detail",
//       data: userDetail,
//     });
//   } catch (error) {
//     res.status(500).send({
//       status: false,
//       message: "Error: " + error.message,
//       data: null,
//     });
//   }

// })

// app.post('/user/update',updateValidator,async(req:Request,res:Response)=>{
//   const error = validationResult(req)
//   if(!error.isEmpty()){
//   res.status(400).send({
//     status:true,
//     message:error.array()
//   })
// }
//   const reqDto = req.body as IUpdateUser

//   const userId = await UserService.updateUser(reqDto)
//   res.send({
//     status:true,
//     message:'Succes Update Data',
//     data: reqDto
//   })
// })

// app.delete('/user/delete',async(req:Request,res:Response)=>{
//   const id = req.body.id
//   const userDelete = await prisma.user.delete({
//     where:{
//       id:id
//     }
//   })
//   return res.send({
//     status : true,
//     message : "Succes Delete",
//     data : userDelete 
//   })
// })

app.delete('/user/softdelete',deleteValidator,async(req:Request,res:Response)=>{
  const error = validationResult(req)
  if(!error.isEmpty()){
    res.status(400).send({
    status:true,
    message:error.array()
    })
  }
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

app.post('/user/restore',async(req:Request,res:Response)=>{
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

//Game End Point

// app.post('/game/add',addGameValidator,async(req:Request,res:Response)=>{
//   const error = validationResult(req)
//   if(!error.isEmpty()){
//   res.status(400).send({
//     status:true,
//     message:error.array()
//   })
// }
//   const reqDto = req.body.game 
//   try {
//     const addGame = await UserService.addGame(reqDto)
//     return res.status(200).send({
//       status : true,
//       message : 'Succes Create Game Data',
//       data : reqDto
//     })
//   } catch (error) {
//     res.status(400).send({
//       status : false,
//       message : error.message,
//       data : null
//     })
//   }

// })

// app.post('/game/assigned',assignedValidator,async(req:Request,res:Response)=>{
//   const error = validationResult(req)
//   if(!error.isEmpty()){
//   res.status(400).send({
//     status:true,
//     message:error.array()
//   })
// }
// try {
//   const reqDto = req.body as IAssigneGame
// const assignedGame = await UserService.assignedGame(reqDto)
// res.send({
//   status : true,
//   message : 'Succes Assigned Game',
//   data : assignedGame
// })

// } catch (error) {
//   res.status(400).send({
//     status : false,
//     message : error.message,
//     data : null
//   })
// }

// })




// **** Export default **** //

export { app, prisma };
