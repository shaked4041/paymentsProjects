import { Types } from 'mongoose';
import BillModel from '../models/Bill';
import { IBill } from '../utils/types';

export async function read(filter: any = {}) {
  try {
    const bills = await BillModel.find(filter);
    return bills;
  } catch (error) {
    console.error('Error in getBills', error);
    throw new Error('failed to retrieve bills from api');
  }
}

export async function readOne(id: Types.ObjectId) {
  try {
    const bill = await BillModel.findById({ _id: id });
    return bill;
  } catch (error) {
    console.error('Error in getBill', error);
    throw new Error('failed to retrieve bill from api');
  }
}

export async function readUnpaid(filter: {
  status: string | { $in: string[] };
}) {
  try {
    const bills = await BillModel.find(filter);
    return bills;
  } catch (error) {
    console.error('Error in getBills', error);
    throw new Error('failed to retrieve bills from api');
  }
}

export async function create(data: any) {
  try {
    const newBill = await BillModel.create(data);
    return newBill;
  } catch (error) {
    console.error('Error creating bill:', error);
    throw new Error('Failed to create bill');
  }
}

export async function update(
  billId: Types.ObjectId,
  updateOperations: Partial<IBill>
): Promise<IBill | null> {
  try {
    const updatedBill = await BillModel.findOneAndUpdate(
      { _id: billId },
      updateOperations,
      {
        new: true, 
        runValidators: true, 
      }
    );

    if (!updatedBill) {
      throw new Error('Bill not found or update failed');
    }

    return updatedBill;
  } catch (error) {
    console.error('Error in updating bill', error);
    throw new Error('Unable to update bill');
  }
}
