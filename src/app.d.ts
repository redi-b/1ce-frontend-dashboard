// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
type SessionData = {
	id: string;
	username: string;
};

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: SessionData | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
