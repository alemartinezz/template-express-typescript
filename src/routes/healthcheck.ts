import { Router } from 'express';
import { healthcheck } from '../controllers/healthcheck';

const healthcheckRouter = Router();

healthcheckRouter.get('/', healthcheck);

export default healthcheckRouter;
