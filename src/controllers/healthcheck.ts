import { Request, Response } from 'express';
const os = require('os');
let connectionCount = 0;

export const healthcheck = (_req: Request, res: Response) => {
	const memoryUsage = process.memoryUsage();
	const ramInfo = systemRamInfo();
	const cpuUsage = getCpuUsagePercentage();

	const status = {
		state: 'Running ✅',
		process_uptime: getUptime(),
		current_connections: connectionCount.toLocaleString(),
		cpu: `${cpuUsage.totalCapacity} (${cpuUsage.usedPercentage})`,
		memory: {
			app: {
				rss: bytesToGigaBytes(memoryUsage.rss, 3),
				heapTotal: bytesToGigaBytes(memoryUsage.heapTotal, 3),
				heapUsed: bytesToGigaBytes(memoryUsage.heapUsed, 3),
				freeMemory: bytesToGigaBytes(os.freemem(), 3)
			},
			system: {
				free: ramInfo.free,
				used: ramInfo.used,
				total: ramInfo.total
			}
		}
	};

	res.json(status);
};

function getUptime() {
	const uptimeInSeconds = process.uptime();
	const uptimeInMinutes = Math.floor(uptimeInSeconds / 60);
	const uptimeInHours = Math.floor(uptimeInMinutes / 60);
	const uptimeInDays = Math.floor(uptimeInHours / 24);
	return `${uptimeInDays > 0 ? `${uptimeInDays}d ` : ''}` + `${uptimeInHours % 24 > 0 ? `${uptimeInHours % 24}h ` : ''}` + `${uptimeInMinutes % 60}m ${Math.floor(uptimeInSeconds % 60)}s`;
}

function systemRamInfo() {
	const totalMem = os.totalmem();
	const freeMem = os.freemem();
	const usedMem = totalMem - freeMem;
	const usedPercentage = ((usedMem / totalMem) * 100).toFixed(2);
	const freePercentage = ((freeMem / totalMem) * 100).toFixed(2);

	return {
		total: bytesToGigaBytes(totalMem, 2),
		used: bytesToGigaBytes(usedMem, 2) + ` (${usedPercentage}%)`,
		free: bytesToGigaBytes(freeMem, 2) + ` (${freePercentage}%)`
	};
}

function getCpuUsagePercentage() {
	const startUsage = process.cpuUsage();

	// Run a busy task for a short duration to measure CPU usage
	for (let i = 0; i < 10000000; i++) {
		// Do some computation
		Math.sin(i);
	}

	const endUsage = process.cpuUsage();
	const userCpuUsage = endUsage.user - startUsage.user;
	const systemCpuUsage = endUsage.system - startUsage.system;
	const cpuUsage = userCpuUsage + systemCpuUsage;
	const totalCpuTime = cpuUsage / 1000000; // time in milliseconds
	const cpuCount = os.cpus().length;
	const cpuCapacity = cpuCount * 1000; // each CPU has a capacity of 1000 milliseconds per second

	const usedPercentage = ((totalCpuTime / cpuCapacity) * 100).toFixed(2);
	const totalCapacity = cpuCapacity / 1000; // convert to seconds

	return {
		usedPercentage: `${usedPercentage}%`,
		totalCapacity: `${totalCapacity}s`
	};
}

function bytesToGigaBytes(data: any, decimals: any) {
	return `${(data / 1073741824).toFixed(decimals)}GB`; // 1073741824 = 1024 * 1024 * 1024
}
