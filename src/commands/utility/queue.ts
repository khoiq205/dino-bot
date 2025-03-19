import messages from "@/constants/messages";
import { servers } from "@/models/Server";
import { Command } from "@/types/command";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Xem hàng đợi'),
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        interaction.followUp("Tính năng đang phát triển")
    }
};

export default command;
