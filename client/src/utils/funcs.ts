import { PaymentError } from './types';

export const formattedDate = (date: Date | string): string => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }
  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isDateInCurrentMonth = (dateString: string): boolean => {
  const inputDate = new Date(dateString);

  if (isNaN(inputDate.getTime())) {
    throw new Error('Invalid date string');
  }

  const today = new Date();

  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth()
  );
};

export const validateAmount = (
  value: number,
  minAmount: number,
  totalAmount: number
): PaymentError | null => {
  if (value < minAmount) {
    return {
      message: `Current amount not enough, need to pay at least $${minAmount}`,
      code: 'AMOUNT_TOO_LOW',
    };
  }
  if (value > totalAmount) {
    return {
      message: 'Current amount is more than the bill amount',
      code: 'AMOUNT_TOO_HIGH',
    };
  }
  return null;
};
