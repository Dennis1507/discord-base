import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { Module } from '../modules';

export const module: Module = {
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
		},
	],
};