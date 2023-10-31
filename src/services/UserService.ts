import UserRepo from '@src/repos/UserRepo';
import { IAddGame, IAssigneGame, ICreateUser, IDeleteUser, IUpdateUser, IUser } from '@src/models/User';
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

async function getUser(nama_user?:String) {
  
  if(!nama_user){ 
    console.log('ini nama user',nama_user)   
    const user = await prisma.user.findMany({
      where:{
        deletedAt:null
      },orderBy:{
        nama : "asc"
      }
    })
    console.log(user)
    if(!user){
      throw new Error ("Data Not Found");
    }
    return user;
  }else{
    console.log(nama_user)
    const user = await prisma.user.findMany({
      where:{
        nama:{
          mode: 'insensitive',
          contains: String(nama_user)
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

async function createUser(dataUser:ICreateUser[]) {
  try {
    const newUser = await prisma.user.createMany({
      data:dataUser,
      skipDuplicates: true
    })
    return newUser
  } catch (error) {
    throw new Error('Error' + error)
  }
}

// User Update nama
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
      nama:req.nama,
      umur:req.umur
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


//End Point Game

//Add Game
async function addGame(req:IAddGame[]) {
    const arrayReq = req.map((item)=>item.nama)
    const existingGame = await prisma.game.findMany({
      where :{
        nama:{
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
// **** Export default **** //

export default {
  getUser,
  updateUser,
  createUser,
  deletUser,
  addGame,
  assignedGame,
  getAll,
  getDetail,
  addOne,
  updateOne,
  delete: _delete,
} as const;
