import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function mongo() {
    try {
        await client.connect();
        const connection = client.db('mywallet');
        return connection;

    } catch (error) {
        console.error(error)
        return error;    
    }
}