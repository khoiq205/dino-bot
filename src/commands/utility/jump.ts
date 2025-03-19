
import messages from "@/constants/messages";
import { servers } from "@/models/Server";
import { Command } from "@/types/command";
import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Phát một bài bất kì trong hàng đợi')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Nhập vị trí bài hát')
                .setRequired(true)
        ) as SlashCommandBuilder,
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        const server = servers.get(interaction.guildId as string);
        if (!server) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        const input = interaction.options.get('position')!.value as number;
        if (input < 1 || input > server.queue.length || !Number.isInteger(input)) {
            await interaction.followUp(messages.invalidPosition);
            return;
        }
        const target = await server.jump(input);
        await interaction.followUp(`${messages.jumpedTo} ${target.song.title}`);

    }
};

export default command;