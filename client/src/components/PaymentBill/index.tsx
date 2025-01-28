import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../Button';
import { useNavigate, useParams } from 'react-router-dom';
import { createPayment } from '../../utils/reqs';
import { toast } from 'react-toastify';
import { PaymentData, PaymentError, PaymentProps } from '../../utils/types';
import { validateAmount } from '../../utils/funcs';

export default function PaymentBill({
  totalAmount,
  amount,
  setAmount,
  paymentMethod,
  setPaymentStatus,
  amountPaid,
  userId,
}: PaymentProps) {
  const { billId } = useParams<{ billId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);
  const [isPartial, setIsPartial] = useState<boolean>(false);
  const nav = useNavigate()

  let leftToPay = totalAmount; 

  if (amountPaid) {
    leftToPay = totalAmount - amountPaid; 
  }
  
  const currentToPay = leftToPay; 
  
  const minAmount = currentToPay * 0.25;

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);

    if (isNaN(value)) {
      setAmount(null);
      return;
    }

    setAmount(value);
    const validationError = validateAmount(value, minAmount, currentToPay);
    setError(validationError);
  };

  const handlePaymentTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isPartialPayment = event.target.value === 'partial';
    setIsPartial(isPartialPayment);
    setAmount(isPartialPayment ? null : currentToPay);
    setError(null);
  };

  const handlePayment = async () => {
    if (!billId || amount === null || !paymentMethod) {
      const message = 'Please fill in all the required details.';
      setError({ message });
      toast.error(message);
      return;
    }

    const validationError = validateAmount(amount, minAmount, currentToPay);
    if (validationError) {
      setError(validationError);
      toast.error(validationError.message);
      return;
    }

    const paymentData: PaymentData = {
      billId,
      amount,
      paymentMethod,
      userId,
    };

    setLoading(true);
    setError(null);
    setPaymentStatus('Processing');

    try {
      toast.info('Payment sent and being processed...');
      nav('/')
      await createPayment(paymentData);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        'Payment failed. Please try again.';
      setError({ message: errorMessage });
      setPaymentStatus('Faild');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled =
    loading || !!error || amount === null || !paymentMethod;

  const formatAmount = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <div className={styles.mainPayment}>
      <span className={styles.titleContainer}>Payment Amount</span>
      <label className={styles.methodCont}>
        <input
          type="radio"
          name="paymentType"
          value="full"
          onChange={handlePaymentTypeChange}
          className={styles.radioCont}
        />
        Full Amount: ${currentToPay}
      </label>
      <label className={styles.methodCont}>
        <input
          type="radio"
          name="paymentType"
          value="partial"
          onChange={handlePaymentTypeChange}
          className={styles.radioCont}
        />
        Partial Amount
      </label>
      {isPartial && (
        <div>
          <label className={styles.methodCont}>
            <input
              type="number"
              value={amount || ''}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className={styles.amountInput}
              min={minAmount}
              max={currentToPay}
            />
          </label>
          <div className={styles.minAmount}>Minimum Amount: ${minAmount}</div>
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error.message}</div>}

      {amount !== null && (
        <div className={styles.selectedAmount}>
          <p>Total Amount: ${amount}</p>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <Button
          buttonText={
            loading
              ? 'Processing...'
              : `Continue To Pay: $${amount ? formatAmount(amount) : '0.00'}`
          }
          onClick={handlePayment}
          disabled={isButtonDisabled}
        />
      </div>
      {loading && (
        <div className={styles.processingMessage}>
          Please wait while we process your payment...
        </div>
      )}
    </div>
  );
}
