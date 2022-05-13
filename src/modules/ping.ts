import { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { EnhancedClient } from '..';
import { Module, SlashCommand, UserMenuCommand } from '../interfaces';
import { getLang } from '../lang/lang';

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
							await interaction.editReply(await getLang(interaction.locale, 'R_PING_PONG', ping.toString(), interaction.client.ws.ping.toString()));
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
				interaction.editReply(await getLang(interaction.locale, 'R_PING_PONG2', interaction.targetId));
			},
		} as UserMenuCommand,
	],
} as Module;