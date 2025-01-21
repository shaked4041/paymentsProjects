import { useParams } from 'react-router-dom';
import { fetchOneBill } from '../../utils/reqs';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import FormBill from '../../components/FormBill';
import PaymentBill from '../../components/PaymentBill';
import { usePaymentSocket } from '../../hooks/usePaymentSocket';
import { Bill } from '../../utils/types';

export default function PaymentPage() {
  const { billId } = useParams<{ billId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(0);
  const [fullBill, setFullBill] = useState<Bill | null>(null);

  useEffect(() => {
    if (billId) {
      const fetchBillData = async () => {
        try {
          const bill = await fetchOneBill(billId);
          console.log(bill);
          setFullBill(bill); 
        } catch (error) {
          setError('Error fetching bill data');
        }
      };

      fetchBillData(); 
    }
  }, [billId]);

  usePaymentSocket(billId, fullBill?.name, setPaymentStatus);

  return (
    <div className={styles.paymentContainer}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {paymentStatus && (
        <div className={styles.statusMessage}>
          Payment Status: {paymentStatus}
        </div>
      )}

      <div className={styles.compContainer}>
        <div className={styles.FormBillContainer}>
          <FormBill
            billName={fullBill?.name || ''}
            totalAmount={fullBill?.amount || 0}
            dueDate={fullBill?.dueDate || ''}
            setPaymentMethod={setPaymentMethod}
            amountPaid={fullBill?.amountPaid}
          />
        </div>
        <div className={styles.paymentBillCont}>
          <PaymentBill
            totalAmount={fullBill?.amount || 0}
            amount={amount}
            setAmount={setAmount}
            paymentMethod={paymentMethod}
            setPaymentStatus={setPaymentStatus}
            amountPaid={fullBill?.amountPaid}
          />
        </div>
      </div>
    </div>
  );
}
