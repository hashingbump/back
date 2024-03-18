import mongoose from 'mongoose';
import collections from '../database/collection.js';

const adminSchema = new mongoose.Schema({
    email: String,
    password: String
});

const AdminsModel = mongoose.model(collections.ADMINS, adminSchema);
export default AdminsModel;