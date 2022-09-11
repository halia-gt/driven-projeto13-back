import express from 'express';
import * as transactionController from '../controllers/transaction.controllers.js';
import authorizationMiddleware from '../middlewares/authorization.middlewares.js';
import validTransactionMiddleware from '../middlewares/validTransaction.middlewares.js';
import validUserMiddleware from '../middlewares/validUser.middlewares.js';

const router = express.Router();

router.use(authorizationMiddleware);
router.get('/transactions', transactionController.listTransactions);

router.post('/transactions', validTransactionMiddleware, transactionController.createTransaction);

router.delete('/transactions/:transactionId', validUserMiddleware, transactionController.deleteTransaction);
router.put('/transactions/:transactionId', validTransactionMiddleware, validUserMiddleware, transactionController.updateTransaction);

export default router;