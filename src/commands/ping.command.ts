import { CommandGeneric } from '../factories/command/command.factory';
import { SuccessEmbed } from '../helpers/embeds';

export const ping = new CommandGeneric('ping', ['p'], 'Pong!', 'ping', 'general', async(client, message) => {
    const response = SuccessEmbed.setTitle('Pong!').setDescription(`Latency is ${message.createdAt.getTime()-Date.now()}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    await message.reply(response);
    return;
});