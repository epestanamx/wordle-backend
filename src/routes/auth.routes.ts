import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import { login, register, profile } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', auth, profile);

export default router;
