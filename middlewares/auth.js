import UsersModel from "../model/users.js";
import AdminsModel from "../model/admins.js";
import refreshTokensModel from "../model/refreshTokens.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../data.env' });

const authMiddleware = {
    loginUser: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await UsersModel.findOne({ email });
            if (!user) throw new Error('Tai khoan khong ton tai');

            if (user.password !== password) throw new Error('Mat khau sai');
            
            const accessToken = AccessToken({ email: user.email });
            const refreshToken = RefreshToken({ email: user.email });

            const createdRFToken = await refreshTokensModel.create({
                refreshToken
            });

            res.json({ accessToken, refreshToken });

        } catch (error) {
            res.status(401).send(error.message);
        }
    },
    loginAdmin: async (req, res, next) => {
         try {
            const { emai, password } = req.body;

            const admin = await AdminsModel.findOne({ email });
            if (!admin) throw new Error('Tai khoan khong ton tai');

            if (admin.password !== password) throw new Error('Mat khau sai');
            
            const accessToken = AccessToken({ email: admin.email });
            const refreshToken = RefreshToken({ email: admin.email });
            
            const createdRFToken = await refreshTokensModel.create({
                refreshToken
            });

            res.json({ accessToken, refreshToken });

        } catch (error) {
            res.status(401).send(error.message);
        }
    },
    authenticateUser: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ message: 'authorization is not found' });

        const token = authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'Token missing' });

        let isVerified = false;

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (!err) isVerified = true;
        });

        if(!isVerified){
            jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
                if (!err) isVerified = true;
            });
        }

        if(isVerified) next();
        else
            return res.status(401).json({ message: 'Token invalid' });
    },
    authenticateAdmin: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ message: 'authorization is not found' });

        const token = authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'Token missing' });

        let isVerified = false;

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (!err) isVerified = true;
        });

        if(!isVerified){
            jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
                if (!err) isVerified = true;
            });
        }
        
        if(isVerified) next();
        else
            return res.status(401).json({ message: 'Token invalid' });
    },
    RefreshToken: async (req, res) => {
        try{
            const authHeader = req.headers['authorization'];
            if(!authHeader) return res.status(401).json({ message: 'authorization is not found' });

            const refreshToken = authHeader.split(' ')[1];

            if (!refreshToken) return res.status(401).json({ message: 'Token missing' });

            const RFToken = await refreshTokensModel.findOne({refreshToken});

            if (!RFToken) return res.status(401).json({ message: 'Token is not found' });

            jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, data) => {
                if (err) {
                    await refreshTokensModel.deleteOne({ refreshToken });
                    return res.status(401).send("refreshToken da het han");
                } else {
                    const accessToken = AccessToken({});
                    return res.json({ accessToken });
                }
            });
        }catch(error){
            res.status(401).send(error.message);
        }
    }
};

function AccessToken(payload) {
    return jwt.sign(payload, process.env.SECRET, { expiresIn: '15m' });
}

function RefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '1d' });
}

export default authMiddleware;
