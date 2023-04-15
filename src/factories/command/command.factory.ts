import { Client, Message } from "guilded.js";
import { ICommand, botCommand } from "./command.factory.types";

export class CommandGeneric implements ICommand {
    readonly commandName: string;
    readonly aliases: string[];
    readonly description: string;
    readonly usage: string;
    readonly category: string;
    readonly run: botCommand;
    constructor(commandName: string, aliases: string[], description: string, usage: string, category: string, run: botCommand) {
        this.commandName = commandName;
        this.aliases = aliases;
        this.description = description;
        this.usage = usage;
        this.category = category;
        this.run = run;
    }
}