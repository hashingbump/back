import PostsModel from '../model/posts.js';
import CommentsModel from '../model/comments.js';
import UsersModel from '../model/users.js';
import AlbumsModel from '../model/albums.js';
import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: 'dsahpruxx',
    api_key: '652186324369761',
    api_secret: 'GwjubyXq017h99uVYnb9tk14YKo'
});

const postsController = {
    createNewPost: async (req, res) => {
        try {
            const { authorId, content } = req.body;
            const listFile = req.files;
            let albumUrls = [];

            if (!authorId || !content || !listFile)
                throw new Error("Du lieu dau vao co loi.");

            const author = await UsersModel.findById(authorId);
            if (!author)
                throw new Error("Author not found.");

            for(const file of listFile){
                const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const fileName = file.originalname.split('.')[0];
        
                const result = await cloudinary.uploader.upload(dataUrl, {
                    public_id: fileName,
                    resource_type: 'auto',
                });

                const album = new AlbumsModel({
                    url: result.secure_url,
                    type: result.resource_type
                });
                await album.save();

                albumUrls.push(album._id);
            }

            const post = new PostsModel({
                content: content,
                author: author._id, 
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
            const { authorId, content } = req.body;
    
            if (!authorId || !content)
                throw new Error("Du lieu dau vao co loi.");
    
            const existPost = await PostsModel.findById(postId);
            if (!existPost)
                throw new Error('Post is not found');

            if (existPost.author._id.toString() !== authorId)
                throw new Error('Ban khong co quyen chinh sua');
    
            existPost.content = content;
            await existPost.save();
    
            res.status(200).send({ data: existPost });
    
        } catch (error) {
            res.status(403).send({ message: error.message });
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