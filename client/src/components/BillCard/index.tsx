import { Link } from 'react-router-dom';
import { formattedDate } from '../../utils/funcs';
import { CardBillProps } from '../../utils/types';
import styles from './style.module.scss';
import { MdModeEdit } from 'react-icons/md';

export const BillCard: React.FC<CardBillProps> = ({ bills }) => (
  <div className={styles.cardContainer}>
    {bills && Array.isArray(bills) && bills.length > 0 ? (
      bills.map((item) => (
        <div key={item._id} className={styles.card}>
          <div className={styles.cardLeft}>
            <div className={styles.cardItem}>
              <strong>Bill Name:</strong> {item.name}
            </div>
            <div className={styles.cardItem}>
              <strong>Due Date:</strong> {formattedDate(new Date(item.dueDate))}
            </div>
            <div className={styles.cardItem}>${item.amount}</div>
          </div>
          <div className={styles.cardRight}>
            <div>
              {['Pending', 'Overdue', 'PartPaid'].includes(item.status) ? (
                <div className={styles.edit}>
                  <Link to={`editBill/${item._id}`}>
                    <button className={styles.editButton}>
                      <MdModeEdit />
                    </button>
                  </Link>
                </div>
              ) : (
                <div className={styles.edit}></div>
              )}
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
            </div>
            <div className={styles.cardActions}>
              {['Pending', 'Overdue', 'PartPaid'].includes(item.status) ? (
                <Link to={`payments/${item._id}`}>
                  <button className={styles.payButton}>Pay Now</button>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className={styles.card}>No data available</div>
    )}
  </div>
);
