import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IassignedJabatan, IlistJabatan, IreqAssignJabatan } from '@src/models/Jabatan';
import { checkRole, verifyJwt } from '@src/services/Auth/AuthService';
import JabatanService from '@src/services/Jabatan/JabatanService';
import express, { Request, Response, Router } from 'express';
import { Result } from 'express-validator';

const router = express.Router()

router.post('/AssignedJabatan',verifyJwt,async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body.assigned as IassignedJabatan
        const AssignJabtan = await JabatanService.assignedjabatan(reqDto)
        res.status(200).send({
            status:true,
            message:'success',
            data:reqDto
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

router.get('/list',verifyJwt,checkRole(['Admin']),async(req:Request,res:Response)=>{
    try {
        const reqDto:IlistJabatan = {page:Number(req.query.page),per_page:Number(req.query.per_page),name_role:req.query.name_role as string,name_jabatan:req.query.name_jabatan as string}
        const listJabatan = await JabatanService.listjabatan(reqDto)
        res.status(HttpStatusCodes.OK).send(listJabatan)
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
