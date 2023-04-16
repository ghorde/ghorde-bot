import { Client, Embed, Message } from "guilded.js";

export const ErrorEmbed = (client: Client, message: Message) => new Embed({
    title: "Error",
    description: "An error has occurred.",
    color: 0xff0000,
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
        url: "https://em-content.zobj.net/source/skype/289/cross-mark_274c.png"
    }
})