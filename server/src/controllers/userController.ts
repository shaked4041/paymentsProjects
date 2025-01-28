import { Types } from 'mongoose';
import UserModel from '../models/User';
import { IUser, UserPayload } from '../utils/types';

export async function read(filter: any = {}) {
  try {
    const users = await UserModel.find(filter);
    return users;
  } catch (error) {
    console.error('Error getting users', error);
    throw new Error('faild to retive users from api');
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await UserModel.findOne({ email });
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw new Error(`Failed to retrieve user with email: ${email}`);
  }
}

export async function getUserById(id: string | Types.ObjectId) {
  try {
    return await UserModel.findById(id);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw new Error(`Failed to retrieve user with ID: ${id}`);
  }
}

export async function createUser(data: UserPayload): Promise<IUser> {
  try {
    const newUser = await UserModel.create(data);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export async function update(
  userId: string,
  updatedData: Record<string, any> = {},
  pushData: Record<string, any> = {}
): Promise<IUser | null> {
  try {

    const updates = {
      ...(Object.keys(updatedData).length && { $set: updatedData }),
      ...(Object.keys(pushData).length && { $push: pushData })
    };

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    console.error('Error in updating user:', error);
    throw new Error('Unable to update user');
  }
}
