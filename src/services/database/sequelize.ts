// dbService.ts
import { Dialect, Sequelize } from 'sequelize';
import { initUserModel } from '../../models/user';

export class Database {
	public sequelize: Sequelize;

	constructor() {
		const sequelizeConfig = {
			host: process.env.DB_HOST,
			port: parseInt(`${process.env.DB_PORT}`),
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DB,
			dialect: 'postgres' as Dialect,
			dialectOptions: {
				useUTC: false,
				dateStrings: true,
				typeCast: true
			}
		};

		this.sequelize = new Sequelize(sequelizeConfig);
	}

	async init() {
		try {
			await this.sequelize.authenticate();
			this.initModels(this.sequelize);
			await this.sequelize.sync({ force: true });
		} catch (err) {
			throw err;
		}
	}

	async initModels(sequelize: Sequelize) {
		initUserModel(sequelize);
	}
}
