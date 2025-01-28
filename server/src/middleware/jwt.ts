import jwt, { JwtPayload, SignOptions, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Types } from 'mongoose';
import { TokenPayload } from '../utils/types';
import { auth } from 'firebase-admin';
import admin from 'firebase-admin';

dotenv.config();

const SECRET = process.env.SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

if (!SECRET || !REFRESH_SECRET) {
  throw new Error('Secret keys are not defined in environment variables');
}


const createToken = (payload: object, secret: string, options: SignOptions): string => {
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: string): TokenPayload | null => {
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    console.error('Token verification error:', (error as VerifyErrors)?.message || 'Unknown error');
    return null;
  }
};

export const createAccessToken = (payload: TokenPayload): string => {
  return createToken(payload, SECRET, { expiresIn: '5m' });
};

export const createRefreshToken = (payload: TokenPayload): string => {
  return createToken(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

export const decodeAccessToken = (token: string): TokenPayload | null => {
  const decoded = verifyToken(token, SECRET);
  if (!decoded) {
    console.log('Invalid access token or token expired');
    return null;
  }
  return decoded;
};

export const decodeRefreshToken = (token: string): TokenPayload | null => {
  const decoded = verifyToken(token, REFRESH_SECRET);
  if (!decoded) {
    console.log('Invalid refresh token or token expired');
    return null;
  }
  return decoded;
};

