import {Router} from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import usersController from '../controllers/users.js';
import postsController from '../controllers/posts.js';
import commentsController from '../controllers/comments.js';
import adminsController from '../controllers/admins.js';

const adminRouter = Router();

cloudinary.config({
    cloud_name: 'dsahpruxx',
    api_key: '652186324369761',
    api_secret: 'GwjubyXq017h99uVYnb9tk14YKo'
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Viết API đăng ký user với userName, email là một string ngẫu nhiên, không được phép trùng, id sẽ sử dụng _id mặc định của MongoDB.
adminRouter.post('/users/add', usersController.createNewUser);

// Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
adminRouter.post('/posts/add', upload.array('files'), postsController.createNewPost);

// Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
adminRouter.patch('/posts/update/:postId', postsController.updatePost);

// Viết API cho phép user được comment vào bài post
adminRouter.post('/comments/add', upload.array('files'), commentsController.createNewComment);

// Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa)
adminRouter.patch('/comments/update/:commentId', commentsController.updateComment);

// Viết API lấy tất cả comment của một bài post.
adminRouter.get('/comments/post', commentsController.getComments_Post);

// Viết API lấy tất cả các bài post, 3 comment đầu (dựa theo index) của mỗi bài post đó.
adminRouter.get('/posts/3comments', postsController.getposts_3comments);

// Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId
adminRouter.get('/comments/:postId', postsController.getposts_comments) 

// Phân trang.
adminRouter.get('/posts/pagination', postsController.getPagination);

// Sắp sếp các bài post theo thời gian tạo.
adminRouter.get('/posts/sortPagination', postsController.getSortPagination);

// Tao admin
adminRouter.post('/add', adminsController.createNewAdmin);

// Xoa du lieu cua 1 user
adminRouter.delete('/users/deletes/:userId', usersController.deleteUser);

// Xóa toàn bộ bài posts
adminRouter.delete('/posts/deletes/all', postsController.deleteAllPosts);

export default adminRouter;