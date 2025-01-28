import { Request, Response, Router } from 'express';
import { identifyCurrentUser } from '../utils/funcs';

const router = Router();

router.get('/current-user', (req: Request, res: Response): void => {
  try {
    const userId = identifyCurrentUser(req);
    console.log('userrrr', userId);
    if (!userId) {
      res
        .status(401)
        .json({ message: 'No valid token provided or token expired' });
    }
    res.status(200).json({ userId }); // Send the userId in the response body
  } catch (error) {
    console.error('Error fetching current user info:', error);
    res.status(500).json({ message: 'Failed to get current user info', error });
  }
});

export default router;
