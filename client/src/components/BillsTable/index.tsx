import { Link } from 'react-router-dom';
import { formattedDate } from '../../utils/funcs';
import { TableBillProps } from '../../utils/types';
import styles from './style.module.scss';
import { MdModeEdit } from 'react-icons/md';

export const BillsTable: React.FC<TableBillProps> = ({ bills }) => (
  <table className={styles.tableCont}>
    <thead className={styles.theadCont}>
      <tr className={styles.trCont}>
        <th>Bill Name</th>
        <th>Amount</th>
        <th>Due Date</th>
        <th>Status</th>
        <th>Actions</th>
        <th className={styles.edit}></th>
      </tr>
    </thead>
    <tbody className={styles.tbodyCont}>
      {bills.length > 0 ? (
        bills.map((item) => (
          <tr key={item._id}>
            <td>{item.name}</td>
            <td>${item.amount}</td>
            <td>{formattedDate(new Date(item.dueDate))}</td>
            <td>
              <button
                className={`
                  ${item.status === 'Pending' ? styles.pendingStyle : ''}
                  ${item.status === 'Overdue' ? styles.overdueStyle : ''}
                  ${item.status === 'Paid' ? styles.paidStyle : ''}
                  ${item.status === 'Processing' ? styles.processStyle : ''}
                  ${item.status === 'PartPaid' ? styles.paidStyle : ''}
                `}
              >
                {item.status}
              </button>
            </td>
            <td>
              {['Pending', 'Overdue', 'PartPaid'].includes(item.status) ? (
                <Link to={`payments/${item._id}`}>
                  <button className={styles.payButton}>Pay Now</button>
                </Link>
              ) : (
                <button className={styles.paidStyle}>Paid</button>
              )}
            </td>
            {['Pending', 'Overdue', 'PartPaid'].includes(item.status) ? (
              <td className={styles.edit}>
                <Link to={`editBill/${item._id}`}>
                  <button className={styles.editButton}>
                    <MdModeEdit />
                  </button>
                </Link>
              </td>
            ) : (
              <td className={styles.edit}></td>
            )}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5}>No data available</td>
        </tr>
      )}
    </tbody>
  </table>
);
