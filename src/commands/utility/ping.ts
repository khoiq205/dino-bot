
import { Command } from "@/constants/command";
import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: CommandInteraction) {
        interaction.reply('Pong!')
    }
};

export default command;