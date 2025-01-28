import { Response, Request } from 'express';

declare global {
  namespace Express {
    interface Response {
      cookie: (name: string, value: string, options?: object) => void;
    }
  }
}
