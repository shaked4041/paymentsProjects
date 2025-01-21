import { useState } from 'react';
import { login } from '../../utils/reqs';
import styles from './style.module.scss';
import { LuEyeOff } from 'react-icons/lu';
import { LuEye } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';


interface IFormState {
  email: string;
  password: string;
}

export default function LoginPage() {
  const formTemplate: IFormState = {
    email: '',
    password: '',
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
    const { ...data } = formState;
    try {
      const res = await login(data);
      if (res) {
        nav('/');
      }
      console.log(res);

    } catch (error: any) {
      console.error({ 'User creation faild': error.response.data.msg });
    }
  };
  return (
    <div className={styles.registerPage}>
      <h1>Login</h1>
      <div className={styles.formMainContainer}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
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
          <button type="submit" className={styles.signButton}>
            Login
          </button>
        </form>
        <span className={styles.loginLink}>
          Don't have an account? <Link to={`/register`}>Sign in</Link>
        </span>
      </div>
    </div>
  );
}
