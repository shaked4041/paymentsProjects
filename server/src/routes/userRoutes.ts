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
      return;
    }
    res.status(200).json({ userId });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      message: 'Failed to get current user info',
      error: errorMessage,
    });
  }
});

export default router;
