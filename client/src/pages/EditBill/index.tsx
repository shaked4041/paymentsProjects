import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';
import { editBill, fetchOneBill } from '../../utils/reqs';
import { useNavigate, useParams } from 'react-router-dom';
import { Bill, IBillEdit } from '../../utils/types';


export default function index() {
  const { billId } = useParams<{ billId: string }>();
  const [fullBill, setFullBill] = useState<Bill | null>(null);
  const [formState, setFormState] = useState<IBillEdit>({
    name: '',
    amount: 0,
    dueDate: '',
  });

  const nav = useNavigate();

  useEffect(() => {
    const fetchBill = async () => {
      if (billId) {
        try {
          const bill = await fetchOneBill(billId);
          setFullBill(bill);
        } catch (error) {
          console.error('Error fetching bill:', error);
        }
      } else {
        console.log('No billId found');
        nav('/');
      }
    };

    fetchBill();
  }, [billId, nav]);

  useEffect(() => {
    if (fullBill) {
      let formattedDueDate = '';

      if (fullBill.dueDate instanceof Date) {
        formattedDueDate = fullBill.dueDate.toISOString().split('T')[0];
      } else if (typeof fullBill.dueDate === 'string') {
        const date = new Date(fullBill.dueDate);
        formattedDueDate = date.toISOString().split('T')[0];
      }

      setFormState({
        name: fullBill.name,
        amount: fullBill.amount,
        dueDate: formattedDueDate,
      });
    }
  }, [fullBill]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((old) => ({
      ...old,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const submissionData = {
        ...formState,
        dueDate: new Date(formState.dueDate),
       _id: fullBill?._id
      };
      console.log(submissionData);
      const res = await editBill(submissionData);
      console.log(res);
      if(res){
        nav('/');
      }
    } catch (error: any) {
      console.error({ 'Bill creation faild': error.response.data.message });
    }
  };

  return (
    <div className={styles.addBillContainer}>
      <div className={styles.mainContainer}>
        <span className={styles.mainTitle}>Edit Bill</span>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <label>Bill Name:</label>
          <input
            name="name"
            type="text"
            value={formState.name}
            onChange={handleChange}
            className={styles.inputStyle}
          />
          <label>Bill Amount:</label>
          <input
            name="amount"
            type="number"
            value={formState.amount}
            onChange={handleChange}
            className={styles.inputStyle}
          />
          <label>Bill Due Date:</label>
          <input
            name="dueDate"
            type="date"
            value={formState.dueDate}
            onChange={handleChange}
            className={styles.inputStyle}
          />
          <button type="submit" className={styles.submitButton}>
            Edit Bill
          </button>
        </form>
      </div>
    </div>
  );
}
