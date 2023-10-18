import { Router } from 'express';
import { login, register, returnUser } from '../controllers/user';

const usersRouter = Router();

usersRouter.post('/register', register, returnUser);
usersRouter.post('/login', login, returnUser);

export default usersRouter;
