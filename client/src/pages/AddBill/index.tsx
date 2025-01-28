import React, { useState } from 'react';
import styles from './style.module.scss';
import { createBill } from '../../utils/reqs';
import { useNavigate } from 'react-router-dom';
import { IBillForm } from '../../utils/types';


export default function index() {
  const formTemplate: IBillForm = {
    name: '',
    amount: 0,
    dueDate: new Date(),
  };
  const nav = useNavigate();
  const [formState, setFormState] = useState<IBillForm>(formTemplate);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((old) => {
      const newData = {
        ...old,
        [name]: name === 'dueDate' ? new Date(value) : value,
      };
      setFormState(newData);
      return newData;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await createBill(formState);
      console.log(res);
      nav('/')
    } catch (error: any) {
      console.error({ 'Bill creation faild': error.response.data.message });
    }
  };

  return (
    <div className={styles.addBillContainer}>
      <div className={styles.mainContainer}>
        <span className={styles.mainTitle}>Create New Bill</span>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <label>Bill Name:</label>
          <input
            name="name"
            type="text"
            placeholder=""
            value={formState.name}
            required
            onChange={handleChange}
            className={styles.inputStyle}
          />
          <label>Bill Amount:</label>
          <input
            name="amount"
            type="number"
            placeholder=""
            value={formState.amount}
            required
            onChange={handleChange}
            className={styles.inputStyle}
          />
          <label>Bill Due Date:</label>
          <input
            name="dueDate"
            type="date"
            placeholder=""
            value={formState.dueDate.toISOString().split('T')[0]}
            required
            onChange={handleChange}
            className={styles.inputStyle}
          />
          <button type="submit" className={styles.submitButton}>
            Create Bill
          </button>
        </form>
      </div>
    </div>
  );
}
