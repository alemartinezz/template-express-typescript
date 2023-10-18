import joi from 'joi';

export const validatePatientData = (payload: any) => {
	const documentSchema = joi.object({
		name: joi.string().min(3).max(50).required().messages({
			'string.empty': 'Name cannot be an empty string',
			'any.required': 'Name is required',
			'string.base': 'Name must be a string',
			'string.min': 'Name must be at least 3 characters long',
			'string.max': 'Name must be at most 50 characters long'
		}),
		email: joi.string().email().required().messages({
			'string.empty': 'Email cannot be an empty string',
			'any.required': 'Email is required',
			'string.base': 'Email must be a string',
			'string.email': 'Email must be a valid email address'
		}),
		address: joi.string().min(3).max(50).messages({
			'string.empty': 'Address cannot be an empty string',
			'string.base': 'Address must be a string',
			'string.min': 'Address must be at least 3 characters long',
			'string.max': 'Address must be at most 50 characters long'
		}),
		phoneNumber: joi
			.string()
			.pattern(/^\+\d+$/)
			.messages({
				'string.empty': 'Phone Number cannot be an empty string',
				'any.required': 'Phone Number is required',
				'string.base': 'Phone Number must be a string',
				'string.pattern.base': 'Phone Number must start with + and be followed only by numbers'
			}),
		documentPhoto: joi.binary().messages({
			'binary.base': 'Document Photo must be in binary format'
		})
	});
	return documentSchema.validate(payload, {
		abortEarly: false,
		allowUnknown: true
	});
};
