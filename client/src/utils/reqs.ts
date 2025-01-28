import { toast } from 'react-toastify';
import axios from 'axios';
import { Bill, IBillForm } from './types';

const baseUrl = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export const activateRefresh = async () => {
  try {
    const response = await api.post('/auth/refresh');
    console.log(response);
  } catch (error) {
    console.error('Failed to refresh tokens', error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/current-user');
    return response.data.userId;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
  }
};

export const fetchAllBills = async () => {
  try {
    const response = await api.get('/bills');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error fetching bills');
  }
};

export const fetchAllPayments = async () => {
  try {
    const response = await api.get('/payments');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || 'Error fetching payments'
    );
  }
};

export const fetchOneBill = async (id: string) => {
  if (!id) {
    console.error('Bill ID is required');
    return { data: null, loading: false, error: 'Bill ID is required' };
  }

  try {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error fetching bill');
  }
};

export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/auth/register', userData);
    console.log('User created:', response.data);
    toast.success(response.data.message || 'Registration successful');
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.msg || 'Register faild');
    throw error;
  }
};

export const login = async (userData: { email: string; password: string }) => {
  try {
    const response = await api.post('/auth/login', userData);
    localStorage.setItem('accessToken', response.data.accessToken);
    console.log('User loggedIn:', response.data);
    toast.success(response.data.message || 'Login successful');
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.msg || 'Login failed');
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error: any) {
    toast.error(error?.response?.data?.msg || 'Logout failed');
    throw error;
  }
};

export const createPayment = async (paymentData: {
  billId: string;
  amount: number;
  paymentMethod: string;
}) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || error.message || 'Payment failed'
    );
    throw error;
  }
};

export const createBill = async (data: IBillForm) => {
  try {
    const userId = await getCurrentUser();
    console.log('Extracted User ID:', userId);
    const billData = { ...data, userId };
    const response = await api.post('/bills', billData);
    toast.success(response.data.message || 'Bill creation success');
    return response.data;
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || error.message || 'Bill creation failed'
    );
    throw error;
  }
};

export const editBill = async (data: Partial<Bill>) => {
  try {
    const billId = data._id;
    const res = await api.put(`/bills/${billId}`, data);
    return res;
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || error.message || 'Bill creation failed'
    );
    throw error;
  }
};

export const loginFirebase = async (idToken: string) => {
  try {
    const res = await api.post('/auth/firebase-google', { idToken });
    return res.data;
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || error.message || 'Google login faild'
    );
    throw error;
  }
};
