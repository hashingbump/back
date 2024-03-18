import {Router} from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import postsController from '../controllers/posts.js';
import commentsController from '../controllers/comments.js';

const userRouter = Router();

cloudinary.config({
    cloud_name: 'dsahpruxx',
    api_key: '652186324369761',
    api_secret: 'GwjubyXq017h99uVYnb9tk14YKo'
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
userRouter.post('/posts/add', upload.array('files'), postsController.createNewPost);

// Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
userRouter.patch('/posts/update/:postId', postsController.updatePost);

// Viết API cho phép user được comment vào bài post
userRouter.post('/comments/add', upload.array('files'), commentsController.createNewComment);

// Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa)
userRouter.patch('/comments/update/:commentId', commentsController.updateComment);

export default userRouter;