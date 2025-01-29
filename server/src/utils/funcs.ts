import { Request } from 'express';
import { createAccessToken, createRefreshToken, decodeAccessToken } from '../middleware/jwt';
import { Types } from 'mongoose';
import { Response } from 'express';

export const identifyCurrentUser = (req: Request): string | null => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return null; 
    }

    const decoded = decodeAccessToken(token); 
    if (!decoded) {
      return null; 
    }

    return decoded._id.toString(); 
  } catch (error) {
    console.error('Authentication error:', error);
    return null; 
  }
};


export const setTokensAndCookies = (userId: Types.ObjectId, res: Response, isProduction: boolean) => {
  const accessToken = createAccessToken({ _id: userId });
  const refreshToken = createRefreshToken({ _id: userId });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'none',
    // sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    maxAge: 5 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'none',
    // sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};