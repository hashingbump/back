import mongoose from 'mongoose';
import collections from '../database/collection.js';

const postSchema = new mongoose.Schema({
    content: String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    album:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'albums'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PostsModel = mongoose.model(collections.POSTS, postSchema);
export default PostsModel;