import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import BillsDashboard from './pages/BillsDashboard';
import Header from './components/Header';
import PaymentFormPage from './pages/PaymentFormPage';
import styles from './App.module.scss';
import Navbar from './components/Navbar';
import PaymentsPage from './pages/PaymentsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AddBill from './pages/AddBill';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { activateRefresh } from './utils/reqs';
import EditBill from './pages/EditBill';
import { useAuthStore } from './store/authStore';

export default function App() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const intervalId = setInterval(() => {
      activateRefresh();
    }, 4 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div className={styles.appContainer}>
                <Navbar />
                <div className={styles.restCont}>
                  <Header />
                  <div className={styles.mainContent}>
                    <Routes>
                      <Route path="/" element={<BillsDashboard />} />
                      <Route path="/editBill/:billId" element={<EditBill />} />
                      <Route
                        path="/payments/:billId"
                        element={<PaymentFormPage />}
                      />
                      <Route path="/addBill" element={<AddBill />} />
                      <Route path="/payments" element={<PaymentsPage />} />
                    </Routes>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
