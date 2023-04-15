import { Embed } from 'guilded.js';
import { CommandGeneric } from '../factories/command/command.factory';

export const ping = new CommandGeneric(['ping', 'p'], 'Pong!', 'ping', 'general', (client, message) => {
    return new Embed({
        title: 'Pong!',
        description: `Latency is ${Date.now() - message.createdAt.getTime()}ms. API Latency is ${Math.round(client.ws.ping)}ms`,
        color: 0x00ff00
    });
});