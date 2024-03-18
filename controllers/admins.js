import AdminsModel from "../model/admins.js";
import { checkNullOrUndefined, verifyFields } from "../checkInput.js";

const adminsController = {
    createNewAdmin: async (req, res) => {
        try {
            const { email, password } = req.body;

            const Fields = Object.keys(req.body);
            const ModelFields = Object.keys(AdminsModel.schema.paths);
    
            if (checkNullOrUndefined(req.body) || !verifyFields(Fields, ModelFields))
                throw new Error('Du lieu dau vao co loi');
            
            const existAcount= await AdminsModel.findOne({email});
            if(existAcount)
                throw new Error('Email da ton tai');
    
            const createdAdmin = await AdminsModel.create({
                email,
                password
            });
            res.status(201).send({ data: createdAdmin});
    
        } catch (error) {
            res.status(403).send({ message: error.message});
        }
    }
}
export default adminsController;