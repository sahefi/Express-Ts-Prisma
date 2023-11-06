import { ExpressValidator } from "express-validator";
import express, { Request, Response } from 'express';
import CategoryService from "@src/services/Category/CategoryService";
import { IAddCategory } from "@src/models/Category";
import { requestValidator } from "../BaseController";
import{verifyJwt} from "src/services/Auth/AuthService"

const router = express.Router()
router.get ('/ListCategorygame',verifyJwt,async(req:Request,res:Response)=>{
try {
    const ListCategoryGame = await CategoryService.listCategory()
        res.status(200).send({
            status:true,
            message:'Success',
            data:ListCategoryGame
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Error: " + error.message,
            data: null,
        });
    }
})

router.get('/add',verifyJwt,async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body.category
        const categoryAdd = await CategoryService.addCategory(reqDto)
        res.status(200).send({
            status:true,
            message:'Success',
            data:reqDto
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Error: " + error.message,
            data: null,
        });
    }
})

export default router