import proccessPayment from '../mockPaymentsService/mockPaymentService';
import { readOne, update } from '../controllers/billController';
import { PaymentPayload } from '../utils/types';

export async function createPayment(data: PaymentPayload) {
  try {
    const bill = await readOne(data.billId);
    if (!bill) {
      throw new Error('bill doesnt exist, payment cancelled');
    }
    const updateBillStatus = await update(data.billId, {status: 'Processing'})
    const paymentMessage = await proccessPayment(data);
    return paymentMessage;
  } catch (error: any) {
    console.error('Error creating new payment:', error.message);
    throw new Error('Error creating new payment: ' + error.message);
  }
}
