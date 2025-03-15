
import { Command } from "@/types/command";
import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Replies with Pong!'),
    async execute(interaction: CommandInteraction) {
        interaction.reply('Đã nhận lệnh play')
    }
};

export default command;