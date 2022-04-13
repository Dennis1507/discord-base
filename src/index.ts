import { Client, ClientOptions, Collection, Intents } from 'discord.js';
import config from '../config.json';
import { loadModules } from './modules';

export class EnhancedClient extends Client {
	public commands: Collection<string, (...args: any[]) => void> = new Collection();
	public config: Record<string, string> = config;

	public constructor(options: ClientOptions) {
		super(options);
		this.login(config.token);
		this.once('ready', () => {
			loadModules('modules', this);
		});
	}
}

const client = new EnhancedClient({ intents: Intents.FLAGS.GUILDS });

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (command) command(interaction);
		else interaction.reply({ content: 'Unknown command.', ephemeral: true });
	}
});