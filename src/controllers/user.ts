import { NextFunction, Request, Response } from 'express';
import { services } from '../api';
import { HttpResponse, customError, validationError } from '../middlewares/responseHandler';
import { validateUser } from '../validations/user';
import { User } from '../models/user';

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

		const firebaseUser = await services.firebase.register({ email: req.body.email.trim(), password: req.body.password.trim() });

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

export const returnUser = async (req: Request, res: Response, next: NextFunction) => {
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
