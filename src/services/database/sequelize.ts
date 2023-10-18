// dbService.ts
import { Dialect, Sequelize } from 'sequelize';
import { initModels } from './initModels';
import { loadSampleData } from './sampleData';

export class Database {
	public sequelize: Sequelize;

	constructor() {
		const sequelizeConfig = {
			host: process.env.DB_HOST,
			port: parseInt(`${process.env.DB_PORT}`),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
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
			initModels(this.sequelize);
			await this.sequelize.sync({ force: true });
			await loadSampleData();
		} catch (err) {
			console.error('Unable to connect to the database:', err);
			throw err;
		}
	}
}
