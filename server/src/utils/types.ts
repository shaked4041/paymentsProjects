import mongoose, { Types } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  billIds: mongoose.Schema.Types.ObjectId[];
}

export enum PaymentMethods {
  CreditCard = 'creditCard',
  Paypal = 'paypal',
  BankTransfer = 'bankTransfer',
  GooglePay = 'googlePay',
}

export interface IBill extends Document {
  _id: Types.ObjectId;
  name: string;
  amount: number;
  dueDate: Date;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Processing' | 'PartPaid';
  userId?: string;
  paymentsIds?: Types.ObjectId[];
  amountPaid: number;
}

export interface IPayment extends Document {
  billId: string;
  amount: number;
  paymentMethod: PaymentMethods;
  status: 'success' | 'failure';
}

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PaymentPayload {
  billId: string;
  amount: number;
  paymentMethod: string;
}

export class HttpError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message); // Call the parent constructor (Error)
    this.status = status;
    this.name = this.constructor.name; // Set the error name to the class name
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}
