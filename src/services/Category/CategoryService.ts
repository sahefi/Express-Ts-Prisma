import { IAddCategory, IrespListCategoryGame } from "@src/models/Category";
import { prisma } from "@src/server";

async function listCategory() {
    const query = await prisma.category.findMany({
        include:{
            games:true
        }
    })

    const result:IrespListCategoryGame[] = query.map((category)=>({
        id_category : category.id,
        name_category : category.name,
        game: category.games.map((game)=>({
            id_game : game.id,
            name_game : game.name
        }))
    }))
    if(!result){
        throw new Error ('Data Not Found')
    }
    return result
}

async function addCategory(req:IAddCategory) {
    const addCategory = await prisma.category.createMany({
        data:req,
    })
    
    return addCategory
}

export default {
    listCategory,
    addCategory
}

