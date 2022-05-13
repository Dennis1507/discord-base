import mongoose from 'mongoose';
import fs from 'fs';
import { EnhancedClient } from '..';

export async function database(client: EnhancedClient, config: Record<string, any>) {

	if (!config.mongoPath) return console.error('Mongo database path is not defined. Continue without connection.');

	try {
		await mongoose.connect(config.mongoPath);
		console.log('Successfully connected to database.');

		for (const file of fs.readdirSync('./src/database/schemas')) {
			if (file.endsWith('.ts') || file.endsWith('.js')) {
				const { schema } = await import(`./schemas/${file}`);
				client.data.set(schema.modelName, schema);
			}
		}
	}
	catch (err) {
		console.error(err);
		console.error('Failed to connect to database. Continue without connection.');
	}
}