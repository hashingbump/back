import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users.js';
import dotenv from 'dotenv';

dotenv.config({ path: 'data.env' });

const app = express();
app.use(express.json());

let database;

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connect toi DB thanh cong');
        database = mongoose.connection.useDb(process.env.dbName);
    } catch (error) {
        console.log("Error: ", error);
    }
}

connectDatabase(); 

app.use('/users', userRouter);

app.use((req, res, next) => {
    res.status(404).send("Page not found");
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});
