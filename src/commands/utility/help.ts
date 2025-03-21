
import { Command } from "@/types/command";
import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('help'),
    async execute(interaction: CommandInteraction) {
        interaction.reply(`${this.data.name} đang phát triển`)
    }
};

export default command;