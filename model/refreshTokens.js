import mongoose from 'mongoose';
import collections from '../database/collection.js';

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: String
});

const refreshTokensModel = mongoose.model(collections.REFRESHTOKENS, refreshTokenSchema);
export default refreshTokensModel;