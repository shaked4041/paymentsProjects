import { Types } from 'mongoose';
import {
  readUnpaid,
  read,
  create,
  update,
  readOne,
} from '../controllers/billController';
import { IBill } from '../utils/types';
import UserModel from '../models/User';

export async function getAllBills(filter: any = {}) {
  try {
    const bills = await read(filter);
    return bills;
  } catch (error) {
    console.error('Error in getBills', error);
    throw new Error('faile to retrive bills from api');
  }
}

export async function createNewBill({
  name,
  amount,
  dueDate,
  userId,
}: {
  name: string;
  amount: number;
  dueDate: Date;
  userId: string;
}) {
  try {
    if (new Date(dueDate).getTime() < Date.now()) {
      throw new Error('Due date cannot be in the past');
    }

    const data: Partial<IBill> = {
      name,
      amount,
      dueDate,
      status: 'Pending',
      userId,
      paymentsIds: [],
      amountPaid: 0,
    };

    const newBill = await create(data);
    if (!newBill) {
      throw new Error('Failed to create bill');
    }

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { billIds: newBill._id } },
      { new: true }
    );

    console.log('Bill created successfully:', newBill);
    return newBill;
  } catch (error: any) {
    console.error('Error creating new bill:', error.message);
    throw error;
  }
}

export async function getUnpaidBills() {
  try {
    const unpaidBills = await readUnpaid({
      status: { $in: ['Pending', 'Overdue', 'PartPaid'] },
    });
    return unpaidBills;
  } catch (error) {
    console.error('Error in getUnBills', error);
    throw new Error('faile to retrive unpaid bills from api');
  }
}

export async function getSingleBill(billId: string): Promise<IBill | null> {
  try {
    const bill = await readOne(billId);
    return bill;
  } catch (error: any) {
    console.error('Error getting bill:', error.message);
    throw new Error('bill doesnt exist, bill cancelled');
  }
}



export async function updateBill(
  billId: string,
  updatedData: {
    status?: string;
    amount?: number;
    name?: string;
    dueDate?: Date;
    paymentId?: Types.ObjectId;
    paymentAmount?: number;
  }
): Promise<IBill | null> {
  try {
    const updateQuery: any = {};

    const setQuery: any = {};
    const pushQuery: any = {};
    const incQuery: any = {};

    if (updatedData.status) setQuery.status = updatedData.status;
    if (updatedData.amount) setQuery.amount = updatedData.amount;
    if (updatedData.name) setQuery.name = updatedData.name;
    if (updatedData.dueDate) setQuery.dueDate = updatedData.dueDate;
    if (updatedData.paymentId) pushQuery.paymentsIds = updatedData.paymentId;
    if (updatedData.paymentAmount) incQuery.amountPaid = updatedData.paymentAmount;

    if (Object.keys(setQuery).length > 0) updateQuery.$set = setQuery;
    if (Object.keys(pushQuery).length > 0) updateQuery.$push = pushQuery;
    if (Object.keys(incQuery).length > 0) updateQuery.$inc = incQuery;

    if (Object.keys(updateQuery).length === 0) {
      throw new Error('No valid fields provided for update');
    }

    const updatedBill = await update(billId, updateQuery);

    if (!updatedBill) {
      throw new Error('Bill not found or update failed');
    }

    return updatedBill;
  } catch (error) {
    console.error('Error in updateBill', error);
    throw new Error('faile to retrive updated bill from api');
  }
}
