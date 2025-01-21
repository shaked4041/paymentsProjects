import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import {
  createAccessToken,
  createRefreshToken,
  decodeRefreshToken,
} from '../middleware/jwt';
import { addNewUser, getUser } from '../services/userService';
import dotenv from 'dotenv';

dotenv.config();

const saltRound = 10;
const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.body;
    const checkUser = await getUser(user.email);

    if (!checkUser) {
      res.status(401).json({ message: 'user not found' });
      return;
    }

    const isPasswordValid = bcrypt.compareSync(
      user.password,
      checkUser.password
    );

    if (!isPasswordValid) throw { msg: 'Invalid password', code: 401 };

    const accessToken = createAccessToken({ _id: checkUser._id });
    const refreshToken = createRefreshToken({ _id: checkUser._id });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
      maxAge: 5 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Logged in successfully' });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ msg: error.msg || 'somthing went wrong' });
  }
});

router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies; 
    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return;
    }

    const payload = decodeRefreshToken(refreshToken);
    if (!payload) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(403).json({ message: 'Invalid refresh token' });
      return;
    }


    const expirationTime = payload.exp ? payload.exp * 1000 : null;
    const currentTime = Date.now();

    if (expirationTime && expirationTime < currentTime) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(403).json({ message: 'Refresh token expired' });
      return;
    }

    const newAccessToken = createAccessToken({ _id: payload._id });
    const newRefreshToken = createRefreshToken({ _id: payload._id });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
      maxAge: 5 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Tokens refreshed successfully' });

  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!password || password.length < 6) {
      res.status(400).json({
        msg: 'Password is required and should be at least 6 characters',
      });
      return;
    }
    const hashedPassword = bcrypt.hashSync(password, saltRound);

    const newUser = await addNewUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res.json(newUser);
  } catch (error: any) {
    console.error('Error in /register route:', error.message || error);
    res
      .status(error.code || 500)
      .json({ msg: error.message || 'somthing went wrong' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });

  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
