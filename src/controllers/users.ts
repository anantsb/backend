import express from 'express';

import { UpdateUserById, deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async( req : express.Request, res: express.Response) =>{
  try {
    const users = await getUsers();

    return res.status(200).json(users)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
};

export const deleteUser = async(req :express.Request, res: express.Response)=>{
  try {
    const { id } = req.params

    const deletedUser = await deleteUserById(id)

    return res.json(deletedUser)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const {abc} = req.query;
    console.log(abc);
    const { username ,email } = req.body;

    if (!req.body) {
      return res.sendStatus(400);
    }

    const user = await UpdateUserById(id,req.body);
    
    await user.save();
const userData = await getUserById(id);
    return res.status(200).json(userData).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}