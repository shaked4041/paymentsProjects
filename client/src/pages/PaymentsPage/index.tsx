import { useEffect, useState } from 'react';
import { fetchAllPayments } from '../../utils/reqs';
import { Payment } from '../../utils/types';
import styles from './style.module.scss';
import { PaymentsTable } from '../../components/PaymentTable';
import { PaymentsCard } from '../../components/PaymentsCard';

export default function index() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const payments = await fetchAllPayments();
        setPayments(payments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPayments();
  }, []);
  return (
    <div className={styles.dashContainer}>
      <h2 className={styles.titleCont}>Your Payments</h2>
      <div className={styles.mainTableCont}>
        <PaymentsTable payments={payments} />
        <div className={styles.cardContainer}>
          <PaymentsCard payments={payments} />
        </div>
      </div>
    </div>
  );
}
