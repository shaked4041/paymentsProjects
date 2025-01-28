export interface Bill {
    _id: string;
    name: string;
    amount: number;
    dueDate: string | Date;
    status: string;
    amountPaid?: number;
    userId: string;
    paymentsIds: string[];
    __v: number;
  }

  export interface Payment {
    _id: string;
    billId: Bill;
    amount: number;
    paymentMethod: string;
    status: string;
    userId: string;
    createdAt: string;
    __v: number;
  }
  
  export interface PaymentProps {
    totalAmount: number;
    amount: number | null;
    setAmount: (amount: number | null) => void;
    paymentMethod: string | null;
    setPaymentStatus: (status: string | null) => void;
    amountPaid?: number | null;
    userId: string;
  }
  
  export interface PaymentError {
    message: string;
    code?: string;
  }
  
  export interface PaymentData {
    billId: string;
    amount: number;
    paymentMethod: string;
    userId: string;
  }

  export interface IBillForm {
    name: string;
    amount: number;
    dueDate: Date;
  }
  
  export interface CardBillProps {
    bills: Bill[];
  }

  export interface TableBillProps {
    bills: Bill[];
  }

  export interface ButtonProps {
    buttonText: string;
    onClick?: () => void;
    disabled?: boolean;
  }

  export interface FormBillProps {
    billName: string;
    totalAmount: number;
    dueDate: string | Date;
    setPaymentMethod: (method: string) => void;
    amountPaid?: number;
  }

  export interface OverviewBillsProps {
    allBillsData: Bill[];
  }
  
  export interface CardPaymentProps {
    payments: Payment[];
  }

  export interface TablePaymentProps {
    payments: Payment[];
  }

  export interface SearchBarProps {
    searchQuery: string;
    onSearch: (query: string) => void;
    openSearch: boolean;
    toggleSearch: () => void;
  }

  export interface PaymentStatus {
    billId: string;
    status: string;
  }

  export interface IBillEdit {
    name: string;
    amount: number;
    dueDate: string;
  }

  export interface ILoginState {
    email: string;
    password: string;
  }

  export interface IFormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }
  