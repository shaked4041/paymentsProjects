import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { decodeAccessToken, decodeRefreshToken } from './jwt';
import { HttpError, TokenPayload } from '../utils/types';
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
    const isProduction = process.env.NODE_ENV === 'production';
    setTokensAndCookies(payload._id, res, isProduction);

    req.user = payload;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { authenticateTokenMiddlware };
