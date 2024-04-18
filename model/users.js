import mongoose from 'mongoose';
import collections from '../database/collection.js';

const userSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String
});

const UsersModel = mongoose.model(collections.USERS, userSchema);
export default UsersModel;