import { Router } from 'express';
import { loadUser, login, register, returnUser, returnUsers, updateUser } from '../controllers/user';

const usersRouter = Router();

usersRouter.param('id', loadUser);
usersRouter.patch('/:id', updateUser, returnUser);
usersRouter.delete('/:id', returnUser);
usersRouter.get('/:id', returnUser);
usersRouter.get('/', returnUsers);
usersRouter.post('/register', register, returnUser);
usersRouter.post('/login', login, returnUser);

export default usersRouter;
