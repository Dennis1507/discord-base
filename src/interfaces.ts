import { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { ClientEvents, CommandInteraction, MessageContextMenuInteraction, UserContextMenuInteraction } from 'discord.js';


export interface Module {
	commands?: Array<Command>;
	events?: Array<Event>;
}

export interface Event {
	event: keyof ClientEvents;
	once?: boolean;
	execute: (...args: any[]) => void;
}

/**/

export interface SlashCommand {
	data: SlashCommandBuilder;
	execute: (arg0: CommandInteraction) => void;
}

export interface UserMenuCommand {
	data: ContextMenuCommandBuilder;
	execute: (arg0: UserContextMenuInteraction) => void;
}

export interface MessageMenuCommand {
	data: ContextMenuCommandBuilder;
	execute: (arg0: MessageContextMenuInteraction) => void;
}

export type Command = SlashCommand|UserMenuCommand|MessageMenuCommand;