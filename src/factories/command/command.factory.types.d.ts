import { Client, Embed, Message } from "guilded.js"

export type botCommand = (client: Client, message: Message, args?: string[], prefix?: string) => Promise<Embed> | Embed

export interface ICommand {
    aliases: string[]
    description: string
    usage: string
    category: string
    run: botCommand
}