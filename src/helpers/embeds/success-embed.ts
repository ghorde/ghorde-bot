import { Client, Embed, EmbedFooter, Message } from 'guilded.js';

export const SuccessEmbed = (client: Client, message: Message) => new Embed({
    title: "Success",
    description: "The command has been executed successfully.",
    color: 0x00ff00,
    footer: {
        text: "Ghorde Bot",
        icon_url: client.user.avatar
    },
    timestamp: new Date().toISOString(),
    author: {
        name: message.author.name,
        icon_url: message.author.avatar
    },
    thumbnail: {
        url: "https://em-content.zobj.net/source/skype/289/check-mark-button_2705.png"
    }
});
