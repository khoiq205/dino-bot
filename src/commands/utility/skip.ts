
import { Command } from "@/types/command";
import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Replies with Pong!'),
    async execute(interaction: CommandInteraction) {
        interaction.reply(`${this.data.name} đang phát triển`)
    }
};

export default command;