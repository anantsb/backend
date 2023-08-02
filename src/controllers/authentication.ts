import express from 'express';
import { loginService, registerService } from '../services/auth.service';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const result = await loginService(email, password);

    if (result.status === 'error') {
      return res.status(401).json({message: result.message}).end(); // 401 status for unauthorized
    }

    res.cookie('API-Auth', result.responseObj.sessionToken , { domain: 'localhost', path: '/' });

    return res.status(200).json(result.responseObj).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // 500 status for server errors
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !username || !password) {
      return res.sendStatus(400);
    }
    const result = await registerService(username, email, password);

    if (result.status === 'error') {
      return res.status(409).json({message: result.message}).end();
    }

    return res.status(200).json(result.userData).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // 500 status for server errors
  }
};
