import { Router } from 'express';
import { Request, Response } from 'express';
import { createPayment, getAllPayments } from '../services/paymentService';
import { identifyCurrentUser } from '../utils/funcs';
import mongoose from 'mongoose';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentData = req.body;
    const paymentMessage = await createPayment(paymentData);
    res.status(201).json(paymentMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'somthing went wrong making new payment');
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = identifyCurrentUser(req);
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return;
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const payments = await getAllPayments({ userId: userObjectId });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments');
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
