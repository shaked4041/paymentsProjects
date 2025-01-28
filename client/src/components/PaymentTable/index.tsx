import React from 'react';
import { formattedDate } from '../../utils/funcs';
import styles from './style.module.scss';
import { TablePaymentProps } from '../../utils/types';



export const PaymentsTable: React.FC<TablePaymentProps> = ({ payments }) => (
  <table className={styles.tableCont}>
    <thead className={styles.theadCont}>
      <tr className={styles.trCont}>
        <th>Payment Name</th>
        <th>Amount Paid</th>
        <th>Payment Date</th>
        <th>Status</th>
        <th>Payment Method</th>
      </tr>
    </thead>
    <tbody className={styles.tbodyCont}>
      {payments && Array.isArray(payments) && payments.length > 0 ? (
        payments.map((item, index) => (
          <tr key={index}>
            <td>{item.billId?.name || 'No Bill Name'}</td>
            <td>${item.billId?.amountPaid || 'No Bill Amount'}</td>
            <td>{formattedDate(item.createdAt) || 'No Payment Date'}</td>
            <td>
              <button
                className={`${
                  item.status === 'success'
                    ? styles.paidStyle
                    : styles.faildStyle
                }`}
              >
                {item.status || 'No Payment Status'}
              </button>
            </td>
            <td>{item.paymentMethod || 'No Payment Method'}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td>No payments found</td>
        </tr>
      )}
    </tbody>
  </table>
);
