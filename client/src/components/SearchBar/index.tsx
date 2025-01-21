import React, { useState } from 'react';
import styles from './style.module.scss';

interface SearchProps {
  dataToFilter: { name: string }[];
}

export const SearchBar: React.FC<SearchProps> = ({ dataToFilter }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filteredData = dataToFilter.filter((item) => {
    if (searchValue.length > 0){
      return item.name.toLowerCase().includes(searchValue.toLowerCase());
    }
  });
  return (
    <div>
      <input
        className={styles.searchContainer}
        onChange={handleSearchChange}
        placeholder="search bills..."
      />

      <div>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => <div key={index}>{item.name}</div>)
        ) : (
          <div>No item found</div>
        )}
      </div>
    </div>
  );
};
