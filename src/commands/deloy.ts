import { Command } from "@/types/command";
import { Client, Events, Message, REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";
const token = process.env.TOKEN ?? "";
const guildId = process.env.GUILD_ID ?? "";
const clientId = process.env.CLIENT_ID ?? "";

export const deloy = (client: Client): void => {
    client.on(Events.MessageCreate, async (message: Message) => {
        // thoát khi guild undefined 
        if (!message.guild) return;
        // lấy thông tin owner khi bot chưa có dữ liệu owner
        if (!client.application?.owner) {
            await client.application?.fetch();
        }
        if (message.content.toLowerCase() === '!deloy' &&
            message.author.id === client.application?.owner?.id
        ) {
            const commands = await getCommands();
            const dataJson = commands.map(command => command.data.toJSON());

            const rest = new REST().setToken(token);

            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);

                const data = await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    {
                        body: dataJson
                    }
                );
                console.log(`Successfully reloaded ${(data as Array<any>).length} application (/) commands.`);
            } catch (error) {
                console.log("Error when deloy command");

            }
        }
    })
}
export const getCommands = async (): Promise<Command[]> => {
    const folderPath = path.join(__dirname, 'utility');
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    const commands: Command[] = [];
    commandFiles.forEach(async file => {
        const filePath = path.join(folderPath, file);
        await import(filePath).then(module => {
            const command: Command = module.default;
            commands.push(command);
        }).catch(error => {
            console.log("Error when load module", error);
        })
    })
    return Promise.resolve(commands);
}