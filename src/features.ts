import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { EnhancedClient } from '.';
import fs from 'fs';

async function loadCommands(path: string, client: EnhancedClient) {
	if (!client.user) return console.error('Client user is not defined.');
	const cmd_data: {}[] = [];

	/* Read in all command files. */
	for (const file of fs.readdirSync('./src/' + path)) {
		if (file.endsWith('.ts') || file.endsWith('.js')) {
			const { data, execute } = (await import(`./${path}/${file}`)).default;

			/* Load command. */
			cmd_data.push(data.toJSON());

			console.log(typeof (await import(`./${path}/${file}`)).default);

			/* Command Type 2 is a Context Menu User Command.
					 * Command Type 3 is a Context Menu Message Command.
					 * Slash Commands do not have a type variable. */

			if (data instanceof SlashCommandBuilder) {client.commands.set(data.name, execute);}
			else if (data.type === 2) {client.usercommands.set(data.name, execute);}
			else {client.messagecommands.set(data.name, execute);}

		}
		else {

			/* Recursively load subdirectories. */
			fs.stat(`./src/${path}/${file}`, (err, stats) => {
				if (err) return console.error(err);
				if (stats.isDirectory()) loadCommands(`${path}/${file}`, client);
			});
		}
	}

	const rest = new REST({ version: '9' }).setToken(client.config.token);

	if (client.config.dev) {

		/* Update commands on given dev server. */
		await rest.put(
			Routes.applicationGuildCommands(client.user.id, client.config.dev),
			{ body: cmd_data }
		);
		console.log('Successfully updated commands on dev server.');
	}
	else {

		/* Update commands globally. */
		await rest.put(
			Routes.applicationCommands(client.user.id),
			{ body: cmd_data }
		);
		console.log('Successfully updated commands globally.');
	}
}

async function loadEvents(path: string, client: EnhancedClient) {
	/* Read in all event files. */
	for (const file of fs.readdirSync('./src/' + path)) {
		if (file.endsWith('.ts') || file.endsWith('.js')) {
			const { event, once, execute } = (await import(`./${path}/${file}`)).default;

			/* Load event. */
			if (once) {
				client.once(event, execute);
			}
			else {
				client.on(event, execute);
			}
		}
		else {

			/* Recursively load subdirectories. */
			fs.stat(`./src/${path}/${file}`, (err, stats) => {
				if (err) return console.error(err);
				if (stats.isDirectory()) loadEvents(`${path}/${file}`, client);
			});
		}
	}
}

export async function loadFeatures(cpath: string, epath: string, client: EnhancedClient) {
	loadCommands(cpath, client);
	loadEvents(epath, client);
}