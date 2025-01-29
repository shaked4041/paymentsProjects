import { Types } from 'mongoose';
import {
  readUnpaid,
  read,
  create,
  update,
  readOne,
} from '../controllers/billController';
import { BillUpdateData, IBill, NewBillProps } from '../utils/types';
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
}: NewBillProps) {
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

export async function getSingleBill(billId: Types.ObjectId): Promise<IBill | null> {
  try {
    const bill = await readOne(billId);
    return bill;
  } catch (error: any) {
    console.error('Error getting bill:', error.message);
    throw new Error('bill doesnt exist, bill cancelled');
  }
}


export async function updateBill(
  billId: Types.ObjectId,
  updatedData: BillUpdateData
): Promise<IBill | null> {
  try {
    
    const bill = await readOne(billId);
    if (!bill) {
      throw new Error("Bill doesn't exsist");
    }

    if (Object.keys(updatedData).length === 0) {
      throw new Error('No valid fields provided for update');
    }

    const operations: Record<string, any> = {};

    const setOperations: Record<string, any> = {};

    if (updatedData.status) setOperations.status = updatedData.status;
    if (updatedData.amount) setOperations.amount = updatedData.amount;
    if (updatedData.name) setOperations.name = updatedData.name;
    if (updatedData.dueDate) setOperations.dueDate = updatedData.dueDate;

    if (Object.keys(setOperations).length > 0) {
      operations.$set = setOperations;
    }

    if (updatedData.paymentId) {
      operations.$push = { paymentsIds: updatedData.paymentId };
    }

    if (updatedData.paymentAmount) {
      operations.$inc = { amountPaid: updatedData.paymentAmount };
    }

    const updatedBill = await update(billId, operations);

    if (!updatedBill) {
      throw new Error('Bill not found or update failed');
    }

    return updatedBill;
  } catch (error) {
    console.error('Error in updateBill', error);
    throw new Error('faile to retrive updated bill from api');
  }
}
