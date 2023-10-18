import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { HttpResponse, customError } from '../middlewares/responseHandler';

export class Firebase {
	public options: any;
	public app: any;
	public analytics: any;
	public auth: any;

	constructor() {
		this.options = {
			apiKey: process.env.FIREBASE_API_KEY,
			authDomain: process.env.FIREBASE_AUTH_DOMAIN,
			projectId: process.env.FIREBASE_PROJECT_ID,
			storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.FIREBASE_APP_ID,
			measurementId: process.env.FIREBASE_MEASUREMENT_ID
		};
		this.auth = getAuth();
	}

	public async init() {
		try {
			if (!getApps().length) {
				this.app = initializeApp(this.options);
				this.analytics = getAnalytics(this.app);
			} else {
				this.app = getApp();
			}
		} catch (err) {
			throw err;
		}
	}

	public async register(email: string, password: string, additionalData: any): Promise<any> {
		try {
			const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

			if (!userCredential) {
				throw customError(HttpResponse.InternalServerError, 'Failed to firebase create user.');
			}

			const db = getFirestore();
			await setDoc(doc(db, 'users', userCredential.user.uid), additionalData);

			return userCredential.user;
		} catch (err) {
			throw err;
		}
	}

	public async login(email: string, password: string): Promise<any> {
		try {
			const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

			if (!userCredential) {
				throw customError(HttpResponse.InternalServerError, 'Failed to firebase login.');
			}

			return userCredential.user;
		} catch (err) {
			throw err;
		}
	}
}
