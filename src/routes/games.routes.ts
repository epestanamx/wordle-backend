import { Router } from 'express';
import { playGame } from '../controllers/game.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/play', auth, playGame);

export default router;
