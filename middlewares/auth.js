import UsersModel from "../model/users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authMiddleware = {
    RegisterUser: async (req, res) => {
        try {
            const { userName, email, password } = req.body;
    
            if(!userName || !email || !password)
                throw new Error('Du lieu dau vao co loi');
            
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
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            if(!email || !password)
                throw new Error('Du lieu dau vao co loi');

            const user = await UsersModel.findOne({ email });

            if (!user) throw new Error('Tài khoản không tồn tại');

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) throw new Error('Mật khẩu không đúng');

            const accessToken = jwt.sign({ userId: user._id }, 'hoan', { expiresIn: '24h' });

            res.json({token: accessToken});
        } catch (error) {
            res.status(401).send(error.message);
        }
    },
    authenticate: (req, res, next) => {    
        try{
            const au = req.headers['authorization'];
            if(!au) return res.json({ data: 'Token missing' });

            const token = au.split(' ')[1];
            if (!token) return res.json({ data: 'Token missing' });

            jwt.verify(token, 'hoan', (err, decoded) => {
                if (err) {
                    return res.json({ data: 'Token invalid' });
                } else {
                    next();
                }
            });
        } catch (error) {
            res.json({ data: 'Token missing' });
        }
    },
    verifyToken: (req, res) => {    
        try{
            const au = req.headers['authorization'];
            if(!au) return res.json({ data: 'Token missing' });

            const token = au.split(' ')[1];
            if (!token) return res.json({ data: 'Token missing' });

            jwt.verify(token, 'hoan', (err, decoded) => {
                if (err) {
                    return res.json({ data: 'Token invalid' });
                } else {
                    return res.json({ data: 'Token valid' });
                }
            });
        } catch (error) {
            res.json({ data: 'Token missing' });
        }
    }
}    

export default authMiddleware;
