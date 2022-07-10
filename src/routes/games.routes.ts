import { Router } from 'express';
import { playGame, topUsers, topWords } from '../controllers/game.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/play', auth, playGame);
router.get('/top/words', auth, topWords);
router.get('/top/users', auth, topUsers);

export default router;
