import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users.js';
import authMiddleware from './middlewares/auth.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

async function connectDatabase() {
    try {
        await mongoose.connect('mongodb+srv://vtk:vtk@naksu.8wtkqy5.mongodb.net/hoan?retryWrites=true&w=majority&appName=naksu');
        console.log('Connect toi DB thanh cong');
    } catch (error) {
        console.log("Error: ", error);
    }
}
connectDatabase(); 
app.use('/verifyToken', authMiddleware.verifyToken);

app.use('/register', authMiddleware.RegisterUser);

app.use('/login', authMiddleware.loginUser);

app.use('/users', authMiddleware.authenticate, userRouter);

app.use((req, res, next) => {
    res.status(404).send("Đường dẫn của url không đúng");
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000');
});
