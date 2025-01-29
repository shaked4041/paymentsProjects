import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';
import { PaymentStatus } from '../utils/types';

export const usePaymentSocket = (
  billId: string | undefined,
  billName: string | undefined,
  setPaymentStatus: (status: string | null) => void
) => {

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (!billId) return;

    const socket: Socket = io(baseUrl, {
      transports: ['websocket'],
    });

    socket.on('paymentStatusUpdate', (data: PaymentStatus) => {
      if (data.billId === billId) {
        setPaymentStatus(data.status);
        const statusMessage = `Payment for ${billName || 'bill'}: ${
          data.status
        }`;

        if (data.status === 'success') {
          toast.success(statusMessage);
        } else {
          toast.error(statusMessage);
        }
      }
    });

    return () =>{
        socket.disconnect();
    };
  }, [billId, billName, setPaymentStatus]);
};
