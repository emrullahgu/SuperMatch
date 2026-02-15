import { Router, Request, Response } from 'express';

const router = Router();

router.get('/profile', async (req: Request, res: Response) => {
  res.json({ message: 'User profile endpoint - Yakında eklenecek' });
});

router.put('/profile', async (req: Request, res: Response) => {
  res.json({ message: 'Update profile endpoint - Yakında eklenecek' });
});

router.get('/settings', async (req: Request, res: Response) => {
  res.json({ message: 'User settings endpoint - Yakında eklenecek' });
});

router.put('/settings', async (req: Request, res: Response) => {
  res.json({ message: 'Update settings endpoint - Yakında eklenecek' });
});

export default router;
