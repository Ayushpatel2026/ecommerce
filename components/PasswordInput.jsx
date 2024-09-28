import React, { useState } from 'react';
import styles from '../styles/login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordInput = ({name, label, autoComplete}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className={styles.formFieldWrapper}>
      <label>{label}</label>
      <div className={styles.passwordContainer}>
        <input
          className={styles.formField}
          type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
          name={name}
          placeholder="Enter password..."
          autoComplete={autoComplete}
        />
        <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
      </div>
    </div>
  );
};

export default PasswordInput;