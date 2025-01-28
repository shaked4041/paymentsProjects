import { Router } from 'express';
import { Request, Response } from 'express';
import { getSingleBill, updateBill } from '../services/billService';
import { create } from '../controllers/paymentController';
import { sendPaymentUpdate } from '..';
import { Types } from 'mongoose';

const router = Router();

router.post(
  '/webhookPayment',
  async (req: Request, res: Response): Promise<any> => {
    const { billId,userId, amount, paymentMethod, status } = req.body;
    if (!billId || !amount || !paymentMethod || !status) {
      console.error('Missing required fields:', {
        billId,
        userId,
        amount,
        paymentMethod,
        status,
      });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const fullBill = await getSingleBill(billId);

    let billStatus; 
    
    if (fullBill && fullBill.amount > amount) {
      billStatus = 'PartPaid';
    } else if (status === 'success') {
      billStatus = 'Paid';
    } else {
      billStatus = 'Pending';
    }    

    try {
      const newPayment = await create(req.body);
      const updatedBill = await updateBill(billId, {
        status: billStatus,
        paymentId: newPayment._id as Types.ObjectId,
        paymentAmount: amount,
      });
      console.log('updatedBilllll', updatedBill);

      sendPaymentUpdate(billId, status);

      res.status(200).json({
        message: 'Webhook processed successfully',
        payment: newPayment,
        bill: updatedBill,
      });
    } catch (error: any) {
      console.error('Error processing webhook:', error.message);
      res.status(500).json({
        message: 'Error processing webhook',
        error: error.message,
      });
    }
  }
);

export default router;
