import { formattedDate } from '../../utils/funcs';
import { CardPaymentProps } from '../../utils/types';
import styles from './style.module.scss';


export const PaymentsCard: React.FC<CardPaymentProps> = ({ payments }) => (
  <div className={styles.cardContainer}>
    {payments && Array.isArray(payments) && payments.length > 0 ? (
      payments.map((item) => (
        <div key={item._id} className={styles.card}>
          <div className={styles.leftCard}>
            <div className={styles.cardItem}>
              <strong>{item.billId?.name}</strong>
            </div>
            <div className={styles.cardItem}>
              {formattedDate(new Date(item.createdAt))}
            </div>
            <div className={styles.cardItem}>Paid via {item.paymentMethod}</div>
          </div>
          <div className={styles.rightCard}>
            <div className={styles.cardItem}>${item.billId?.amountPaid}</div>
            <div
              className={`${styles.cardItem} ${
                item.status === 'success' ? styles.paidStyle : styles.faildStyle
              }`}
            >
              {item.status}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className={styles.card}>No data available</div>
    )}
  </div>
);
