import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import db from '../database/db.js';

const registerSchema = joi.object({
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

const loginSchema = joi.object({
    email: joi.string()
        .email()
        .required(),

    password: joi.string()
        .required()
});

async function emailRegistered(email) {
    return (await db.collection('users').findOne({ email: email }));
}

async function createUser(req, res) {
    const { name, email, password, confirm_password } = req.body;
    const validation = registerSchema.validate({ name, email, password, confirm_password }, { abortEarly: false });

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

        res.status(201).send({ message: 'user created successfully' });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    const validation = loginSchema.validate({ email, password });

    if (validation.error) {
        const errors = validation.error.details.map(error => error.message);
        res.status(422).send({ message: errors });
        return;
    }

    try {
        const user = await db.collection('users').findOne({ email });
        const passwordIsValid = bcrypt.compareSync(password, user.password)

        if(user && passwordIsValid) {
            const token = uuid();

            await db.collection("sessions").insertOne({
                userId: user._id,
                token
            });
            
            delete user.password
            res.send({ ...user, token });

        } else {
            res.status(401).send({ message: 'incorrect e-mail or password' });
        }
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function logout(req, res) {
    const token = res.locals.token;

    try {
        await db.collection('sessions').deleteOne({ token });

        res.send({ message: 'logout sucessful' });
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    createUser,
    login,
    logout
};