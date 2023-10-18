import { Router } from 'express';
import { createpatient, getAllPatients, loadpatient, returnPatient, returnPatients, updatePatient } from '../controllers/patient';
import { sendEmail } from '../services/email/sendMail';

const patientsRouter = Router();

patientsRouter.param('id', loadpatient);
patientsRouter.get('/:id', returnPatient);
patientsRouter.get('/', getAllPatients, returnPatients);
patientsRouter.post('/', createpatient, sendEmail, returnPatient);
patientsRouter.patch('/:id', updatePatient, returnPatient);

export default patientsRouter;
