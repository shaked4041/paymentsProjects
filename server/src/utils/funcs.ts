import { Request } from 'express';
import { decodeAccessToken } from '../middleware/jwt';

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
