import joi from 'joi';

export const validateUser = (payload: any) => {
	const userSchema = joi.object({
		email: joi
			.string()
			.email({ tlds: { allow: false } })
			.required()
			.messages({
				'string.empty': 'Email cannot be an empty string',
				'any.required': 'Email is required',
				'string.base': 'Email must be a string',
				'string.email': 'Invalid email address'
			}),
		password: joi.string().min(8).required().messages({
			'string.empty': 'Password cannot be an empty string',
			'any.required': 'Password is required',
			'string.base': 'Password must be a string',
			'string.min': 'Password must be at least 8 characters long'
		})
	});
	return userSchema.validate(payload, {
		abortEarly: false,
		allowUnknown: true
	});
};
