import mongoose, { Model, Schema } from 'mongoose';
import { IPayment, PaymentMethods } from '../utils/types';


const PaymentSchema: Schema = new Schema<IPayment>({
  billId: {
    type: String,
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
});

const PaymentModel: Model<IPayment> = mongoose.model<IPayment>(
  'Payment',
  PaymentSchema
);

export default PaymentModel;
