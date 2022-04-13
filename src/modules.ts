import { ClientEvents, CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { EnhancedClient } from '.';
import fs from 'fs';


export interface Module {
	commands?: Array<Command>;
	events?: Array<Event>;
}

interface Command {
	data: SlashCommandBuilder;
	execute: (arg0: CommandInteraction) => void;
}

interface Event {
	event: keyof ClientEvents;
	once?: boolean;
	execute: (...args: any[]) => void;
}

export async function loadModules(path: string, client: EnhancedClient) {
	if (!client.user) return console.error('Client user is not defined.');
	const data: {}[] = [];

	/* Read in all module files. */
	for (const file of fs.readdirSync('./src/' + path)) {
		if (file.endsWith('.ts') || file.endsWith('.js')) {
			const { commands, events } = (await import(`./${path}/${file}`)).default;

			/* Load commands. */
			if (commands) {
				commands.forEach((command: Command) => {
					data.push(command.data.toJSON());
					client.commands.set(command.data.name, command.execute);
				});
			}

			/* Load events. */
			if (events) {
				events.forEach((event: Event) => {
					if (event.once) client.once(event.event, event.execute);
					else client.on(event.event, event.execute);
				});
			}

		}
		else {

			/* Recursively load subdirectories. */
			fs.stat(`./src/${path}/${file}`, (err, stats) => {
				if (err) return console.error(err);
				if (stats.isDirectory()) loadModules(`${path}/${file}`, client);
			});
		}
	}

	const rest = new REST({ version: '9' }).setToken(client.config.token);

	if (client.config.dev) {

		/* Update commands on given dev server. */
		await rest.put(
			Routes.applicationGuildCommands(client.user.id, client.config.dev),
			{ body: data }
		);
		console.log('Successfully updated commands on dev server.');
	}
	else {

		/* Update commands globally. */
		await rest.put(
			Routes.applicationCommands(client.user.id),
			{ body: data }
		);
		console.log('Successfully updated commands globally.');
	}
}