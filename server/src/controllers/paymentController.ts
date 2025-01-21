import PaymentModel from "../models/Payment";


export async function create(data: any) {
    try {
      const newPayment = await PaymentModel.create(data);
      return newPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment');
    }
  }
  
  export async function read(filter: any = {}){
    try {
      const payments = await PaymentModel.find(filter);
      return payments
    } catch (error) {
      console.error('Error in getPayments', error);
      throw new Error('failed to retrieve payments from api');
    }
  }