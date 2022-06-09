import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { EnhancedClient } from '../..';
import { UserMenuCommand } from '../../interfaces';
import { getLang } from '../../lang/lang';

export default {
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
} as UserMenuCommand;