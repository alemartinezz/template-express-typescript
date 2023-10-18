import express, { Application, RequestHandler, Router, ErrorRequestHandler } from 'express';
import cors from 'cors';
import healthcheckRouter from './routes/healthcheck';
import patientsRouter from './routes/patient';
import { responseHandler } from './middlewares/responseHandler';
import { Winston } from './services/logger';
import { toCamelCase } from './utils/utils';
import { Database } from './services/database/sequelize';

// Services
export const services: { [key: string]: any } = {
	logger: new Winston().logger
};

// Express api class
class Express {
	public express: Application;
	public host: string;
	public port: number;
	public apiPrefix: string;

	constructor(apiInit: { host: string; port: number; apiPrefix: string; coreMiddlewares: Array<RequestHandler>; routes: Array<[string, Router]>; middleWares: Array<RequestHandler | ErrorRequestHandler> }) {
		this.express = express();
		this.host = apiInit.host;
		this.port = apiInit.port;
		this.apiPrefix = apiInit.apiPrefix;
		this.coreMiddlewares(apiInit.coreMiddlewares);
		this.routes(apiInit.routes);
		this.middlewares(apiInit.middleWares);
	}

	private coreMiddlewares(middleWares: Array<RequestHandler>): void {
		middleWares.forEach((middleWare) => {
			this.express.use(middleWare);
		});
	}

	private routes(routers: Array<[string, Router]>): void {
		routers.forEach(([path, router]) => {
			this.express.use(`${this.apiPrefix}${path}`, router);
		});
	}

	private middlewares(middleWares: Array<RequestHandler | ErrorRequestHandler>): void {
		middleWares.forEach((middleWare) => {
			this.express.use(middleWare);
		});
	}

	public async initServices(allServices: any[]): Promise<void> {
		for (const service of allServices) {
			try {
				await service.init();

				services[toCamelCase(service.constructor.name)] = service;
				services.logger.info(`\x1b[1m\x1b[32m${service.constructor.name}\x1b[0m successfully started ✅`);
			} catch (e) {
				services.logger.error(`\x1b[1m\x1b[31m${service.constructor.name} ❌ failed:\x1b[0m ${e}`);

				if (service.constructor.name === 'Database') {
					process.exit(1);
				}
			}
		}
	}

	public listen(): void {
		this.express.listen(this.port);
	}
}

const expressApi = new Express({
	host: `${process.env.API_HOST}`,
	port: parseInt(`${process.env.API_PORT}`),
	apiPrefix: `${process.env.API_PREFIX}`,
	coreMiddlewares: [
		express.json({
			limit: '10mb',
			type: '*/*'
		}),
		express.urlencoded({
			extended: true,
			limit: '10mb'
		}),
		cors({
			methods: 'GET,PUT,POST,DELETE,OPTIONS',
			origin: '*',
			allowedHeaders: ['Content-Type', 'Authorization'],
			exposedHeaders: ['Content-Type', 'Authorization']
		})
	],
	routes: [
		['/healthcheck', healthcheckRouter],
		['/patients', patientsRouter]
	],
	middleWares: [responseHandler]
});

expressApi
	.initServices([new Database()])
	.then(() => {
		expressApi.listen();
	})
	.catch((err) => {
		services.logger.error('Failed to initialize services:', err);
	})
	.finally(() => {
		services.logger.info(`\x1b[36m<---------------------------------------------------------->\x1b[0m`);
		services.logger.info(
			`\x1b[1m` + // bold
				`\x1b[31m 🤖 Express API is running at: \x1b[0m\x1b[1m` + // Red
				`\x1b[33mhttp://\x1b[0m\x1b[1m` + // Yellow
				`\x1b[38;5;208m${process.env.API_HOST}\x1b[0m\x1b[1m` + // Orange
				`\x1b[31m:${process.env.API_PORT}\x1b[0m\x1b[1m` + // Red
				`\x1b[35m${process.env.API_PREFIX} ✅\x1b[0m\x1b[1m` // Purple
		);
		services.logger.info(`\x1b[36m<---------------------------------------------------------->\x1b[0m`);
	});
