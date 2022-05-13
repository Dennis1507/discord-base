import { Schema, model } from 'mongoose';

const pingSchema = new Schema({
	_id: { type: String, required: true },
	pings: { type: Number, required: true },
});

export const schema = model('ping', pingSchema);