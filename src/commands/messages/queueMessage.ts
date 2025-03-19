import messages from '@/constants/messages';
import { QueueItem } from '@/models/Server';
import { formatSeconds } from '@/utils/formatTime';
import { EmbedBuilder } from 'discord.js';

const MAX_SONGS_PER_PAGE = 10;

const generatePageMessage = (items: QueueItem[], start: number) => {
    const embedMessage = new EmbedBuilder()
        .setTitle(messages.yourQueue)
        .addFields(
            items.map((item, index) => ({
                name: `${start + 1 + index}. ${item.song.title} | ${item.song.author}`,
                value: `${formatSeconds(item.song.length)} | ${item.song.platform} | ${messages.addedToQueue
                    } ${item.requester}`,
            }))
        );

    return embedMessage;
};

export const createQueueMessages = (queue: QueueItem[]): EmbedBuilder[] => {
    if (queue.length < MAX_SONGS_PER_PAGE) {
        return [generatePageMessage(queue, 0)];
    } else {
        const embedMessages: EmbedBuilder[] = [];
        for (let i = 0; i < queue.length; i += MAX_SONGS_PER_PAGE) {
            embedMessages.push(
                generatePageMessage(queue.slice(i, i + MAX_SONGS_PER_PAGE), i)
            );
        }
        return embedMessages;
    }
};