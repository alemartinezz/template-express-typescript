import { NextFunction, Request, Response } from 'express';
import { emailTemplate } from './emailTemplate';

const nodemailer = require('nodemailer');

export const sendEmail = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		let transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: process.env.EMAIL_SENDER,
				pass: process.env.EMAIL_PASSWORD
			}
		});

		// Email details
		let mailOptions = {
			from: process.env.EMAIL_SENDER,
			to: res.locals.patient.email,
			subject: 'LightIT - Patient Registration',
			html: getHtmlEmail(res.locals.patient)
		};

		// Send the email
		await transporter.sendMail(mailOptions);

		next();
	} catch (error) {
		console.log(error);
		next();
	}
};

const getHtmlEmail = (data: any) => {
	try {
		let emailHtml = emailTemplate;

		emailHtml = emailHtml.replace('{{name}}', data.name);
		emailHtml = emailHtml.replace('{{email}}', data.email);
		emailHtml = emailHtml.replace('{{address}}', data.address || '');
		emailHtml = emailHtml.replace('{{phoneNumber}}', data.phoneNumber || '');
		emailHtml = emailHtml.replace('{{documentPhoto}}', data.documentPhoto || 'No photo.'); // This assumes that the documentPhoto is either base64 encoded or a link to the image. If it's a binary, you'd need to handle it differently.

		return emailHtml;
	} catch (error) {
		throw error;
	}
};
