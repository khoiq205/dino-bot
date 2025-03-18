
import messages from "@/constants/messages";
import { QueueItem, Server, servers } from "@/models/Server";
import { YoutubeService } from "@/services/youtube";
import { Command } from "@/types/command";
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { APIInteractionGuildMember, CommandInteraction, Guild, GuildMember, SlashCommandBuilder } from "discord.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Mở một bài hát trong kênh thoại')
        .addStringOption((option) =>
            option
                .setName('input')
                .setDescription('Nhập tên hoặc đường dẫn')
                .setRequired(true)
        ) as SlashCommandBuilder
    ,
    async execute(interaction): Promise<void> {
        interaction.reply("Đang phát triển")
    }
};

export default command;