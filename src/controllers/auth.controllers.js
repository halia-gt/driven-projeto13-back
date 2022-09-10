import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import db from '../database/db.js';

const userSchema = joi.object({
    name: joi.string()
        .min(3)
        .max(20)
        .required(),
    
    email: joi.string()
        .email()
        .required(),

    password: joi.string()
        .min(6)
        .required(),

    confirm_password: joi.ref('password')
});

async function emailRegistered(email) {
    return (await db.collection('users').findOne({ email: email }));
}

async function createUser(req, res) {
    const { name, email, password, confirm_password } = req.body;
    const validation = userSchema.validate({ name, email, password, confirm_password }, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(error => error.message);
        res.status(422).send({ message: errors });
        return;
    }

    try {
        if (await emailRegistered(email)) {
            res.status(409).send({ message: 'email is already being used' });
            return;
        }

        const passwordHash = bcrypt.hashSync(password, 10);

        await db.collection('users').insertOne({
            name,
            email,
            password: passwordHash
        });

        res.status(201).send({ message: 'user created' });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    createUser
};