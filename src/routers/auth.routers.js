import express from 'express';
import * as authController from '../controllers/auth.controllers.js';
import authorizationMiddleware from '../middlewares/authorization.middlewares.js';

const router = express.Router();

router.post('/sign-up', authController.createUser);
router.post('/login', authController.login);

router.use(authorizationMiddleware);
router.delete('/login', authController.logout);

export default router;