import mongoose from 'mongoose';
import collections from '../database/collection.js';

const movieSchema = new mongoose.Schema({
    name: String,
    time: String,
    year: String,
    image:{
        type: String
    },
    introduce: String
});

const MoviesModel = mongoose.model(collections.MOVIES, movieSchema);
export default MoviesModel;