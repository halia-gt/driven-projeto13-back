import dayjs from 'dayjs';
import db from '../database/db.js'; 

async function createTransaction(req, res) {
    const { amount, description, type } = req.body;
    const user = res.locals.user;

    try {
        await db.collection('transactions').insertOne({
            amount: Number(amount).toFixed(2),
            description,
            type,
            time: dayjs().format('DD/MM/YYYY'),
            userId: user._id
        });

        res.send({ message: 'transaction created successfully' });

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function listTransactions(req, res) {
    const user = res.locals.user;
    const query = { userId: user._id};
    const options = {
        sort: {
            _id: -1
        }
    };

    try {
        const transactions = await db.collection('transactions').find(query, options).project({ userId: 0 }).toArray();

        res.send({ transactions });

    } catch (error) {
        console.log(error); 
        res.sendStatus(500);
    }
}

async function deleteTransaction(req, res) {
    const query = res.locals.transactionId;

    try {
        await db.collection('transactions').deleteOne(query);

        res.send({ message: 'transaction deleted successfully' });
        
    } catch (error) {
        console.log(error); 
        res.sendStatus(500);
    }
}

async function updateTransaction(req, res) {
    const { amount, description, type } = req.body;
    const query = res.locals.transactionId;
    const newDocument = { $set: {
            amount,
            description,
            type
        }
    };

    try {
        await db.collection('transactions').updateOne(query, newDocument);

        res.send({ message: 'transaction updated successfully' })
        
    } catch (error) {
        console.log(error); 
        res.sendStatus(500);
    }
}

export {
    createTransaction,
    listTransactions,
    deleteTransaction,
    updateTransaction
};