import { Router } from 'express';
import { Request, Response } from 'express';
import { createNewBill, getAllBills, getSingleBill, getUnpaidBills, updateBill } from '../services/billService';
import { identifyCurrentUser } from '../utils/funcs';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = identifyCurrentUser(req)
    if (!userId || typeof userId !== 'string') {
      return;  
    }
    const bills = await getAllBills({userId: userId});
     res.status(200).json(bills);
  } catch (error) {
    console.error('Error getting bills', error);
     res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const newBill = await createNewBill(req.body);
    res.status(201).send(newBill);
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'somthing went wrong creating new bill');
  }
});

router.get('/unpaid/unpaidBills', async (req: Request, res: Response): Promise<void> => {
  try {
    const unpaidBills = await getUnpaidBills();
    res.status(201).send(unpaidBills);
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'somthing went wrong getting unpaid bills');
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const billId = req.params.id;
  try {
    const bill = await getSingleBill(billId);
     res.status(200).json(bill);
  } catch (error) {
    console.error(`Error getting bill with id : ${billId}`, error);
     res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const billId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedBill = await updateBill(billId, updatedData);

    if (updatedBill) {
      res.status(200).json(updatedBill); 
    } else {
      res.status(404).json({ message: 'Bill not found' }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'somthing went wrong updating bill');
  }
});

export default router;
