import express from 'express';
import * as authController from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/sign-up', authController.createUser);
router.post('/login', authController.login);

export default router;