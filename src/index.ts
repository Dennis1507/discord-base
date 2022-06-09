import { Client, ClientOptions, Collection, Intents } from 'discord.js';
import { loadFeatures } from './features';
import { database } from './database/database';
import config from '../config.json';
import { Model } from 'mongoose';
import { getLang } from './lang/lang';

export class EnhancedClient extends Client {
	public commands: Collection<string, (...args: any[]) => void> = new Collection();
	public usercommands: Collection<string, (...args: any[]) => void> = new Collection();
	public messagecommands: Collection<string, (...args: any[]) => void> = new Collection();
	public config: Record<string, string> = config;
	public data: Collection<string, Model<any>> = new Collection();

	public constructor(options: ClientOptions) {
		super(options);
		database(this, config);
		this.once('ready', () => loadFeatures('commands', 'events', this));
		this.login(config.token);
	}
}

const client = new EnhancedClient({ intents: Intents.FLAGS.GUILDS });

client.on('interactionCreate', async interaction => {
	let command;
	if (interaction.isCommand()) { command = client.commands.get(interaction.commandName); }
	else if (interaction.isUserContextMenu()) { command = client.usercommands.get(interaction.commandName); }
	else if (interaction.isMessageContextMenu()) { command = client.messagecommands.get(interaction.commandName); }
	else { return; }
	if (command) command(interaction);
	else interaction.reply({ content: await getLang(interaction.locale, 'R_UNKNOWN_COMMAND'), ephemeral: true });
});