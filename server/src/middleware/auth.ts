import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import {
  createAccessToken,
  createRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
  TokenPayload,
} from './jwt';
import { HttpError } from '../utils/types';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

dotenv.config();

export const authenticateTokenMiddlware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    
    if (!accessToken && !refreshToken) {
      throw new HttpError('Access denied, no tokens present', 401);
    }
    
    if (accessToken) {
      const payload = decodeAccessToken(accessToken);
      if (payload) {
        req.user = payload;
        return next();
      }
    }
    
    if (!refreshToken) {
      throw new HttpError('No refresh token', 401);
    }
    
    const payload = decodeRefreshToken(refreshToken);
    if (!payload) {
      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });
      
      throw new HttpError('Invalid refresh token', 403);
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

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
