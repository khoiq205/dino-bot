
import { Command } from "@/types/command";
import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Replies with resume!'),
    async execute(interaction: CommandInteraction) {
        console.log('interaction resume',interaction);
        interaction.reply(`${this.data.name} đang phát triển`)
    }
};

export default command;