import { CommandGeneric, ICommand } from "../factories";


export const commandsList: (commands: Record<string, ICommand>) => {commandName: string, aliases: string[], description: string, usage: string, category: string}[] = (commands) => {
    return Object.entries(commands).map(([commandName, command]) => {
        return {
            commandName,
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

export const helpCommand = new CommandGeneric(['help', 'h'], 'Shows commands', 'help <int page | str category> <?page>', 'general', (client, message) => {
    
});