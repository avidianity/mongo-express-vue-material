import toastr from 'toastr';
import swal from 'sweetalert';

window.toastr = toastr;

export function handleError(error: any) {
	if (error.response) {
		const response = error.response;
		if (response.message && error.status !== 422) {
			toastr.error(response.message);
		} else if (error.status === 422) {
			response.errors
				.map(({ param, msg }: any) => {
					const array = msg.split(' ');

					if (array[0].trim().toLowerCase() !== param.trim().toLowerCase() && msg.includes('required')) {
						return `${param} ${msg}`;
					}
					return msg;
				})
				.forEach((error: any) => toastr.error(error));
		} else {
			if (error.status === 401) {
				toastr.error('You are unauthorized. Please try logging in again.');
			} else {
				toastr.error('Something went wrong, please try again later.', 'Oops!');
			}
		}
	} else if (error.message) {
		toastr.error(error.message);
	}
}

export class Asker {
	static async notice(message: string, title?: string) {
		return toBool(
			await swal({
				title,
				text: message,
				buttons: ['Cancel', 'Confirm'],
				icon: 'warning',
			})
		);
	}

	static async danger(message: string, title?: string) {
		return toBool(
			await swal({
				title,
				text: message,
				buttons: ['Cancel', 'Confirm'],
				dangerMode: true,
				icon: 'warning',
			})
		);
	}

	static async save(message: string, title?: string) {
		return toBool(
			await swal({
				title,
				text: message,
				buttons: ['Cancel', 'Save'],
				icon: 'info',
			})
		);
	}

	static async okay(message: string, title?: string) {
		return toBool(await swal({ title, text: message, icon: 'info' }));
	}
}

export function toBool(data: any) {
	return data ? true : false;
}

const formatter = new Intl.NumberFormat('en-PH', {
	style: 'currency',
	currency: 'PHP',
});

export function formatCurrency(value: number) {
	return formatter.format(value).replace(/\D00(?=\D*$)/, '');
}
