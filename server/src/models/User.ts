import mongoose, { Model, Schema } from 'mongoose';
import { IUser } from '../utils/types';

const UserSchema: Schema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  firebaseUid: {
    type: String,
    unique: true,
    required: false, 
  },
  billIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    default: []
  },
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
