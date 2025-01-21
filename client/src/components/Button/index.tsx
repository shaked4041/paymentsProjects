import React from 'react';
import styles from './style.module.scss';

interface ButtonProps {
  buttonText: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ buttonText, onClick, disabled }) => {
  return (
    <div
      className={`${styles.buttonContainer} ${disabled ? styles.disabled : ''}`}
      onClick={disabled ? undefined : onClick} // Don't trigger onClick if disabled
      role="button"
      tabIndex={disabled ? -1 : 0} // Remove from tab order if disabled
    >
      {buttonText}
    </div>
  );
};

export default Button;
