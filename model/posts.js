import mongoose from 'mongoose';
import collections from '../database/collection.js';

const postSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    avatar: String,
    title: String,
    album:[{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PostsModel = mongoose.model(collections.POSTS, postSchema);
export default PostsModel;