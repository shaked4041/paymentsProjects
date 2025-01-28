import mongoose, { Model, Schema } from 'mongoose';
import { IPayment, PaymentMethods } from '../utils/types';

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bill',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethods),
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, 
  }
);

const PaymentModel: Model<IPayment> = mongoose.model<IPayment>(
  'Payment',
  PaymentSchema
);

export default PaymentModel;
