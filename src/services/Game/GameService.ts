import { IAddGame, IAssigneGame, IAssignedCategory, IlistGame } from "@src/models/User"
import { prisma } from "@src/server"

async function addGame(req:IAddGame[]) {
    const arrayReq = req.map((item)=>item.name)
    const existingGame = await prisma.game.findMany({
      where :{
        name:{
          in:arrayReq
        }
      }
    })
    if (existingGame.length>0){
      throw new Error ('Game Already Exist')

    }
  const addGame = await prisma.game.createMany({
    data:req,
    skipDuplicates:true
  })
  return addGame

}

async function listGameUser() {
    const query = await prisma.game.findMany({
        include:{
            users:true
        }
    })

    const result = query.map((item)=>({
        id_game:item.id,
        name_game:item.name,
        name_user: item.users?.name || null
    }))
    
    return result
}

async function assignedGame(req:IAssigneGame) {

  const findgame = await prisma.game.findUnique({
    where : {
      id:req.id
    }
  })
  if(!findgame){
    throw new Error ('Failed Find Game')
  }

  const assignedGame = await prisma.game.update({
    where:{
      id:req.id
    },
    data:{user_id:req.user_id}
  })
  return assignedGame
}
async function assignedCategory(req:IAssignedCategory) {
  const findgame = await prisma.game.findUnique({
    where :{
      id:req.id
    }
  })
  if(!findgame){
    throw new Error ('Failed Find Game')
  }

  const assignedCategory = await prisma.game.update({
    where:{
      id:req.id
    },
    data:{category_id:req.category_id}
  })
  return assignedCategory
}

async function listGame(req:IlistGame) {
  const page = +req.page||1
  const take = +req.per_page||10
  const skip = (page-1)*take
  const nextPage = page+1
  const prevPage = page-1
  const listGame = await prisma.game.findMany({
    skip:skip,take:take,
    orderBy:{
      name :"asc"
    },select:{
      id:true,
      name:true,
      category:{
        select:{
          name:true
        }
      }
    }
  })
  const result = listGame.map((item)=>({
    id: item.id,
    name: item.name,
    category: item?.category?.name||null
  }))
  const total = await prisma.game.count()
  return {
    page: page,
    per_page: take,
    total: total,
    next_page: nextPage,
    prev_page: prevPage,
    status: true,
    message: 'Success Retrieve Data Game',
    data:result,
  }
}

export default {
    addGame,
    assignedGame,
    listGameUser,
    listGame,
    assignedCategory
}