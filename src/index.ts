import { Client, ClientOptions, Collection, Intents } from 'discord.js';
import { loadModules } from './modules';
import config from '../config.json';

export class EnhancedClient extends Client {
	public commands: Collection<string, (...args: any[]) => void> = new Collection();
	public usercommands: Collection<string, (...args: any[]) => void> = new Collection();
	public messagecommands: Collection<string, (...args: any[]) => void> = new Collection();
	public config: Record<string, string> = config;

	public constructor(options: ClientOptions) {
		super(options);
		this.once('ready', () => loadModules('modules', this));
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
	else interaction.reply({ content: 'Unknown command.', ephemeral: true });
});