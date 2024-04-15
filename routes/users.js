import {Router} from 'express';
import multer from 'multer';
import usersController from '../controllers/users.js';
import postsController from '../controllers/posts.js';
import commentsController from '../controllers/comments.js';
import authMiddleware from '../middlewares/auth.js';

const userRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

userRouter.post('/add', usersController.createNewUser);

userRouter.post('/update', upload.single('file'), usersController.updateUser);

userRouter.post('/delete', usersController.deleteUser);

userRouter.get('/id', usersController.getUserId);

//userRouter.get('/deleteAll', usersController.deleteAllUser);

userRouter.post('/posts/add', upload.array('files'), postsController.createNewPost);

userRouter.post('/posts/:postId', upload.array('files'), postsController.updatePost);

userRouter.get('/posts', postsController.getAllPosts);

userRouter.get('/posts/personal', postsController.getPersonalPosts);

userRouter.post('/posts/delete/:postId', postsController.deletePost);

//userRouter.get('/posts/deleteAll', postsController.deleteAllPosts);

userRouter.get('/verifyToken', authMiddleware.authenticate);

userRouter.post('/refreshToken', authMiddleware.RefreshToken);

userRouter.post('/refreshToken/delete', authMiddleware.deleteRefreshToken);

userRouter.post('/login', authMiddleware.loginUser);

export default userRouter;