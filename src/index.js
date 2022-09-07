import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import joi from 'joi';
import { MongoClient, ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import { stripHtml } from 'string-strip-html';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

(async () => {
    try {
        await client.connect();
        db = client.db('batepapo-uol');
    } catch (error) {
        console.log(error);
    }
})();