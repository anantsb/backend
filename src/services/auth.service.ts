import { createUser, getUsersByEmail } from '../db/users';
import { authentication, random } from '../helpers';

type RegisterResult = 
    | { status: 'success', userData: any } 
    | { status: 'error', message: string };
    
type LoginResult = 
    | { status: 'success', responseObj: any } 
    | { status: 'error', message: string };

export const registerService =  async (username:string , email:string , password:string): Promise<RegisterResult> =>{
  const existingUser = await getUsersByEmail(email)
  
  if(existingUser){
    return {status: 'error', message: 'User already exists.'};
  }
  
  const salt = random()
  const userData = await createUser({
    username,
    email,
    authentication:{
      salt,
      password: authentication(salt,password)
    }, 
  })
  return { status: 'success', userData };
}

export const loginService = async (email:string , password:string):Promise<LoginResult> =>{
  const userData = await getUsersByEmail(email).select('+authentication.salt +authentication.password');

  if (!userData) {
    return { status: 'error', message: 'User does not exist.' };
  }

  const expectedHash = authentication(userData.authentication.salt, password);

  if (userData.authentication.password !== expectedHash) {
    return { status: 'error', message: 'Incorrect password.' };
  }

  const salt = random();
  userData.authentication.sessionToken = authentication(salt, userData._id.toString());
  await userData.save();
const responseObj = {
  _id:userData._id,
  email:userData.email,
  username:userData.username,
  sessionToken:userData.authentication.sessionToken
}
  return { status: 'success', responseObj };
}
