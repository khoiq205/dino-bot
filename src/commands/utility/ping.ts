
import messages from "@/constants/messages";
import { YoutubeService } from "@/services/youtube";
import { Command } from "@/types/command";
import { Client, CommandInteraction, Message, MessageFlags, SlashCommandBuilder, } from "discord.js";


const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: CommandInteraction,client: Client) {
       await interaction.deferReply();
       const pingLatency = Date.now() - interaction.createdTimestamp;
       const apiLatency = client.ws.ping;
       //test
       YoutubeService.getVideoDetail("https://www.youtube.com/watch?v=FN7ALfpGxiI");
       //
        await interaction.followUp(
          {
            content:  `${messages.ping} Latency: ${pingLatency}ms - API Latency: ${apiLatency}ms`,
          }
        )
    }
};

export default command;