import { ChatInputCommandInteraction, Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction | ChatInputCommandInteraction, ...args: any) => Promise<void>;
}
