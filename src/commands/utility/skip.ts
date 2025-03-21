
import messages from "@/constants/messages";
import { servers } from "@/models/Server";
import { Command } from "@/types/command";
import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Qua bài hát tiếp theo'),
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        const server = servers.get(interaction.guildId as string);
        if (!server) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        if (server.queue.length > 0) {
            server.skip();
            await interaction.followUp(messages.skippedSong);
            return;
        }
        await interaction.followUp(messages.noSongsInQueue);
    }
};

export default command;