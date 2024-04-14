import UsersModel from '../model/users.js';
import {checkNullOrUndefined} from '../checkInput.js';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../data.env' });

cloudinary.config({
    cloud_name: 'dsahpruxx',
    api_key: '652186324369761',
    api_secret: 'GwjubyXq017h99uVYnb9tk14YKo'
});

const usersController = {
    createNewUser: async (req, res) => {
        try {
            const { userName, email, password } = req.body;
    
            if (checkNullOrUndefined(req.body))
                throw new Error('Dữ liệu đầu vào có lỗi');
            
            const existEmail = await UsersModel.findOne({ email });
            if (existEmail)
                throw new Error('Email đã tồn tại');
    
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
    
            const createdUser = await UsersModel.create({
                userName,
                email,
                password: hashedPassword
            });
    
            res.status(201).send({ data: createdUser });
        } catch (error) {
            res.status(403).send({ message: error.message });
        }
    },
    updateUser: async(req, res) => {
        try {
            const {userName, email, password} = req.body;
            const file = req.file;

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const token = req.headers.authorization.split(' ')[1];

            const decodedToken = jwt.verify(token, process.env.SECRET);
            const user = await UsersModel.findById(decodedToken.userId);

            const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const fileName = file.originalname.split('.')[0];
    
            const result = await cloudinary.uploader.upload(dataUrl, {
                public_id: fileName,
                resource_type: 'auto',
            });
    
            user.userName = userName;
            user.avatar = result.secure_url;
            user.email = email;
            user.password = hashedPassword;

            await user.save();
            res.status(201).send({ data: user });
        } catch (error) {
            res.status(403).send({ message: error.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];

            const decodedToken = jwt.verify(token, process.env.SECRET);
    
            const result = await UsersModel.deleteOne({ _id: decodedToken.userId });
            
            if (result.deletedCount === 1)
                res.status(200).send({ message: "Xóa dữ liệu user thành công" });
            else 
                res.status(404).send({ message: "Không tìm thấy user để xóa" });

        } catch (error) {
            res.status(500).send({ message: error });
        }
    },
    getUserId: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];

            const decodedToken = jwt.verify(token, process.env.SECRET);

            res.json({data: decodedToken.userId });
        } catch (error) {
            res.status(500).send({ message: error });
        }
    },
    deleteAllUser: async (req, res) => {
        try {
            const result = await UsersModel.deleteMany();
    
            return res.status(200).send({ message: "Xóa tat ca dữ liệu user thành công" });
        } catch (error) {
            res.status(500).send({ message: "Đã có lỗi xảy ra khi xóa người dùng" });
        }
    }
}
export default usersController;