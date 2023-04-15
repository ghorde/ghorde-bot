import { checkOwner } from '../helpers/bot/check-owner';
import { CommandGeneric } from '../factories/command/command.factory';
import { ErrorEmbed, SuccessEmbed } from '../helpers/embeds';
import { axios, mainLogger } from '../main';
import { getServerPrefix } from '../helpers/common/get-server-prefix';

export const prefix = new CommandGeneric('prefix', ['pre'], 'Sets the prefix!', 'prefix <prefix>', 'settings', async(client, message, args) => {
    const isOwner = checkOwner(message, client);
    if (!isOwner) {
        await message.reply(ErrorEmbed(client, message).setDescription('You are not the owner of this server\nOnly the owner can change the prefix!'));
        return;
    }
    const prefix = args[0];
    if (!prefix) {
        await message.reply(ErrorEmbed(client, message).setDescription('Please provide a prefix'));
        return;
    } else if (prefix.length > 5) {
        await message.reply(ErrorEmbed(client, message).setDescription('Prefix cannot be more than 5 characters'));
    } else {
        const res = await axios.patch(`/server/${message.serverId}`, {prefix}).catch(async(e) => {
            mainLogger.error(`Error while patching server prefix, serverId: ${message.serverId}! ${e}`)
            await message.reply(ErrorEmbed(client, message).setDescription('Could not set prefix! Please try again later!'));
            return
        })
        if (res) {
            let data = res.data
            mainLogger.info(`Patched server prefix, serverId: ${message.serverId}! ${data}`)
        }
        await message.reply(SuccessEmbed(client, message).setTitle("🤖 Updated prefix").setDescription(`Prefix set to ${await getServerPrefix(axios, message.serverId)}`));
        return;
    }
    return;
});