import mongoose from 'mongoose';
import collections from '../database/collection.js';

const commentSchema = new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'posts'
    },
    content: String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    album:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'ablums'
    }]
});

const CommentsModel = mongoose.model(collections.COMMENTS, commentSchema);
export default CommentsModel;