import React from 'react';
import { isDateInCurrentMonth } from '../../utils/funcs';
import styles from './style.module.scss';
import { OverviewBillsProps } from '../../utils/types';

export const OverviewBills: React.FC<OverviewBillsProps> = ({
  allBillsData,
}) => {
  const billsDueThisMonthArray =
    allBillsData && allBillsData.length > 0
      ? allBillsData.filter((bill) => isDateInCurrentMonth((bill.dueDate).toString()))
      : [];

  let sumDueThisMonth = billsDueThisMonthArray.reduce((sum, bill) => {
    return sum + bill.amount;
  }, 0);

  const paidBills =
    allBillsData && allBillsData.length > 0
      ? allBillsData.filter((bill) => bill.status === 'Paid')
      : [];

     const paidTihsMonth =  paidBills.filter((bill) => isDateInCurrentMonth((bill.dueDate).toString()))

  const sumPaidBills = paidTihsMonth.reduce((sum, bill) => {
    return sum + bill.amount;
  }, 0);

  const pendingBills =
    allBillsData && allBillsData.length > 0
      ? allBillsData.filter((bill) => bill.status === 'Pending')
      : [];

  const sumPending = pendingBills.reduce((sum, bill) => {
    return sum + bill.amount;
  }, 0);

  const overviewData = [
    {
      topTitle: 'Total Due',
      middleTitle: sumDueThisMonth,
      bottumTitle: 'This month',
    },
    {
      topTitle: 'Paid',
      middleTitle: sumPaidBills,
      bottumTitle: 'This month',
    },
    {
      topTitle: 'Pending',
      middleTitle: sumPending,
      bottumTitle: `${pendingBills.length} bills`,
    },
  ];

  return (
    <div className={styles.overviewContainer}>
      <span className={styles.titleContainer}>Overview</span>
      <div className={styles.cardsCont}>
        {overviewData.map((info, index) => (
          <div className={styles.cardContainer} key={index}>
            <div className={styles.topTitle}>{info.topTitle}</div>
            <div className={styles.middleTitle}>${info.middleTitle}</div>
            <div className={styles.bottumTitle}>{info.bottumTitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
