
import messages from "@/constants/messages";
import { QueueItem, servers } from "@/models/Server";
import { Command } from "@/types/command";
import { AudioPlayerStatus } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";
import { createPlayMessagge } from "../messages/playMessage";
import { Song } from "@/types/song";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Lấy thông tin bài hát đang phát'),
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        const server = servers.get(interaction.guildId as string);
        if (!server) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        const queueItem: undefined | QueueItem = server.playing;
        if (queueItem) {
            await interaction.followUp({
                embeds: [
                    createPlayMessagge({
                        ...queueItem.song,
                        type: 'Song',
                        requester: queueItem.requester,
                    })
                ]
            });
            return;
        }
        await interaction.followUp(messages.notPlaying);

    }
};
export default command;