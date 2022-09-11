import db from '../database/db.js';
import { ObjectId } from 'mongodb';

async function validUser(req, res, next) {
    const { transactionId } = req.params;
    const user = res.locals.user;
    const query = { _id: new ObjectId(transactionId) };

    try {
        const transaction = await db.collection('transactions').findOne(query);

        if (!transaction) {
            res.status(404).send({ message: 'transaction not found' });
            return;
        }

        if (!user._id.equals(transaction.userId)) {
            res.status(401).send({ message: 'user not authorized'});
            return;
        }

        res.locals.transactionId = query;
        next();
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export default validUser;
