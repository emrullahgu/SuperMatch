import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.json({
    onlineUsers: 0,
    activeMatches: 0,
    totalUsers: 0,
    averageWaitTime: 5,
    peakHours: [19, 20, 21, 22],
  });
});

export default router;
