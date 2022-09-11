import joi from 'joi';
import dayjs from 'dayjs';
import db from '../database/db.js'; 

const transactionSchema = joi.object({
    amount: joi.number()
        .precision(2)
        .required(),
    
    description: joi.string()
        .required(),
    
    type: joi.valid('expense', 'income')
        .required()
});

async function createTransaction(req, res) {
    const { amount, description, type } = req.body;
    const user = res.locals.user;
    const validation = transactionSchema.validate({ amount, description, type }, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(error => error.message);
        res.status(422).send({ message: errors });
        return;
    }

    try {
        await db.collection('transactions').insertOne({
            amount,
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

    try {
        const query = { userId: user._id};
        const options = {
            sort: {
                _id: -1
            }
        };
        const transactions = await db.collection('transactions').find(query, options).project({ userId: 0 }).toArray();
        
        res.send({ transactions });

    } catch (error) {
        console.log(error); 
        res.sendStatus(500);
    }
}   

export {
    createTransaction,
    listTransactions
};