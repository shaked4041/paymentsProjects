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
    sparse: true, 
    default: undefined, 
  },
  billIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    default: []
  },
});

UserSchema.index({ firebaseUid: 1, email: 1 }, { unique: true, sparse: true });

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
