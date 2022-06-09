import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { SlashCommand } from '../../interfaces';
import { getLang } from '../../lang/lang';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!'),
	async execute(interaction) {
		await interaction.deferReply({ fetchReply: true })
			.then(async reply => {
				if (reply instanceof Message) {
					const ping = reply.createdTimestamp - interaction.createdTimestamp;
					await interaction.editReply(await getLang(interaction.locale, 'R_PING_PONG', ping.toString(), interaction.client.ws.ping.toString()));
				}
			});
	},
} as SlashCommand;