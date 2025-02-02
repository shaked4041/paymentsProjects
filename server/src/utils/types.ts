import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  firebaseUid?: string
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
  userId?: Types.ObjectId;
  paymentsIds?: Types.ObjectId[];
  amountPaid: number;
}

export interface IPayment extends Document {
  billId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  paymentMethod: PaymentMethods;
  status: 'success' | 'failure';
}

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  firebaseUid?: string;
}


export interface PaymentPayload {
  billId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  paymentMethod: string;
}

export class HttpError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message); 
    this.status = status;
    this.name = this.constructor.name; 
    Error.captureStackTrace(this, this.constructor); 
  }
}

export interface TokenPayload extends JwtPayload {
  _id: Types.ObjectId;
}

export interface BillUpdateData {
  status?: string;
  amount?: number;
  name?: string;
  dueDate?: Date;
  paymentId?: Types.ObjectId;
  paymentAmount?: number;
}

export interface NewBillProps{
  name: string;
  amount: number;
  dueDate: Date;
  userId: Types.ObjectId;
}


export interface UserProps{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  billId: Types.ObjectId;
}

export interface WebhookPaymentBody {
  billId: string;
  userId?: string;  
  amount: number;
  paymentMethod: string;
  status: 'success' | 'failed' | 'pending'; // Ensure only valid status values
}