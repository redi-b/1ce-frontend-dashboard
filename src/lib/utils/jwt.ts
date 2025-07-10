import { jwtVerify } from 'jose';
import { JWT_SECRET } from '$env/static/private';

const secret = new TextEncoder().encode(JWT_SECRET);
const algs = ['HS256'];

export type JWTPayload = {
	userId: string;
	username: string;
	iat?: number; // Issued at
	exp?: number; // Expiration time
};

export async function verifyJwtToken(token: string): Promise<JWTPayload | null> {
	try {
		const { payload } = await jwtVerify<JWTPayload>(token, secret, { algorithms: algs });
		return payload; // Check if payload exists
	} catch (error) {
		console.error('Invalid token:', error);
		return null;
	}
}
