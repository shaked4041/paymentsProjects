import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { decodeAccessToken, decodeRefreshToken } from './jwt';
import { TokenPayload } from '../utils/types';
import { setTokensAndCookies } from '../utils/funcs';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

dotenv.config();

const authenticateTokenMiddlware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const isProduction = process.env.NODE_ENV === 'production';
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    
    if (!accessToken && !refreshToken) {
      console.warn("No tokens provided, skipping authentication");
      return next(); 
    }

    if (accessToken) {
      try {
        const payload = decodeAccessToken(accessToken);
        if (payload) {
          req.user = payload;
          return next();
        }
      } catch (error) {
        console.error('Invalid access token:', error);
      }
    }

    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return;
    }

    let payload: TokenPayload | null = null;
    try {
      payload = decodeRefreshToken(refreshToken);
    } catch (error) {
      console.error('Invalid refresh token:', error);
    }

    if (!payload) {
      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });

      res.status(403).json({ message: 'Invalid refresh token' });
      return;
    }
    setTokensAndCookies(payload._id, res, isProduction);
    req.user = payload;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { authenticateTokenMiddlware };
