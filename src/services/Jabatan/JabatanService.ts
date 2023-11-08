import { IassignedJabatan, IreqAssignJabatan } from "@src/models/Jabatan";
import { prisma } from "@src/server";

async function assignedjabatan(req:IassignedJabatan) {
    const findjabatan = await prisma.jabatan.findUnique({
        where : {
            id:req.id
        }
    })
    
    if(!findjabatan){
        throw new Error ('Failed Find Jabatan')
    }

    const assignedjabatan = await prisma.jabatan.update({
        where:{
            id:req.id
        },
        data:{role_id:req.role_id}
    })
    return assignedjabatan
    
}

async function listJabatan() {
    const query = await prisma.jabatan.findMany({
        orderBy:{
            name :"asc"
        }
    })
    if(!query){
        throw new Error('Data Not Found')
    }
    return query
}

export default{
    assignedjabatan,
    listJabatan
}