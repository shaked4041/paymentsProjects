import axios from 'axios';
import { PaymentPayload } from '../utils/types';

const proccessPayment = async (data: PaymentPayload) => {
  const { billId, amount, paymentMethod } = data;
  const fiveMinutesInMs = 5 * 60 * 1000;
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const paymentSuccess = Math.random() > 0.2;
      const paymentMessage = paymentSuccess
        ? `Payment for Bill ID: ${billId} was successful.`
        : `Payment for Bill ID: ${billId} failed.`;

      try {
        await axios.post('http://localhost:3002/webhooks/webhookPayment', {
          billId,
          amount,
          paymentMethod,
          status: paymentSuccess ? 'success' : 'failure',
        });

        console.log(paymentMessage);
        resolve(paymentMessage);
      } catch (error: any) {
        console.error(
          `Failed to send webhook for Bill ID: ${billId}. Error: ${error.message}`
        );
        reject(error);
      }
    }, fiveMinutesInMs);
  });
};

export default proccessPayment;
