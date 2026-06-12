import express from 'express';
import { register, login, getme } from '../controller/authcontroller.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getme);

export default router;
