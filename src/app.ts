import { config } from 'dotenv';
config();
import { Client, Collection, GatewayIntentBits, Events, Message } from 'discord.js'
import fs from 'node:fs';
import path from 'node:path';
import { Command } from './constants/command';
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
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);
  for (const folder of commandFolders) {
    const folderPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      await import(filePath).then(module => {
        const command: Command = module.default;
        client.commands.set(command.data.name, command)
      }).catch(error => {
        console.log("Error when load module", error);
      })
    }
  }
})()

client.on(Events.ClientReady, () => {
  console.log("🏃‍♀️ Dinobot is online! 💨");
});

client.once("reconnecting", () => {
  console.log("🔗 Reconnecting!");
});

client.once("disconnect", () => {
  console.log("🛑 Disconnect!");
});
client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.bot) return;
  if (message.author.username == "thienvanphan") {
    await message.reply("thằng lol phắc boi!🖕🖕🖕🖕");
  }
});
client.on(Events.InteractionCreate,async interaction=>{
  
 if (!interaction.isCommand()) return;
 const command = interaction.client.commands.get(interaction.commandName);
 console.log("command", command);
 await command.execute(interaction);
  
})
client.login(token);
