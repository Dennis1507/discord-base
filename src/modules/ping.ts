import { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { ContextMenuCommand, Module, SlashCommand } from '../modules';

export default {
	commands: [
		{
			data: new SlashCommandBuilder()
				.setName('ping')
				.setDescription('Pong!'),
			async execute(interaction) {
				await interaction.deferReply({ fetchReply: true })
					.then(async reply => {
						if (reply instanceof Message) {
							const ping = reply.createdTimestamp - interaction.createdTimestamp;
							await interaction.editReply(`🏓 Pong! ${ping}ms. API Latency ${interaction.client.ws.ping}ms.`);
						}
					});
			},
		} as SlashCommand,
		{
			data: new ContextMenuCommandBuilder()
				.setName('Ping')
				.setType(2),
			execute(interaction) {
				interaction.reply('🏓 Pong, !');
			},
		} as ContextMenuCommand,
	],
} as Module;