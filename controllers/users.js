import UsersModel from '../model/users.js';
import {checkNullOrUndefined, verifyFields} from '../checkInput.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../data.env' });

const usersController = {
    createNewUser: async (req, res) => {
        try {
            const { userName, email, password, birthdate } = req.body;
            
            const Fields = Object.keys(req.body);
            const ModelFields = Object.keys(UsersModel.schema.paths);
    
            if (checkNullOrUndefined(req.body) || !verifyFields(Fields, ModelFields))
                throw new Error('Du lieu dau vao co loi');
            
            const existEmail= await UsersModel.findOne({email});
            if(existEmail)
                throw new Error('Email da ton tai');
    
            const createdUser = await UsersModel.create({
                userName,
                email,
                password,
                birthdate
            });
            res.status(201).send({ data: createdUser});
    
        } catch (error) {
            res.status(403).send({ message: error.message});
        }
    },
    deleteUser: async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId) 
                return res.status(400).send({ message: "Thiếu thông tin userId" });
    
            const result = await UsersModel.deleteOne({ _id: userId });
    
            if (result.deletedCount === 1)
                return res.status(200).send({ message: "Xóa dữ liệu user thành công" });
            else 
                return res.status(404).send({ message: "Không tìm thấy user để xóa" });

        } catch (error) {
            res.status(500).send({ message: "Đã có lỗi xảy ra khi xóa người dùng" });
        }
    }
}
export default usersController;