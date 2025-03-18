import { youtubeVideoRegex } from './../constants/regex';
import { Platform, Song } from '@/types/song';
export class YoutubeService {
    public static async getVideoDetail(content: string): Promise<Song> {
        const parsedContent = content.match(youtubeVideoRegex);
        let id = '';
        if (parsedContent) {//content là một url youtube hợp lệ
            id = parsedContent[1];
        } else {
            const result = await this.searchVideo(content);
            if (!result) throw new Error();
            id = result;
        }
        const url = this.generateVideoUrl(id);
        return {
            title: "No data",
            thumbnail: "",
            author: "No data",
            length: 0,
            url: url,
            platform: Platform.YOUTUBE
        };
    }
    private static async searchVideo(keyword: string): Promise<string> {
        return "HXV9D6ZWltU";
    }
    private static generateVideoUrl(id: string): string {

        return `https://www.youtube.com/watch?v=${id}`;
    }
}