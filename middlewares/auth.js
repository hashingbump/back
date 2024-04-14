import UsersModel from "../model/users.js";
import refreshTokensModel from '../model/refreshTokens.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authMiddleware = {
    loginUser: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await UsersModel.findOne({ email });

            if (!user) throw new Error('Tài khoản không tồn tại');

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) throw new Error('Mật khẩu không đúng');

            const accessToken = jwt.sign({ userId: user._id }, 'hoan', { expiresIn: '30m' });
            const refreshToken = jwt.sign({ userId: user._id }, 'hoanrefresh', { expiresIn: '12h' });

            await refreshTokensModel.create({ refreshToken });

            res.json({token: accessToken, refreshToken: refreshToken});

        } catch (error) {
            res.status(401).send(error.message);
        }
    },
    authenticate: (req, res) => {    
        try{
            const token = req.headers['authorization'].split(' ')[1];

            if (!token) res.json({ data: 'Token missing' });
        
            jwt.verify(token, 'hoan', (err, decoded) => {
                if (err) {
                    res.json({ data: 'Token invalid' });
                } else {
                    res.json({ data: 'Token valid' });
                }
            });
        } catch (error) {
            res.status(401).send(error.message);
        }
    },
    RefreshToken: async (req, res) => {
        try{
            const userId = req.userId;

            const refreshToken = req.headers['authorization'].split(' ')[1];

            if (!refreshToken) res.json({ message: 'Token missing' });

            const RFToken = await refreshTokensModel.findOne({refreshToken});

            if (!RFToken) res.json({ message: 'Token is not found' });

            jwt.verify(refreshToken, 'hoanrefresh', async (err, data) => {
                if (err) {
                    await refreshTokensModel.deleteOne({ refreshToken });
                    res.send("refreshToken da het han");
                } else {
                    const accessToken = jwt.sign({ userId: userId }, 'hoan', { expiresIn: '30m' });
                    res.json({token: accessToken });
                }
            });
        }catch(error){
            res.status(401).send(error.message);
        }
    },
    deleteRefreshToken: async (req, res) => {
        try{
            const refreshToken = req.headers['authorization'].split(' ')[1];

            if (!refreshToken) res.json({ message: 'Token missing' });

            await refreshTokensModel.deleteOne({ refreshToken });

            res.send('Xoa thanh cong');
        }catch(error){
            res.status(401).send(error.message);
        }
    }
}    

export default authMiddleware;
