import { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { EnhancedClient } from '..';
import { Module, SlashCommand, UserMenuCommand } from '../interfaces';

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
			async execute(interaction) {
				await interaction.deferReply();
				if (interaction.client instanceof EnhancedClient) {
					const pings = (await interaction.client.data.get('ping')?.findOne({ '_id': interaction.targetId }))?.pings || 0;
					await interaction.client.data.get('ping')?.findOneAndUpdate({ '_id': interaction.targetId }, { pings: pings + 1 }, { upsert: true });
				}
				interaction.editReply(`🏓 Pong, <@${interaction.targetId}>!`);
			},
		} as UserMenuCommand,
	],
} as Module;