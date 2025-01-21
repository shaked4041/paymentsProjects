import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BillsDashboard from './pages/BillsDashboard';
import SingleBill from './pages/SingleBill';
import Header from './components/Header';
import PaymentFormPage from './pages/PaymentFormPage';
import styles from './App.module.scss';
import Navbar from './components/Navbar';
import PaymentsPage from './pages/PaymentsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AddBill from './pages/AddBill'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <div className={styles.appContainer}>
              {/* <div className={styles.navCont}> */}
                <Navbar />
              {/* </div> */}
              <div className={styles.restCont}>
                <Header />
                <div className={styles.mainContent}>
                  <Routes>
                    <Route path="/" element={<BillsDashboard />} />
                    <Route path="/singleBill/:id" element={<SingleBill />} />
                    <Route
                      path="/payments/:billId"
                      element={<PaymentFormPage />}
                    />
                    <Route path='/addBill' element={<AddBill/>}/>
                    <Route path="/payments" element={<PaymentsPage />} />
                  </Routes>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
