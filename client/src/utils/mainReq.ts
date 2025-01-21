// import { useState } from 'react';
// import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// const baseUrl = 'http://localhost:3002';

// interface UseApiParams {
//   method: AxiosRequestConfig['method'];
//   path: string;
//   body?: Record<string, any>;
// }

// interface UseApiResponse<T> {
//   data: T | null;
//   loading: boolean;
//   error: any;
//   fetchData: () => Promise<void>;
// }

// export const api = axios.create({
//   baseURL: baseUrl,
//   withCredentials: true,
// });

// export const useApi = <T>({
//   method,
//   path,
//   body,
// }: UseApiParams): UseApiResponse<T> => {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<any>(null);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response: AxiosResponse<T> = await api({
//         method,
//         url: path,
//         data: body,
//       });

//       setData(response.data);
//     } catch (error: any) {
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { data, loading, error, fetchData };
// };
