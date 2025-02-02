import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import { decodeRefreshToken } from '../middleware/jwt';
import { addNewUser, getUser } from '../services/userService';
import dotenv from 'dotenv';
import { setTokensAndCookies } from '../utils/funcs';
import { verifyFirebaseToken } from '../utils/firebaseAdmin';

dotenv.config();

const saltRound = 10;
const router = Router();
const isProduction = process.env.NODE_ENV === 'production';

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.body;
    const checkUser = await getUser(user.email);

    if (!checkUser) {
      res.status(401).json({ message: 'user not found' });
      return;
    }

    const isPasswordValid =
      checkUser.password && user.password
        ? bcrypt.compareSync(user.password, checkUser.password)
        : false;

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid Password' });
      return;
    }

    setTokensAndCookies(checkUser._id, res, isProduction);
    res.json({
      message: 'Logged in successfully',
      userId: checkUser._id.toString(),
    });
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
    setTokensAndCookies(payload._id, res, isProduction);
    
    res.status(200).json({ message: 'Tokens refreshed successfully' });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/firebase-google', async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const firebaseUSer = await verifyFirebaseToken(idToken);
    const { email, name, uid } = firebaseUSer;
    if (!email) {
      res.status(400).json({ error: 'Email not available in the ID token' });
      return;
    }

    let user = await getUser(email);
    if (!user) {
      const user = await addNewUser({
        email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        firebaseUid: uid || null,
      });
      
      setTokensAndCookies(user._id, res, isProduction);

      res.json({ message: 'Logged in successfully with Google', user });
    } else {
      setTokensAndCookies(user._id, res, isProduction);
      res.json({ message: 'Logged in successfully with Google', user });
    }
  } catch (error) {
    console.error('Error during Firebase Google login:', error);
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

  res.clearCookie('accessToken', {
    path: '/',
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });

  res.clearCookie('refreshToken', {
    path: '/',
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
