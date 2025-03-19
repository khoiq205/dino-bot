
import messages from "@/constants/messages";
import { servers } from "@/models/Server";
import { Command } from "@/types/command";
import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Ngắt kết nối bot khỏi kênh thoại'),
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        const server = servers.get(interaction.guildId as string);
        if (!server) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        server.leave();
        await interaction.followUp(messages.leaved)
    }
};

export default command;