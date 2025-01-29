import { Types } from 'mongoose';
import {
  getUserByEmail,
  getUserById,
  update,
} from '../controllers/userController';
import { createUser } from '../controllers/userController';
import { IUser, UserPayload, UserProps } from '../utils/types';
import bcrypt from 'bcrypt';

export const addNewUser = async (data: UserPayload) => {
  const { email, firstName, lastName, password , firebaseUid} = data;
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

type UserUpdateData = Partial<UserProps>;

export const updateUser = async (
  userId: string,
  updatedData: UserUpdateData
): Promise<IUser | null> => {
  try {

    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User doesn't exsist");
    }

    const updateQuery: Record<string, any> = {};
    const pushOperations: Record<string, any> = {};

    if (updatedData.firstName) updateQuery.firstName = updatedData.firstName;
    if (updatedData.lastName) updateQuery.lastName = updatedData.lastName;
    if (updatedData.email) updateQuery.email = updatedData.email;

    if (updatedData.password) {
      updateQuery.password = await bcrypt.hash(updatedData.password, 10);
    }

    if (updatedData.billId) {
      pushOperations.billIds = updatedData.billId;
    }

    return await update(userId, updateQuery, pushOperations);
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw new Error('Failed to update user');
  }
};
