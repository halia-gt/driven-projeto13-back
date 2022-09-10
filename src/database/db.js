import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

try {
    await client.connect();
} catch (error) {
    console.error(error)
}

const database = client.db('mywallet');

export default database;