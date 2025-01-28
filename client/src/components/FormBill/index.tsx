import { formattedDate } from '../../utils/funcs';
import { FormBillProps } from '../../utils/types';
import styles from './style.module.scss';

export default function FormBill({
  billName,
  totalAmount,
  dueDate,
  setPaymentMethod,
  amountPaid,
}: FormBillProps) {
  const paymentMethods = [
    {
      name: 'creditCard',
      label: 'Credit Card',
      sub: 'Direct from your account',
    },
    {
      name: 'paypal',
      label: 'Paypal',
      sub: 'Pay with PayPal',
    },
    {
      name: 'bankTransfer',
      label: 'Bank Transfer',
      sub: 'Direct from your account',
    },
    {
      name: 'googlePay',
      label: 'Google Pay',
      sub: 'Fast checkout',
    },
  ];

  const handlePaymentMathodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <div className={styles.formBillContainer}>
      <span className={styles.billName}>{billName}</span>
      <span className={styles.totalAmount}>${totalAmount}</span>
      {amountPaid && amountPaid < totalAmount ? (
        <div>Left To Pay : ${totalAmount - amountPaid}</div>
      ) : (
        ''
      )}
      <span className={styles.dueDate}>
        {' '}
        Due {formattedDate(new Date(dueDate))}
      </span>
      <span className={styles.selectCont}>Select Payment Method</span>
      <form className={styles.formCont}>
        {paymentMethods.map(({ name, label, sub }) => (
          <label key={name} className={styles.methodCont}>
            <input
              type="radio"
              name="paymentMethod"
              value={name}
              onChange={handlePaymentMathodChange}
              className={styles.radioCont}
            />
            <div className={styles.textCont}>
              <span className={styles.labelCont}>{label}</span>
              <small className={styles.subCont}>{sub}</small>
            </div>
          </label>
        ))}
      </form>
    </div>
  );
}
