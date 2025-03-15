import { Command } from './types/command';
import { config } from 'dotenv';
config();
import { Client, Collection, GatewayIntentBits, Events, Message } from 'discord.js'
import { deloy, getCommands } from './commands/deloy';
const token = process.env.TOKEN;
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, any>
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildIntegrations,
  ],
});

(async () => {
  client.commands = new Collection();
  const commands = await getCommands();
  commands.forEach(command =>{
    client.commands.set(command.data.name,command)
  })
})()

client.on(Events.ClientReady, () => {
  console.log("🏃‍♀️ Dinobot is online! 💨");
});

// client.once("reconnecting", () => {
//   console.log("🔗 Reconnecting!");
// });

// client.once("disconnect", () => {
//   console.log("🛑 Disconnect!");
// });
// client.on(Events.MessageCreate, async (message: Message) => {
//   if (message.author.bot) return;
//   if (message.author.username == "thienvanphan") {
//     await message.reply("thằng lol phắc boi!🖕🖕🖕🖕");
//   }
// });
client.on(Events.InteractionCreate,async interaction=>{
  
 if (!interaction.isCommand()) return;
 const command = interaction.client.commands.get(interaction.commandName);
 console.log("interaction", interaction);
 await command.execute(interaction);
  
})
client.login(token).then(()=>{
  deloy(client);
});
