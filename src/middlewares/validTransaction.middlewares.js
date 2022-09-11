import joi from 'joi';

const transactionSchema = joi.object({
    amount: joi.number()
        .precision(2)
        .required(),
    
    description: joi.string()
        .required(),
    
    type: joi.valid('expense', 'income')
        .required()
});

async function validTransaction(req, res, next) {
    const { amount, description, type } = req.body;
    const validation = transactionSchema.validate({ amount, description, type }, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(error => error.message);
        res.status(422).send({ message: errors });
        return;
    }

    next();
}

export default validTransaction;