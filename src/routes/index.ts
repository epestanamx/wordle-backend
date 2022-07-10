import { Router } from 'express';
import authRoutes from './auth.routes';
import gamesRoutes from './games.routes';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).send({
    name: 'wordle-backend',
    version: '1.0.0',
    description: 'Wordle Backend',
  });
});

router.use('/', authRoutes);
router.use('/games', gamesRoutes);

export default router;
