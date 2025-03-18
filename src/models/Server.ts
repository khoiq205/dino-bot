import { scdl } from "@/services/soundcloud";
import { Platform, Song } from "@/types/song";
import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    entersState, StreamType,
    VoiceConnection,
    VoiceConnectionDisconnectReason,
    VoiceConnectionStatus
} from "@discordjs/voice";
import { Snowflake } from "discord.js";
export interface QueueItem {
    song: Song;
    requester: string; // id thành viên gửi yêu cầu
}
export class Server {
    public guildId: string;
    public playing?: QueueItem;
    public queue: QueueItem[];
    public readonly voiceConnection: VoiceConnection;
    public readonly audioPlayer: AudioPlayer;
    private isReady = false;
    constructor(voiceConnection: VoiceConnection, guildId: string) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();
        this.queue = [];
        this.playing = undefined;
        this.guildId = guildId;

        this.voiceConnection.on("stateChange", async (oldState, newState) => {
            console.log(`Trạng thái bot thay đổi: ${oldState.status} → ${newState.status}`);

            if (newState.status === VoiceConnectionStatus.Disconnected) {
                console.log("🔴 Bot đã bị disconnect!",);
                /*
         Nếu websocket đã bị đóng với mã 4014 có 2 khả năng:
         - Nếu nó có khả năng tự kết nối lại (có khả năng do chuyển kênh thoại), ta cho dảnh ra 5s để tìm hiểu và cho kết nối lại.
         - Nếu bot bị kick khỏi kênh thoại, ta sẽ phá huỷ kết nối.
               */
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose
                ) {
                    switch (newState.closeCode) {
                        case 4014:
                            console.log("❌ Bot bị kick hoặc bị thu hồi quyền!");
                            this.leave();
                            break;
                        default:
                            try {
                                await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000)
                            } catch (error) {
                                console.log("closeCode", newState.closeCode);
                                console.log("Error", error);
                                this.leave()
                            }
                            break;
                    }
                } else if (this.voiceConnection.rejoinAttempts < 5) {
                    this.voiceConnection.rejoin()
                } else {
                    this.leave()
                }
            } else if (this.voiceConnection.state.status === VoiceConnectionStatus.Destroyed) {
                this.leave()
            } else if (
                !this.isReady &&
                (
                    newState.status === VoiceConnectionStatus.Connecting ||
                    newState.status === VoiceConnectionStatus.Signalling
                )
            ) {
                this.isReady = true;
                try {
                    await entersState(
                        this.voiceConnection,
                        VoiceConnectionStatus.Ready,
                        20_000,
                    );
                } catch (error) {
                    console.log("Error", error);
                    this.voiceConnection.destroy();
                } finally {
                    this.isReady = false;
                }
            }
        })
        this.audioPlayer.on('error', (error) => {
            console.error("AudioPlayer Error:", error.message);
        });
        this.audioPlayer.on('stateChange', async (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle &&
                oldState.status !== AudioPlayerStatus.Idle
            ) {
                await this.play();
            }
        });
        voiceConnection.subscribe(this.audioPlayer);

    }
    public leave(): void {
        if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) {
            this.voiceConnection.destroy();
        }
        this.stop();
        servers.delete(this.guildId);
    }
    public stop(): void {
        this.playing = undefined;
        this.queue = [];
        this.audioPlayer.stop();
    }
    public async play(): Promise<any> {
        try {
            if (this.queue.length > 0) {
                this.playing = this.queue.shift() as QueueItem;
                let stream;
                const highWaterMark = 1024 * 1024 * 16;
                switch (this.playing.song.platform) {
                    case Platform.YOUTUBE:
                        break;
                    case Platform.SOUND_CLOUD:
                        stream = await scdl.download(this.playing.song.url, {
                            highWaterMark
                        });
                        break;
                    default:
                        break;
                }
                const audioResource = createAudioResource(stream!);
                this.audioPlayer.play(audioResource);
            } else { //queue rỗng
                this.playing = undefined;
                this.audioPlayer.stop();
            }
        } catch (error) {
            this.play();
        }
    }
    public async addSongs(queueItems: QueueItem[]): Promise<void> {
        this.queue = this.queue.concat(queueItems);
        if (!this.playing) {
            await this.play();
        }
    }
}
export const servers = new Map<Snowflake, Server>();