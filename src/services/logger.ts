import { Logger, createLogger, format, transports, addColors } from 'winston';

export class Winston {
	public logger: Logger;

	constructor() {
		const customLevels = {
			levels: {
				error: 0,
				warn: 1,
				custom: 2,
				info: 3,
				debug: 4
			},
			colors: {
				error: 'red',
				warn: 'yellow',
				custom: 'magenta',
				info: 'cyan',
				debug: 'green'
			}
		};

		addColors(customLevels.colors);

		const { combine, timestamp, printf, colorize } = format;

		const myFormat = printf(({ level, message, label, timestamp, stack, metadata }) => {
			return `${timestamp} [${level}]: ${message} ${stack ? '\n' + stack : ''} ${metadata ? JSON.stringify(metadata) : ''}`;
		});

		this.logger = createLogger({
			levels: customLevels.levels,
			format: combine(colorize(), timestamp(), myFormat),
			transports: [new transports.Console(), new transports.File({ filename: 'application.log' })]
		});
	}
}
