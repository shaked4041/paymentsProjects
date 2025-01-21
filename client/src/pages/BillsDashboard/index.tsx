import styles from './style.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { activateRefresh, fetchAllBills } from '../../utils/reqs';
import { formattedDate } from '../../utils/funcs';
import { useEffect, useState } from 'react';
import { OverviewBills } from '../../components/OverviewBills';
import { Bill } from '../../utils/types';
import { IoSearch } from 'react-icons/io5';

export default function Index() {
  const nav = useNavigate();

  const [allBillsData, setAllBillsData] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      activateRefresh();
    }, 4 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const bills = await fetchAllBills();
        setAllBillsData(bills);
        setFilteredBills(bills);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleChangeSearch = (query: string) => {
    setSearchQuery(query);

    if (searchQuery.trim() === '') {
      setFilteredBills(allBillsData);
    } else {
      const filtered = allBillsData.filter((bill) =>
        bill.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBills(filtered);
    }
  };

  const handleOpenSearch = () => {
    setOpenSearch(!openSearch);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error)?.message}</div>;

  return (
    <div className={styles.dashContainer}>
      <div className={styles.mainTitle}>
        <h2 className={styles.titleCont}>Dashboard Overview</h2>
        <div>
          <input
            value={searchQuery}
            className={`${styles.searchContainer} ${
              openSearch ? styles.open : ''
            }`}
            onChange={(e) => handleChangeSearch(e.target.value)}
            placeholder="search bills..."
          />
        </div>
        <div className={styles.searchIcon} onClick={handleOpenSearch}>
          <IoSearch />
        </div>
        <button className={styles.addButton} onClick={() => nav('/addBill')}>
          Add Bill
        </button>
      </div>
      {openSearch ? (
        <div className={styles.openSearchCont}>
          {' '}
          <input
            value={searchQuery}
            className={`${styles.searchContainerOpen} ${
              openSearch ? styles.open : ''
            }`}
            onChange={(e) => handleChangeSearch(e.target.value)}
            placeholder="search bills..."
          />
        </div>
      ) : (
        <></>
      )}
      <div className={styles.overview}>
        <OverviewBills allBillsData={allBillsData} />
      </div>
      <div className={styles.mainTableCont}>
        <table className={styles.tableCont}>
          <thead className={styles.theadCont}>
            <tr className={styles.trCont}>
              <th>Bill Name</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tbodyCont}>
            {allBillsData &&
            Array.isArray(allBillsData) &&
            filteredBills.length > 0 ? (
              filteredBills.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.amount}</td>
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
                    {item.status === 'Pending' ||
                    item.status === 'Overdue' ||
                    item.status === 'PartPaid' ? (
                      <Link to={`payments/${item._id}`}>
                        <button className={styles.payButton}>Pay Now</button>
                      </Link>
                    ) : (
                      <span></span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.cardContainer}>
          {allBillsData &&
            Array.isArray(allBillsData) &&
            filteredBills.length > 0 &&
            filteredBills.map((item, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.cardItem}>
                  <strong>Bill Name:</strong> {item.name}
                </div>
                <div className={styles.cardItem}>
                  <strong>Amount:</strong> ${item.amount}
                </div>
                <div className={styles.cardItem}>
                  <strong>Due Date:</strong>{' '}
                  {formattedDate(new Date(item.dueDate))}
                </div>
                <div className={styles.cardItem}>
                  <strong>Status:</strong>{' '}
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
                  {item.status === 'Pending' || item.status === 'Overdue' || item.status === 'PartPaid' ? (
                    <Link to={`payments/${item._id}`}>
                      <button className={styles.payButton}>Pay Now</button>
                    </Link>
                  ) : (
                    <span>Paid</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
