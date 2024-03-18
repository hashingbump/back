import UsersModel from '../model/users.js';
import PostsModel from '../model/posts.js';
import CommentsModel from '../model/comments.js';

const commentsController = {
    createNewComment: async (req, res) => {
        try {
            const { postId, content, authorId } = req.body;

            if (!postId || !content || !authorId) 
                throw new Error("Du lieu dau vao co loi.");
    
            const author = await UsersModel.findById(authorId);
            if (!author)
                throw new Error("Author not found.");

            const post = await PostsModel.findById(postId);
            if (!post)
                throw new Error("Post not found.");

            let albumUrls = post.album;

            const createdComment = await CommentsModel.create({
                post: post._id,
                content: content,
                author: author._id,
                album: albumUrls
            });
            res.status(201).send({ data: createdComment});
    
        } catch (error) {
            res.status(403).send({ message: error.message});
        }
    },
    updateComment: async (req, res) => {
        try {
            const { commentId } = req.params;
            const { content, authorId } = req.body;
    
            if (!content || !authorId) 
                throw new Error("Du lieu dau vao co loi.");
    
            const existComment = await CommentsModel.findById(commentId);
            if (!existComment) 
                throw new Error('Comment is not found');
    
            if (existComment.author._id.toString() !== authorId) 
                throw new Error('Ban khong co quyen chinh sua');
    
            existComment.content = content;
            await existComment.save();
    
            res.status(200).send({ data: existComment });
    
        } catch (error) {
            res.status(403).send({ message: error.message });
        }
    },
    getComments_Post: async (req, res) => {
        try {
            const {postId} = req.body;
    
            if (!postId) 
                throw new Error("Du lieu dau vao co loi.");
    
            const commentsPost = await CommentsModel.find({post: postId});
    
            res.status(200).send({data: commentsPost});
            
        } catch (error) {
            res.status(500).send({message: 'Internal server error'});
        }
    }
}
export default commentsController;