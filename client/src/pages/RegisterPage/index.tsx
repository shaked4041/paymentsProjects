import { useState } from 'react';
import { createUser } from '../../utils/reqs';
import styles from './style.module.scss';
import { LuEyeOff } from 'react-icons/lu';
import { LuEye } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';

interface IFormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export default function RegisterPage() {
  const formTemplate: IFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };
  const [formState, setFormState] = useState<IFormState>(formTemplate);
  const [isPassVisible, setIsPassVisible] = useState<Boolean>(false);
  const nav = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((old) => {
      const newData = { ...old, [name]: value };
      setFormState(newData);
      return newData;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { passwordConfirm, ...data } = formState;
    if (formState.password !== formState.passwordConfirm) {
      console.error('Passwords do not mach');
      return;
    }
    try {
      const res = await createUser(data);
      nav('/login');
      console.log(res);
    } catch (error: any) {
      console.error({ 'User creation faild': error.response.data.msg });
    }
  };
  return (
    <div className={styles.registerPage}>
      <h1>Sign Up</h1>
      <div className={styles.formMainContainer}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <input
            name="firstName"
            value={formState.firstName}
            type="text"
            required
            onChange={handleChange}
            placeholder="First Name"
            className={styles.inputCont}
          />
          <input
            name="lastName"
            value={formState.lastName}
            type="text"
            required
            onChange={handleChange}
            placeholder="Last Name"
            className={styles.inputCont}
          />
          <input
            name="email"
            value={formState.email}
            type="email"
            required
            onChange={handleChange}
            placeholder="Email"
            className={styles.inputCont}
          />
          <div className={styles.inputContainer}>
            <input
              name="password"
              value={formState.password}
              type={isPassVisible ? 'text' : 'password'}
              required
              onChange={handleChange}
              placeholder="Password"
              className={styles.passInputField}
            />
            <button
              className={styles.toggleButton}
              onClick={() => setIsPassVisible(!isPassVisible)}
            >
              {isPassVisible ? <LuEye /> : <LuEyeOff />}
            </button>
          </div>
          <div className={styles.inputContainer}>
            <input
              name="passwordConfirm"
              value={formState.passwordConfirm}
              type={isPassVisible ? 'text' : 'password'}
              required
              onChange={handleChange}
              placeholder="Confirm Password"
              className={styles.passInputField}
            />
            <button
              className={styles.toggleButton}
              onClick={() => setIsPassVisible(!isPassVisible)}
            >
              {isPassVisible ? <LuEye /> : <LuEyeOff />}
            </button>
          </div>
          <button type="submit" className={styles.signButton}>
            Sign Up
          </button>
        </form>
        <span className={styles.loginLink}>
          Already have an account? <Link to={`/login`}>Log in</Link>
        </span>
      </div>
    </div>
  );
}
