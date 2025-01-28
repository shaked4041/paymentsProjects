import React from 'react';
import styles from './style.module.scss';
import { IoSearch } from 'react-icons/io5';
import { SearchBarProps } from '../../utils/types';


export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearch,
  openSearch,
  toggleSearch,
}) => {
  return (
    <div className={styles.searchWrapper}>
      <input
        value={searchQuery}
        className={styles.desktopSearch}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search bills..."
      />
      <div className={styles.searchIcon} onClick={toggleSearch}>
        <IoSearch />
      </div>

      <div className={`${styles.mobileSearchWrapper} ${openSearch ? styles.open : ''}`}>
          <input
            value={searchQuery}
            className={styles.mobileSearch}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search bills..."
          />
      </div>
    </div>
  );
};
