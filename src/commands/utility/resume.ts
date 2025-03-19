
import messages from "@/constants/messages";
import { servers } from "@/models/Server";
import { Command } from "@/types/command";
import { AudioPlayerStatus } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Tiếp tục phát nhạc'),
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        const server = servers.get(interaction.guildId as string);
        if (!server) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        if (server.audioPlayer.state.status === AudioPlayerStatus.Paused) {
            server.resume();
            await interaction.followUp(messages.resumed);
            return;
        }
        await interaction.followUp(messages.notPlaying);

    }
};

export default command;