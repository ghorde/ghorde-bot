import { Client, Embed, Message } from "guilded.js";

export const WarningEmbed = (client: Client, message: Message) => new Embed({
    title: "Warning",
    description: "You do not have permission to use this command.",
    color: 0xffff00,
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
        url: "https://em-content.zobj.net/source/skype/289/warning_26a0-fe0f.png",
    }
});
