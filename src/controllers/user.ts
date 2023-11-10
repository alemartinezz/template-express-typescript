import { NextFunction, Request, Response } from 'express';
import { services } from '../api';
import { HttpResponse, customError, validationError } from '../middlewares/responseHandler';
import { validateUser } from '../validations/user';
import { User } from '../models/user';

export const loadUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.params.id) {
			throw customError(HttpResponse.BadRequest, 'User id is required.');
		}

		const user = await User.findByPk(req.params.id);

		if (!user) {
			throw customError(HttpResponse.NotFound, 'User not found.');
		}

		res.locals.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { error } = validateUser({ ...req.body });

		if (error) {
			throw validationError(error);
		}

		const findUser = await User.findOne({
			where: {
				email: req.body.email.trim()
			}
		});

		if (findUser) {
			next(login(req, res, next));
		}

		const firebaseUser = await services.firebase.register(req.body.email.trim(), req.body.password.trim());

		const user = await User.create({
			id: firebaseUser.uid,
			email: firebaseUser.email
		});

		if (!user) {
			throw customError(HttpResponse.InternalServerError, 'Failed to create user.');
		}

		res.locals.user = user;
		res.locals.responseCode = 201;
	} catch (error) {
		next(error);
	}
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { error } = validateUser({ ...req.body });

		if (error) {
			throw validationError(error);
		}

		const firebaseUser = await services.firebase.login({ email: req.body.email.trim(), password: req.body.password.trim() });

		const user = await User.findByPk(firebaseUser.uid);

		if (!user) {
			throw customError(HttpResponse.InternalServerError, 'User not found.');
		}

		res.locals.user = user;
		res.locals.responseCode = 200;
	} catch (error) {
		next(error);
	}
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findByPk(req.params.id);

		if (!user) {
			throw customError(HttpResponse.NotFound, 'User not found.');
		}

		res.locals.user = user;
		res.locals.responseCode = 200;
	} catch (error) {
		next(error);
	}
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { error } = validateUser({ ...req.body });

		if (error) {
			throw validationError(error);
		}

		const user = await User.findByPk(req.params.id);

		if (!user) {
			throw customError(HttpResponse.NotFound, 'User not found.');
		}

		const updatedUser = await user.update({ email: req.body.email.trim() });

		if (!updatedUser) {
			throw customError(HttpResponse.InternalServerError, 'Failed to update user.');
		}

		res.locals.user = updatedUser;
		res.locals.responseCode = 200;
	} catch (error) {
		next(error);
	}
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findByPk(req.params.id);

		if (!user) {
			throw customError(HttpResponse.NotFound, 'User not found.');
		}

		// delete firebase user
		await services.firebase.deleteUser(user.id);

		await user.destroy();

		res.locals.responseCode = 204;
	} catch (error) {
		next(error);
	}
};

export const returnUser = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const responseBody = {
			user: {
				id: res.locals.user.id,
				email: res.locals.user.email
			}
		};
		res.status(res.locals.responseCode).json(responseBody);
	} catch (error) {
		next(error);
	}
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await User.findAll();

		if (!users) {
			throw customError(HttpResponse.NotFound, 'Users not found.');
		}

		res.locals.users = users;
		res.locals.responseCode = 200;
	} catch (error) {
		next(error);
	}
};

export const returnUsers = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const responseBody = {
			users: res.locals.users
		};
		res.status(res.locals.responseCode).json(responseBody);
	} catch (error) {
		next(error);
	}
};
