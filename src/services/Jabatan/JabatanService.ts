import { IassignedJabatan, IlistJabatan, } from "@src/models/Jabatan";
import { NotFoundException } from "@src/other/classes";
import { prisma } from "@src/server";

async function assignedjabatan(req:IassignedJabatan) {
    const findjabatan = await prisma.jabatan.findUnique({
        where : {
            id:req.id
        }
    })
    
    if(!findjabatan){
        throw new NotFoundException ('Failed Find Jabatan')
    }

    const assignedjabatan = await prisma.jabatan.update({
        where:{
            id:req.id
        },
        data:{role_id:req.role_id}
    })


    
    return assignedjabatan
    
}

// async function listJabatan() {
//     const query = await prisma.jabatan.findMany({
//         orderBy:{
//             name :"asc"
//         }
//     })
//     if(!query){
//         throw new Error('Data Not Found')
//     }
//     return query
// }

async function listjabatan(req:IlistJabatan) {
    const page = +req.page||1
    const take = +req.per_page||10
    const skip = (page-1)*take
    const nextPage = page+1
    const prevPage = page-1
    const listJabatan = await prisma.jabatan.findMany({
        skip:skip,take:take,
        where:{
            name:{
            contains:req.name_jabatan,
            mode:'insensitive',
            },role:{
                name:{
                    contains:req.name_role,
                    mode:'insensitive',
                },
            },
        },
        orderBy:{
            name:'asc'
        },select:{
            id:true,
            name:true,
            role:{
                select:{
                    name:true
                }
            }
        }
    })
    const result = listJabatan.map((item)=>({
        id: item.id,
        name_jabatan: item.name,
        nama_role: item?.role?.name
    }))
    return{
        page: page,
        per_page: take,
        next_page: nextPage,
        prev_page: prevPage,
        status: true,
        message: 'Success Retrieve Data Jabatan',
        data:result,
    }
    
}

export default{
    assignedjabatan,
    listjabatan
}