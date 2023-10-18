import { NextFunction, Request, RequestHandler, Response } from 'express';
import { HttpResponse, customError, validationError } from '../middlewares/responseHandler';
import { Patient } from '../models/patient';
import { validatePatientData } from '../validations/patient';

export const loadpatient: RequestHandler = async (req, res, next) => {
	try {
		if (!req.params.id) {
			throw customError(HttpResponse.BadRequest, 'Missing patient id.');
		}

		const patient = await Patient.findByPk(req.params.id);

		if (!patient) {
			throw customError(HttpResponse.NotFound, 'Patient not found.');
		}

		res.locals.responseCode = 200;
		res.locals.patient = patient;

		next();
	} catch (error) {
		next(error);
	}
};

export const createpatient: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { error } = validatePatientData({ ...req.body });

		if (error) {
			throw validationError(error);
		}

		const patient = await Patient.create({
			...req.body
		});

		if (!patient) {
			throw customError(HttpResponse.UnprocessableEntity, 'Failed to create patient. Please try again later.');
		}

		res.locals.patient = patient;
		res.locals.responseCode = 201;

		next();
	} catch (error) {
		next(error);
	}
};

export const updatePatient: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const currentPatient = res.locals.patient as Patient;

		const { error } = validatePatientData(req.body);

		if (error) {
			throw validationError(error);
		}

		Object.assign(currentPatient, req.body);

		const updatedPatient = await currentPatient.save();

		if (!updatedPatient) {
			throw customError(HttpResponse.UnprocessableEntity, 'Could not update patient. Please try again later.');
		}

		res.locals.patient = updatedPatient.dataValues;
		res.locals.responseCode = 200;

		next();
	} catch (error) {
		next(error);
	}
};

export const getAllPatients: RequestHandler = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const patients: Patient[] = await Patient.findAll();

		if (!patients) {
			throw customError(HttpResponse.NotFound, 'No patients found.');
		}

		res.locals.patients = patients;
		res.locals.responseCode = 200;

		next();
	} catch (error) {
		next(error);
	}
};

export const returnPatient: RequestHandler = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const bodyResponse = {
			patient: { ...res.locals.patient.dataValues }
		};

		res.status(res.locals.responseCode).json(bodyResponse);
	} catch (error) {
		next(error);
	}
};

export const returnPatients: RequestHandler = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const bodyResponse = {
			patients: res.locals.patients.map((item: any) => {
				return {
					...item.dataValues
				};
			})
		};

		res.status(res.locals.responseCode).json(bodyResponse);
	} catch (error) {
		next(error);
	}
};
