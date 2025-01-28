import styles from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { fetchAllBills } from '../../utils/reqs';
import { useEffect, useState } from 'react';
import { OverviewBills } from '../../components/OverviewBills';
import { Bill } from '../../utils/types';
import { BillCard } from '../../components/BillCard';
import { BillsTable } from '../../components/BillsTable';
import { SearchBar } from '../../components/SearchBar';

export default function Index() {
  const nav = useNavigate();

  const [allBillsData, setAllBillsData] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const bills = await fetchAllBills();
        setAllBillsData(bills);
        setFilteredBills(bills);
      } catch (err) {
      console.log(err);
      }
    };
    fetchBills();
  }, []);

  const handleChangeSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredBills(
      query.trim()
        ? allBillsData.filter((bill) =>
            bill.name.toLowerCase().includes(query.toLowerCase())
          )
        : allBillsData
    );
  };

  const handleOpenSearch = () => {
    setOpenSearch(!openSearch);
  };


  return (
    <div className={styles.dashContainer}>
      <div className={styles.mainTitle}>
        <h2 className={styles.titleCont}>Dashboard Overview</h2>
        <div className={styles.searchMainContainer}>
          <SearchBar
            searchQuery={searchQuery}
            onSearch={handleChangeSearch}
            openSearch={openSearch}
            toggleSearch={handleOpenSearch}
          />
        </div>
        <button className={styles.addButton} onClick={() => nav('/addBill')}>
          Add Bill
        </button>
      </div>
      <div className={styles.overview}>
        <OverviewBills allBillsData={allBillsData} />
      </div>
      <div className={styles.mainTableCont}>
        <BillsTable bills={filteredBills} />
        <div className={styles.cardContainer}>
          <BillCard bills={filteredBills} />
        </div>
      </div>
    </div>
  );
}
