import {Router} from 'express';
import multer from 'multer';
import moviesController from '../controllers/movies.js';

const userRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

userRouter.post('/movies/add', upload.single('file'), moviesController.createNewMovie);

userRouter.post('/movies/update/:movieId', upload.single('file'), moviesController.updateMovie);

userRouter.get('/movies/yearSort/:type', moviesController.getMovies);

userRouter.get('/movies/keywordName', moviesController.getMoviesOfName);

userRouter.get('/movies/all', moviesController.getAllMovies);

userRouter.post('/movies/delete/:movieId', moviesController.deleteMovie);


export default userRouter;