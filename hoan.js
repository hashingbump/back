import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users.js';
import adminRouter from './routes/admins.js';
import authMiddleware from './middlewares/auth.js';
import refreshTokenRouter from './routes/refreshTokens.js';
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

app.use('/refreshToken', refreshTokenRouter);

app.use('/users/login', authMiddleware.loginUser);

app.use('/admins/login', authMiddleware.loginAdmin);

app.use('/users', authMiddleware.authenticateUser, userRouter);

app.use('/admins', authMiddleware.authenticateAdmin, adminRouter);

app.listen(process.env.PORT || 27017, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});
