import { HttpResponse, customError } from '../../middlewares/responseHandler';
import { Patient } from '../../models/patient';

export const loadSampleData = async () => {
	try {
		const patients = await Patient.findAll();

		if (patients.length === 0) {
			for (let i = 0; i < samplePatients.length; i++) {
				const createdPatient = await Patient.create({ ...samplePatients[i] });
				if (!createdPatient) {
					throw customError(HttpResponse.InternalServerError, 'Error creating sample patients');
				}
			}
		}
	} catch (error) {
		throw error;
	}
};

const samplePatients: any = [
	{
		name: 'John Doe',
		email: 'johndoe@gmail.com',
		address: '123 Main St, New York, NY 10001',
		phoneNumber: '+11234567890',
		documentPhoto: ''
	},
	{
		name: 'Jane Smith',
		email: 'janesmith@gmail.com',
		address: '234 Main St, New York, NY 10001',
		phoneNumber: '+12345678901',
		documentPhoto: ''
	},
	{
		name: 'Robert Brown',
		email: 'robertbrown@gmail.com',
		address: '345 Main St, New York, NY 10001',
		phoneNumber: '+13456789012',
		documentPhoto: ''
	},
	{
		name: 'Emily Davis',
		email: 'emilydavis@gmail.com',
		address: '456 Main St, New York, NY 10001',
		phoneNumber: '+14567890123',
		documentPhoto: ''
	},
	{
		name: 'William Taylor',
		email: 'williamtaylor@gmail.com',
		address: '567 Main St, New York, NY 10001',
		phoneNumber: '+15678901234',
		documentPhoto: ''
	}
];
