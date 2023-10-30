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
import User from './models/User';


// **** Variables **** //
const { body,query, param, check, validationResult } = require('express-validator');
const app = express();
const prisma = new PrismaClient()

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

app.post('/users/add',async(req: Request, res: Response)=>{
  try {
    const dataUser = req.body.user
    const newUser = await prisma.user.createMany({
      data:dataUser,
      skipDuplicates: true
    })
    return res.send({
      status : true,
      message : "Succes Create Users",
      data : dataUser
    })
  } catch (error) {
    return res.status(400).send({
      status : true,
      message : "Failed Create Users",
      data : null
    })
  }
})

// Redirect to login if not logged in.
app.get('/users/all', async(req: Request, res: Response) => {
  try {
    const {filter_nama} = req.query

    if(!filter_nama){    
      const user = await prisma.user.findMany({
        where:{
          deletedAt:null
        },orderBy:{
          nama : "asc"
        }
      })

      return res.send({
        Status : true,
        message : "Succes",
        data : user
      })
    }else{
      const user = await prisma.user.findMany({
        where:{
          nama:{
            mode: 'insensitive',
            contains: String(filter_nama)
          },
          deletedAt:null
        }
      })
      return res.send({
        status: true,
        message:'berhasil',
        data: user
      })
    }
  } catch (error) {
    return res.status(400).send({
      Status : false,
      message : "Failed",
      data : []
    })
  }
});

app.get('/user/detail/:id',async(req:Request,res:Response)=>{
    const id = req.params.id
    
    
    const userDetail = await prisma.user.findUnique({
      where:{
        id:id 
      }
    })
    if(!userDetail){
      throw Error ("Detail Not found")
    }
    return res.send({
      status : true,
      message : "Succes Get Detail",
      data : userDetail 
    })

})

app.post('/user/update',async(req:Request,res:Response)=>{
  const nama = req.body.nama
  const id = req.body.id

  const userId = await prisma.user.findUnique({
    where:{
      id:id
    }
  })
  if(!userId){
    throw Error ("Detail Not found")
  }
  

  const userUpdate = await prisma.user.update({
    where:{
      id
    },
    data:{nama}

  })
  return res.send({
    status : true,
    message : "Succes Update",
    data : userUpdate 
  })


})

app.delete('/user/delete',async(req:Request,res:Response)=>{
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

app.delete('/user/softdelete',async(req:Request,res:Response)=>{
  const {id} = req.body
  const now = new Date()
  const softDelete = await prisma.user.update({
      where: {
        id:id
      },
      data:{
        deletedAt: now
      }
    })
    return res.send({
      status : true,
      message : 'Succes Delete',
      data : softDelete
    })
   
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

app.post('/game/add',
[ 
body('game').isArray(),
body('game.*.nama').notEmpty().withMessage('Tidak Boleh Kosong').isString().withMessage('Harus String'),
],
async(req:Request,res:Response)=>{
  const error = validationResult(req)
  if(!error.isEmpty()){
  res.status(400).send({
    status:true,
    message:error.array()
  })
}
  const gameData = req.body.game
  try {
    for(const data of gameData){
      const existingGame = await prisma.game.findUnique({
      where:{
        nama:data.nama
      }
    })
    if(existingGame){
      return res.status(400).send({
        status : false,
        message : 'Game Already Exist',
        data : null
        
      })
    }
    }
    const addGame = await prisma.game.createMany({
      data:gameData
    })
    return res.status(200).send({
      status : true,
      message : 'Succes Create Game Data',
      data : gameData
    })
  } catch (error) {
    
    
    res.status(400).send({
      status : false,
      message : error.message,
      data : null
    })
  }

})




// **** Export default **** //

export default app;
