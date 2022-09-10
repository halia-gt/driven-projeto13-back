import express from 'express';
import * as transactionController from '../controllers/transaction.controllers.js';
import authorizationMiddleware from '../middlewares/authorization.middlewares.js';

const router = express.Router();
router.use(authorizationMiddleware);

router.post('/transactions', transactionController.createTransaction);

export default router;