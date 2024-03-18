import {Router} from 'express';
import authMiddleware from '../middlewares/auth.js';

const refreshTokensRouter = Router();

refreshTokensRouter.get('/', authMiddleware.RefreshToken);

export default refreshTokensRouter;
