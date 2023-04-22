import { ICommand, botCommand } from "./factories/command/command.factory.types"
import { ping } from './commands/ping.command';
import { help } from './commands/help.command';
import { prefix } from "./commands/prefix.command";
import { waifu } from './commands/waifu.command';
import { edit } from "./commands/edit.command";
import { diffusion } from './commands/diffusion.command';
import { listModels } from './commands/diffusion.command/list-models.command';
import { modelStats } from './commands/diffusion.command/model-stats.command';

export const commands: Record<string, ICommand> = {ping, help, prefix, waifu, edit, diffusion, listModels, modelStats}

export const aliasUnique = (commands: Record<string, ICommand>): boolean => {
    const aliases = Object.values(commands).map(command => command.aliases).flat();
    return aliases.length === new Set(aliases).size;
}

export const getCommandRouter: (commands: Record<string, ICommand>) => Map<string, botCommand> = (commands) => {
    const commandRouter = new Map<string, botCommand>();
    Object.entries(commands).forEach(([commandName, command]) => {
        commandRouter.set(command.commandName, command.run);
        command.aliases.forEach(alias => {
            commandRouter.set(alias, command.run);
        })
        commandRouter.set(commandName, command.run);
    })
    return commandRouter;
}