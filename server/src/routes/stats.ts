import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.json({
    onlineUsers: Math.floor(Math.random() * 3000) + 2000,
    totalMatches: 52438921,
    totalUsers: 1247893,
    countries: 187,
  });
});

export default router;
