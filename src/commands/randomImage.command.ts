import { ErrorEmbed, SuccessEmbed } from "../helpers/embeds";
import { CommandGeneric } from "../factories/command/command.factory";
import {axios, mainLogger} from '../main';

export const randomImage = new CommandGeneric('randomImage', ['rimg', 'ri'], 'Sends a random image from unsplash!', 'randomImage', 'image', async(client, message) => {
    const res = await axios.post(`/image/random`, {id: message.author.id}).catch(async(e) => {
        mainLogger.error(`Error while getting image, serverId: ${message.serverId}! ${e}`)
        await message.reply(ErrorEmbed(client, message).setDescription('Could not get image! Please try again later!'));
        return
    })
    if (res) {
        if (res.data.success) {
            let data = res.data
            mainLogger.info(`Got image! serverId: ${message.serverId}`)
            mainLogger.info(data)
            await message.reply(SuccessEmbed(client, message).setTitle("🖼 Your Image").setDescription(`Image id: ${data.data[0].id}`).setImage(data.data[0].imgLink));
            return
        }
        await message.reply(ErrorEmbed(client, message).setDescription('Remote API Error! Please try again later!'));
        return
    }
    await message.reply(ErrorEmbed(client, message).setDescription('Bot API Error! Please try again later!'));
    return;
});