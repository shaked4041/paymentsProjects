import { Router } from 'express';
import { Request, Response } from 'express';
import { createPayment } from '../services/paymentService';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentData = req.body;
    const paymentMessage = await createPayment(paymentData)
    res.status(201).json(paymentMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'somthing went wrong making new payment');
  }
});

// router.get()


export default router;
