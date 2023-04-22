import { axios, mainLogger } from '../../main';
import { CommandGeneric } from '../../factories/command/command.factory';
import { ErrorEmbed, SuccessEmbed } from '../../helpers/embeds';

interface IModelDetails {
    performance: number
    queued: number
    eta: number
    type: string
    name: string
    count: number
}

export const modelStats = new CommandGeneric('modelStats', ['ms'], 'Directly gives you the stats of your mentioned model!', 'ms <model name>', 'DIFFUSION', async(client, message, args) => {
    if (args.length > 0) {
        const availableModels = await axios.get('sh/models').catch((err) => {
            mainLogger.error(err)
            const response = ErrorEmbed(client, message).setTitle('🎨 Diffusion!').setDescription(`Unable to get list of models ;-;`);
            message.reply(response)
            return
        })
        if (!availableModels) {
            return
        }
        const modelName = args.join(' ');
        const models: Array<IModelDetails> = availableModels.data;
        const model = models.find(model => model.name === modelName);
        if (model) {
            message.reply(SuccessEmbed(client, message).setTitle("Model Stats").addFields([
                {
                    name: `${model.name} - ${model.type}`,
                    value: `Performance: ${model.performance}\nQueued: ${model.queued}\nETA: ${model.eta}\nCount: ${model.count}`,
                    inline: true
                }
            ]));
            return;
        }
        message.reply(ErrorEmbed(client, message).setDescription("Model not found!"));
        return;
    }
    message.reply(ErrorEmbed(client, message).setDescription("Provide Page Number"))
    return;
});