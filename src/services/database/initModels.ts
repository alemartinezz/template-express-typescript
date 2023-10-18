import { Sequelize } from 'sequelize';
import { initpatientModel } from '../../models/patient';

export const initModels = (sequelize: Sequelize) => {
	initpatientModel(sequelize);
};
