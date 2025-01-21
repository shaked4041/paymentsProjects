export interface Bill {
    _id: string;
    name: string;
    amount: number;
    dueDate: string;
    status: string;
    amountPaid?: number;
  }
  
  export interface PaymentProps {
    totalAmount: number;
    amount: number | null;
    setAmount: (amount: number | null) => void;
    paymentMethod: string | null;
    setPaymentStatus: (status: string | null) => void;
    amountPaid?: number | null;
  }
  
  export interface PaymentError {
    message: string;
    code?: string;
  }
  
  export interface PaymentData {
    billId: string;
    amount: number;
    paymentMethod: string;
  }