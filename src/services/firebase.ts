import * as admin from 'firebase-admin';
import { customError, HttpResponse } from '../middlewares/responseHandler';

export class Firebase {
	public auth: admin.auth.Auth;
	private serviceAccount: any;

	constructor() {
		this.serviceAccount = require(`${process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH}`);

		// Ensure that Firebase Admin is only initialized once
		if (admin.apps.length === 0) {
			admin.initializeApp({
				credential: admin.credential.cert(this.serviceAccount)
			});
		}

		this.auth = admin.auth();
	}

	public async register(email: string, password: string): Promise<admin.auth.UserRecord> {
		try {
			const userRecord = await this.auth.createUser({
				email: email,
				password: password
			});

			return userRecord;
		} catch (err) {
			throw customError(HttpResponse.InternalServerError, 'Failed to firebase register: ');
		}
	}
}
