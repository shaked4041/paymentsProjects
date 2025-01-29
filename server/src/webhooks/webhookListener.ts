import { Router } from 'express';
import { Request, Response } from 'express';
import { getSingleBill, updateBill } from '../services/billService';
import { create } from '../controllers/paymentController';
import { Types, ObjectId } from 'mongoose';
import { sendPaymentUpdate } from '../services/socketService';
import { WebhookPaymentBody } from '../utils/types';

const router = Router();

router.post(
  '/webhookPayment',
  async (req: Request<{}, {}, WebhookPaymentBody>, res: Response) => {
    try {
      const { billId, userId, amount, paymentMethod, status } = req.body;

      if (!billId || !amount || !paymentMethod || !status) {
        console.error('Missing required fields:', req.body);
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const objectIdBill = new Types.ObjectId(billId);
      const fullBill = await getSingleBill(objectIdBill);
      if (!fullBill) {
        return res.status(404).json({ message: 'Bill not found' });
      }

      let billStatus =
        fullBill && fullBill.amount > amount
          ? 'PartPaid'
          : status === 'success'
          ? 'Paid'
          : 'Pending';

      const newPayment = await create(req.body);
      const updatedBill = await updateBill(objectIdBill, {
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
