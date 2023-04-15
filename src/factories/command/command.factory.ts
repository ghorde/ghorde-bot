import { Client, Message } from "guilded.js";
import { ICommand, botCommand } from "./command.factory.types";

export class CommandGeneric implements ICommand {
    readonly aliases: string[];
    readonly description: string;
    readonly usage: string;
    readonly category: string;
    readonly run: botCommand;
    constructor(aliases: string[], description: string, usage: string, category: string, run: botCommand) {
        this.aliases = aliases;
        this.description = description;
        this.usage = usage;
        this.category = category;
        this.run = run;
    }
}