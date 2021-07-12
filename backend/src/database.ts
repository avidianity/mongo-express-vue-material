import mongoose, { Connection } from 'mongoose';

export const connect = () => {
	return new Promise<Connection>(async (resolve, reject) => {
		try {
			mongoose.connect(`mongodb://localhost:27017/deliveria`, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});

			const db = mongoose.connection;

			db.on('error', (error) => reject(error));
			db.once('open', () => resolve(db));
		} catch (error) {
			reject(error);
		}
	});
};
