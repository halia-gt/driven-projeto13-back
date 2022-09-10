import express from 'express';
import cors from 'cors';
import mongo from './db/db.js';

const app = express();
app.use(cors());
app.use(express.json());

const db = await mongo();

app.get('/sign-up', async (req, res) => {
    const { name, email, password, confirm } = req.body;
    try {
        console.log('To vivo?')

        res.send('Ok');
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(5000, () => console.log('Listening on port 5000'));