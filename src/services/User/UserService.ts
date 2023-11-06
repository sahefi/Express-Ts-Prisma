import UserRepo from '@src/repos/UserRepo';
import User, { IAddGame, IAssigneGame, ICreateUser, IDeleteUser, IReqFilter, IRespListUserGame, IUpdateUser, IUser } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import {prisma} from '@src/server';




// **** Variables **** //

export const USER_NOT_FOUND_ERR = 'User not found';


// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Add one user.
 */
function addOne(user: IUser): Promise<void> {
  return UserRepo.add(user);
}



/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Return user
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Delete user
  return UserRepo.delete(id);
}

// User Query Get All

async function getUser(name_user?:String) {
  
  if(!name_user){ 
    console.log('ini name user',name_user)   
    const user = await prisma.user.findMany({
      where:{
        deletedAt:null
      },orderBy:{
        name : "asc"
      }
    })
    console.log(user)
    if(!user){
      throw new Error ("Data Not Found");
    }
    return user;
  }else{
    console.log(name_user)
    const user = await prisma.user.findMany({
      where:{
        name:{
          mode: 'insensitive',
          contains: String(name_user)
        },
        deletedAt:null
      }
    })
    if(!user){
      throw new Error ("Data Not Found");
    }
    return user;
  }
  
}

// User Query Detail
async function getDetail(id_user:string) {
  const userDetail = await prisma.user.findUnique({
    where:{
      id:id_user 
    }
  })
  if (!userDetail) {
    throw new Error("Detail Not found");
  }

  return userDetail;
}

// async function createUser(dataUser:ICreateUser[]) {
//   try {
//     const newUser = await prisma.user.createMany({
//       data:dataUser,
//       skipDuplicates: true
//     })
//     return newUser
//   } catch (error) {
//     throw new Error('Error' + error)
//   }
// }

// User Update name
async function updateUser(req : IUpdateUser) {
  const userId = await prisma.user.findUnique({
    where:{
      id:req.id
    }
  })
  if(!userId){
    throw new Error ("Detail Not Found")
  }

  const userUpdate = await prisma.user.update({
    where:{
      id:req.id
    },
    data:{
      name:req.name,
      age:req.age
    }
  })
  if(!userUpdate){
    throw new Error ('Failed Update')
  }
  return

   
}

// Soft Delete user
async function deletUser(req:IDeleteUser) {
  const now = new Date()
  const softDelete = await prisma.user.update({
    where:{
      id:req.id
    },
    data:{
      deletedAt: now
    }
  })
  if(!softDelete){
    throw new Error ('Failed Delete Data')
  }
  return softDelete
  
}

async function listUserGame(req:IReqFilter) {
  
  const query = await prisma.user.findMany({
    include:{
      games:true
    },
    where:{
      AND:[
        {name:{mode:'insensitive',contains:req.name_user}},
        {games:{some:{name:{mode:'insensitive',contains:req.name_game}}}}
      ]
    },
    
  })

  const result:IRespListUserGame[]= query.map((user)=>({
    name_user : user.name,
    game: user.games.map((game)=>({
      id_game : game.id,
      name_game : game.name
    }))
  }))
  return result
  
}


//End Point Game

//Add Game

// **** Export default **** //

export default {
  getUser,
  updateUser,
  // createUser,
  deletUser,
  listUserGame,
  getAll,
  getDetail,
  addOne,
  updateOne,
  delete: _delete,
} as const;
