export type ErrorData = {
	message?: string;
	status?: number;
	errors?: any[];
};

export class HttpException extends Error {
	public readonly status: number;
	public readonly errors: any[];

	constructor(options?: ErrorData) {
		super(options?.message);
		this.status = options?.status || 500;
		this.errors = options?.errors || [];
	}
}
