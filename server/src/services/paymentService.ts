import proccessPayment from '../mockPaymentsService/mockPaymentService';
import { readOne, update } from '../controllers/billController';
import { PaymentPayload } from '../utils/types';
import { read } from '../controllers/paymentController';

export async function createPayment(data: PaymentPayload) {
  try {
    const bill = await readOne(data.billId);
    if (!bill) {
      throw new Error('bill doesnt exist, payment cancelled');
    }
    await update(data.billId, { status: 'Processing' });
    const paymentMessage = await proccessPayment(data);
    return paymentMessage;
  } catch (error: any) {
    console.error('Error creating new payment:', error.message);
    throw new Error('Error creating new payment: ' + error.message);
  }
}

export async function getAllPayments(filter: any = {}) {
  try {
    const payments = await read(filter);
    return payments;
  } catch (error) {
    console.error('Error in getAllPayments', error);
    throw new Error('faile to retrive payments from api');
  }
}
