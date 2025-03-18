
import messages from "@/constants/messages";
import { QueueItem, Server, servers } from "@/models/Server";
import { SoundCloudService } from "@/services/soundcloud";
import { Command } from "@/types/command";
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";
import { createPlayMessagge } from "../messages/playMessage";
import { Platform } from "@/types/song";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('soundcloud')
        .setDescription('Phát nhạc với nguồn SoundCloud')
        .addStringOption(option =>
            option.setName('input').setDescription('input').setRequired(true)
        ) as SlashCommandBuilder,
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        let server = servers.get(interaction.guildId as string);
        if (!server) {
            if (
                interaction.member instanceof GuildMember &&
                interaction.member.voice.channel // member phải gọi /soundcloud khi đang trong một kênh thoại
            ) {
                const channel = interaction.member.voice.channel;
                server = new Server(
                    joinVoiceChannel(
                        {
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator
                        }
                    ),
                    interaction.guildId as string
                );
                servers.set(interaction.guildId as string, server);
            } else {// gửi thông báo yêu cầu tham gia vào một kênh thoại
                await interaction.followUp(messages.joinVoiceChannel)
                return;
            }
        }
        // Đảm bảo kết nối sẵn sàng
        // Đợi 20s để VoiceConnection đạt trạng thái Ready.
        try {
            await entersState(server.voiceConnection, VoiceConnectionStatus.Ready, 5e3)
        } catch (error) {
            console.log("Error", error);
            await interaction.followUp(messages.failToJoinVoiceChannel)
            return;
        }
        try {
            const input = interaction.options.get('input')!.value as string;
            const playlistUrl = SoundCloudService.isUrlPlaylist(input);
            if (playlistUrl) {
                const playlist = await SoundCloudService.getPlaylist(playlistUrl);
                const songs = playlist.songs.map(song => {
                    const queueItem: QueueItem = {
                        song: song,
                        requester: interaction.member?.user.username as string
                    }
                    return queueItem;
                });
                await server.addSongs(songs);
                interaction.followUp({
                    embeds: [
                        createPlayMessagge({
                            title: playlist.title,
                            url: playlistUrl,
                            author: playlist.author,
                            thumnail: playlist.thumbnail,
                            length: playlist.songs.length,
                            platform: Platform.SOUND_CLOUD,
                            type: 'Playlist',
                            requester: interaction.member?.user.username as string
                        })
                    ]
                });
            }
            else {
                const song = await SoundCloudService.getTrackDetails(input);
                const queueItem: QueueItem = {
                    song: song,
                    requester: interaction.member?.user.username as string
                }
                await server.addSongs([queueItem]);
                interaction.followUp({
                    embeds: [
                        createPlayMessagge({
                            title: song.title,
                            url: song.url,
                            author: song.author,
                            thumnail: song.thumbnail,
                            length: song.length,
                            platform: Platform.SOUND_CLOUD,
                            type: 'Song',
                            requester: interaction.member?.user.username as string
                        })
                    ]
                });
            }
        } catch (error) {
            console.log("Error", error);
            await interaction.followUp(messages.failToPlay);
        }

    }
};

export default command;