import { Sequelize } from 'sequelize';
import { initPatientModel } from '../../models/patient';
import { initUserModel } from '../../models/user';

export const initModels = (sequelize: Sequelize) => {
	initUserModel(sequelize);
	initPatientModel(sequelize);
};
