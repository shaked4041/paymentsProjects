import React from 'react';
import styles from './style.module.scss';
import { ButtonProps } from '../../utils/types';

const Button: React.FC<ButtonProps> = ({ buttonText, onClick, disabled }) => {
  return (
    <div
      className={`${styles.buttonContainer} ${disabled ? styles.disabled : ''}`}
      onClick={disabled ? undefined : onClick} 
      role="button"
      tabIndex={disabled ? -1 : 0} 
    >
      {buttonText}
    </div>
  );
};

export default Button;
