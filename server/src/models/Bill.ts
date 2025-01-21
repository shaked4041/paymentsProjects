import mongoose, { Model, Schema, Types } from 'mongoose';
import { IBill } from '../utils/types';

const BillSchema: Schema = new Schema<IBill>({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue', 'Processing', 'PartPaid'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  paymentsIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    default: [],
  },
  amountPaid: {
    type: Number,
    required: true,
    default: 0,
  },
});

const BillModel: Model<IBill> = mongoose.model<IBill>('Bill', BillSchema);

export default BillModel;
