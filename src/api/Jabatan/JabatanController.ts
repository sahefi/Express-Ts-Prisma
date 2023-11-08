import { IassignedJabatan, IreqAssignJabatan } from '@src/models/Jabatan';
import { verifyJwt } from '@src/services/Auth/AuthService';
import JabatanService from '@src/services/Jabatan/JabatanService';
import express, { Request, Response, Router } from 'express';

const router = express.Router()

router.post('/AssignedJabatan', verifyJwt,async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body.assigned as IassignedJabatan
        const AssignJabtan = await JabatanService.assignedjabatan(reqDto)
        res.status(200).send({
            status:true,
            message:'success',
            data:reqDto
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Error: " + error.message,
            data: null,
    })
}
})

router.get('/listjabatan',verifyJwt,async(req:Request,res:Response)=>{
    try {
        const getJabatan = await JabatanService.listJabatan()
        res.status(200).send({
            status:true,
            message:'Success',
            data:getJabatan
        })
    } catch (error) {
        res.status(500).send({
            status:false,
            message: "Error" + error.message,
            data:null
        })
        
    }
})
export default router
