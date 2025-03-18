import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction,...args:any) => Promise<void>;
}
