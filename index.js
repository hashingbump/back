import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users.js';

const app = express();
app.use(express.json());

let database;

async function connectDatabase() {
    try {
        await mongoose.connect('mongodb+srv://vtk:vtk@naksu.8wtkqy5.mongodb.net/?retryWrites=true&w=majority&appName=naksu');
        console.log('Connect toi DB thanh cong');
        database = mongoose.connection.useDb('test');
    } catch (error) {
        console.log("Error: ", error);
    }
}

connectDatabase(); 

app.use('/users', userRouter);

app.use((req, res, next) => {
    res.status(404).send("Page not found");
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000');
});
