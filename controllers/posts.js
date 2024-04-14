import PostsModel from '../model/posts.js';
import CommentsModel from '../model/comments.js';
import UsersModel from '../model/users.js';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';

cloudinary.config({
    cloud_name: 'dsahpruxx',
    api_key: '652186324369761',
    api_secret: 'GwjubyXq017h99uVYnb9tk14YKo'
});

const postsController = {
    createNewPost: async (req, res) => {
        try {
            const { title } = req.body;
            const listFile = req.files;
            const token = req.headers.authorization.split(' ')[1];

            const decodedToken = jwt.verify(token, 'hoan');
            const user = await UsersModel.findById(decodedToken.userId);

            let albumUrls = [];

            if (!user || !title || !listFile)
                throw new Error("Du lieu dau vao co loi.");

            for(const file of listFile){
                const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const fileName = file.originalname.split('.')[0];
        
                const result = await cloudinary.uploader.upload(dataUrl, {
                    public_id: fileName,
                    resource_type: 'auto',
                });

                albumUrls.push(result.secure_url);
            }
            const post = new PostsModel({
                userId: user._id,
                userName: user.userName,
                avatar: user.avatar,
                title: title,
                album: albumUrls
            });
            const savedPost = await post.save();

            res.status(201).send({ data: savedPost });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    },
    updatePost: async(req, res) => {
        try {
            const { postId } = req.params;
            const { title } = req.body;
            const listFile = req.files;
            let albumUrls = [];

            const token = req.headers.authorization.split(' ')[1];

            const decodedToken = jwt.verify(token, 'hoan');
            const user = await UsersModel.findById(decodedToken.userId);

            if ( !user )
                throw new Error("Khong tim thay tac gia");
            
            if ( !title || !listFile || !postId )
                throw new Error("Du lieu dau vao co loi.");

            for(const file of listFile){
                const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const fileName = file.originalname.split('.')[0];
        
                const result = await cloudinary.uploader.upload(dataUrl, {
                    public_id: fileName,
                    resource_type: 'auto',
                });

                albumUrls.push(result.secure_url);
            }
    
            const existPost = await PostsModel.findById(postId);
            if (!existPost)
                throw new Error('Post is not found');

            existPost.userId = user._id;
            existPost.userName = user.userName;
            existPost.avatar = user.avatar;
            existPost.title = title;
            existPost.album = albumUrls;
            await existPost.save();
    
            res.status(200).send({ data: existPost });
    
        } catch (error) {
            res.status(403).send({ message: error.message });
        }
    },
    getAllPosts: async (req, res) => {
        try {
            let post = await PostsModel.find();
    
            if(!post)
                throw new Error('Lay post that bai');
    
            res.status(200).send({ data: post });
    
        } catch (error) {
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    getPersonalPosts: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];

            const decodedToken = jwt.verify(token, 'hoan');

            let post = await PostsModel.find({userId: decodedToken.userId});
    
            if(!post)
                throw new Error('Lay post that bai');
    
            res.status(200).send({ data: post });
    
        } catch (error) {
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    deletePost: async (req, res) => {
        try {
            const { postId } = req.params;
            const result = await PostsModel.deleteOne({ _id: postId });
            
            if (result.deletedCount === 1)
                res.status(200).send({ message: "Xóa bai Post thành công" });
            else 
                res.status(404).send({ message: "Không tìm thấy bai Post để xóa" });
        } catch (error) {
            res.status(500).send({ message: "Đã có lỗi xảy ra khi xóa bai Post" });
        }
    },
    deleteAllPosts: async (req, res) => {
        try {
            const result = await PostsModel.deleteMany();
    
            return res.status(200).send({ message: "Xóa tat ca dữ liệu user thành công" });
        } catch (error) {
            res.status(500).send({ message: "Đã có lỗi xảy ra khi xóa người dùng" });
        }
    },
    getposts_3comments: async (req, res) => {
        try {
            let allPosts = await PostsModel.find().lean(); // đổi thành JavaScript object
    
            if (!allPosts)
                throw new Error('Không tìm thấy bài viết');
    
            for (let post of allPosts) {
                const comments = await CommentsModel.find({ post: post._id }).limit(3).lean();

                post.comments = comments.map(comment => comment.content);
            }
            res.status(200).send({ data: allPosts });
    
        } catch (error) {
            res.status(500).send({ message: 'Lỗi server nội bộ: ' + error.message });
        }
    },
    getposts_comments: async (req, res) => {
        try {
            const {postId} = req.params;
    
            let post = await PostsModel.findById(postId);
            let allComments = await CommentsModel.find({post: postId});
    
            if(!post)
                throw new Error('Lay post that bai');
        
            if(!allComments)
                throw new Error('Lay comments that bai');
    
            post = post.toObject();
    
            post.comments = allComments.map(comment => comment.content);
    
            res.status(200).send({ data: post });
    
        } catch (error) {
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    getPagination: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const skip = (page - 1) * pageSize; 

            const posts = await PostsModel.find()
                .skip(skip)
                .limit(pageSize)
                .populate('author')
                .populate('album');

            const totalPosts = await PostsModel.countDocuments();

            const totalPages = Math.ceil(totalPosts / pageSize);

            res.status(200).send({
                data: posts,
                currentPage: page,
                totalPages: totalPages
            });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    },
    getSortPagination: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const skip = (page - 1) * pageSize; 

            const posts = await PostsModel.find()
                .skip(skip)
                .limit(pageSize)
                .sort({ createdAt: 1 }) 
                .populate('author')
                .populate('album');

            const totalPosts = await PostsModel.countDocuments();

            const totalPages = Math.ceil(totalPosts / pageSize);

            res.status(200).send({
                data: posts,
                currentPage: page,
                totalPages: totalPages
            });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    },
    deleteAllPosts: async (req, res) => {
        try {
            await PostsModel.deleteMany({});
            res.status(200).send({ message: "Xóa tất cả bài post thành công." });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    }
}
export default postsController;