import messages from "@/constants/messages";
import { Platform } from "@/types/song";
import { formatSeconds } from "@/utils/formatTime";
import { APIEmbedField, EmbedBuilder } from "discord.js";

export const createPlayMessagge = (payload: {
    title: string;
    url: string;
    author: string;
    thumnail: string;
    type: string;
    length: number;
    platform: Platform;
    requester: string;
}): EmbedBuilder => {
    const author: APIEmbedField = {
        name: messages.author,
        value: payload.author,
        inline: true
    };
    const length: APIEmbedField = {
        name: messages.length,
        value: payload.type === 'Playlist'
            ? payload.length.toString()
            : formatSeconds(payload.length),
        inline: true
    };
    const type: APIEmbedField = {
        name: messages.type,
        value: payload.platform,
        inline: true
    };
    return new EmbedBuilder()
        .setTitle(payload.title)
        .setURL(payload.url)
        .setAuthor({ name: `${messages.addedToQueue} ${payload.requester}` })
        .setThumbnail(payload.thumnail)
        .addFields(author, length, type);
}