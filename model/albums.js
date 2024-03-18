import mongoose from 'mongoose';
import collections from '../database/collection.js';

const albumsSchema = new mongoose.Schema({
    url: String,
    type: { type: String, enum: ['image', 'video'] }
});

const AlbumsModel = mongoose.model(collections.ALBUMS, albumsSchema);
export default AlbumsModel;
