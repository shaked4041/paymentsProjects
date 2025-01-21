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
// : Promise<IUser | null>
// export async function readOne(filter: Partial<IUser> | string) {
//   try {
//     const user = await UserModel.findOne(filter);
//     return user;
//   } catch (error) {
//     console.error('Error getting user', error);
//     throw new Error(
//       `Failed to retrieve user with filter: ${JSON.stringify(filter)}`
//     );
//   }
// }


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
  updatedData: Partial<IUser>
): Promise<IUser | null> {
  try {
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updateQuery: any = { $set: updatedData };


    // const updatedUser = await UserModel.findByIdAndUpdate(
    //   { _id: userId },
    //   { $set: updatedData }, 
    //   { new: true }           
    // );
    // console.log('Updated user in DB:', updatedUser);

    const updateResult = await UserModel.updateOne(
      { _id: userId },
      updateQuery
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error('Failed to update user');
    }

    // Fetch and return the updated user document
    const updatedUser = await UserModel.findById(userId);
    return updatedUser;
    } catch (error) {
    console.error('Error in updating user:', error);
    throw new Error('Unable to update user');
  }
}
