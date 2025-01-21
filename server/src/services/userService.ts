import mongoose, { Types } from 'mongoose';
import { getUserByEmail, update } from '../controllers/userController';
import { createUser } from '../controllers/userController';
import { IUser, UserPayload } from '../utils/types';

export const addNewUser = async (data: UserPayload) => {
  const { email, firstName, lastName, password } = data;
  try {
    const checkEmailUser = await getUserByEmail(email);
    if (checkEmailUser) {
      throw { message: 'Email is taken, use another', code: 400 };
    }
    const newUser = await createUser(data);
    return newUser;
  } catch (error: any) {
    console.error('Error creating new user:', error.message);
    throw {
      message: error.message || 'Error creating new user',
      code: error.code || 500,
    };
  }
};

export const getUser = async (email: string) => {
  try {
    const user = await getUserByEmail(email);
    return user;
  } catch (error: any) {
    console.error('Error getting user:', error.message);
    throw {
      message: error.message || 'Error getting user',
      code: error.code || 401,
    };
  }
};

export const updateUser = async (
  userId: string,
  updatedData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    billId?: Types.ObjectId;
    }
): Promise<IUser | null> => {
  try {
    const updateQuery: any = {};

    if (updatedData.firstName) updateQuery.firstName = updatedData.firstName;
    if (updatedData.lastName) updateQuery.lastName = updatedData.lastName;
    if (updatedData.email) updateQuery.email = updatedData.email;
    if (updatedData.password) updateQuery.password = updatedData.password;
    if (updatedData.billId) {
      updateQuery.$push = { billIds: updatedData.billId };
    }

    const updatedUser = await update(userId, updateQuery);
    return updatedUser;
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw new Error('Failed to update user');
  }
};
