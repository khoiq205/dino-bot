import { soundCloudPlaylistRegex, soundCloudTrackRegex } from "@/constants/regex";
import { Playlist } from "@/types/playlist";
import { Platform, Song } from "@/types/song";
import { SoundCloud, Track } from "scdl-core";
export const scdl = SoundCloud;
export class SoundCloudService {
    public static async getTrackDetails(content: string): Promise<Song> {
        let url = '';
        const paths = content.match(soundCloudTrackRegex);
        if (!paths) {
            url = await this.searchTrack(content);
        } else {
            url = paths[0];
        }
        if (!url) throw new Error();
        const track: Track = await scdl.tracks.getTrack(url);
        if (track)
            return {
                title: track.title,
                length: track.duration / 1000,
                author: track.user.username,
                thumbnail: track.artwork_url ?? "",
                url: url,
                platform: Platform.SOUND_CLOUD
            }
        throw new Error();
    }
    public static async getPlaylist(url: string): Promise<Playlist> {
        const playlist = await scdl.playlists.getPlaylist(url);
        if (!playlist) if (!url) throw new Error("Không lấy được playlist soundcloud với url là: " + url);
        const songs: Song[] = [];
        playlist.tracks.forEach(track => {
            songs.push({
                title: track.title,
                thumbnail: track.artwork_url ?? '',
                author: track.user.username,
                length: track.duration / 1000,
                platform: Platform.SOUND_CLOUD,
                url: track.permalink_url
            })
        })
        return {
            title: playlist.title,
            thumbnail: playlist.artwork_url ?? '',
            author: `${playlist.user.first_name} ${playlist.user.last_name}`,
            songs: songs
        }
    }
    public static isUrlPlaylist(url: string): string | null {
        const paths = url.match(soundCloudPlaylistRegex);
        return paths ? paths[0] : null;
    }
    private static async searchTrack(keyword: string): Promise<string> {
        const result = await scdl.search({
            query: keyword,
            filter: "tracks"
        });
        if (result.collection.length > 0) {
            return result.collection[0].permalink_url;
        }
        return '';

    }
}