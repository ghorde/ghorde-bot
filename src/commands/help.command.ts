import { CommandGeneric } from "../factories/command/command.factory";
import { ICommand, botCommand } from "../factories/command/command.factory.types";

import {commands} from '../commands';
import { paginate } from '../helpers/common/paginate';
import { ErrorEmbed, SuccessEmbed } from "../helpers/embeds";

export const commandsList: (commands: Record<string, ICommand>) => {commandName: string, aliases: string[], description: string, usage: string, category: string}[] = (commands) => {
    return Object.entries(commands).map(([_, command]) => {
        return {
            commandName: command.commandName,
            aliases: command.aliases,
            description: command.description,
            usage: command.usage,
            category: command.category
        }
    })
}

export const categoryCommands: (commands: Record<string, ICommand>) => Record<string, {commandName: string, aliases: string[], description: string, usage: string}[]> = (commands) => {
    const categories = Object.values(commands).map(command => command.category);
    const uniqueCategories = new Set(categories);
    const categoryCommands: Record<string, {commandName: string, aliases: string[], description: string, usage: string}[]> = {};
    uniqueCategories.forEach(category => {
        categoryCommands[category] = commandsList(commands).filter(command => command.category === category);
    });
    return categoryCommands;
}

export const helpCommand = new CommandGeneric('help', ['h'], 'Shows commands', 'help *<int page>*', 'general', (client, message, args) => {
    if (parseInt(args[0])) {
        const commandsPage = paginate<Omit<ICommand, 'run'>>(commandsList(commands), parseInt(args[0]));
        if (commandsPage) {
            message.reply(SuccessEmbed.setFooter(`Viewing ${commandsPage.page}/${commandsPage.total_pages}`).setTitle("Help").addFields(commandsPage.data.map(command => {
                return {
                    name: `${command.commandName} - ${command.category}`,
                    value: `Aliases: ${command.aliases.join(', ')}\nDescription: ${command.description}\nUsage: ${command.usage}`
                }
            })));
            return;
        }
    }
    message.reply(ErrorEmbed.setDescription("Provide Page Number"))
    return;
});