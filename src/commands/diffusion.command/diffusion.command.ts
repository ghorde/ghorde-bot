import { axios, mainLogger } from '../../main';
import { CommandGeneric } from '../../factories/command/command.factory';
import { ErrorEmbed, SuccessEmbed, WarningEmbed } from '../../helpers/embeds';
import { AxiosResponse } from 'axios';
import { getFlags, removeFlags } from 'helpers/common/flag-detector';

export const diffusion = new CommandGeneric('diffusion', ['diff', 'd'], 'Uses stable horde to generate ai art!', 'diff <prompt>', 'DIFFUSION', async(client, message, args) => {
    let response = SuccessEmbed(client, message).setTitle('🎨 Diffusion!').setDescription(`Request recieved!`);
    const {model} = getFlags(args.join(' '))
    const prompt = removeFlags(args.join(' '))
    const availableModels = await axios.get('sh/models').catch((err) => {
        mainLogger.error(err)
        const response = ErrorEmbed(client, message).setTitle('🎨 Diffusion!').setDescription(`Request failed!`);
        message.reply(response)
        return
    })
    if (!availableModels) {
        return
    }
    const availableModelNames = availableModels.data.map((model: any) => model.name)
    mainLogger.info(model)
    if (model) {
        if (!availableModelNames.includes(model)) {
            const response = ErrorEmbed(client, message).setTitle('🎨 Diffusion!').setDescription(`Model not found!`);
            message.reply(response)
            return
        }
    }
    const diffMessage = await message.reply(response)
    const putReq: false | AxiosResponse<any, any> = await axios.post('sh/generate', {prompt, model}).catch((err) => {
        mainLogger.error(err)
        const response = ErrorEmbed(client, message).setTitle('🎨 Diffusion!').setDescription(`Request failed!`);
        diffMessage.edit(response)
        return false
    })
    if (!putReq) {
        return
    }
    (async () => {if (putReq.data.id) {
        const id = putReq.data.id
        let getReq = await axios.get(`sh/check/${id}`)
        mainLogger.info(getReq.data)
        let {finished} = getReq.data
        let update = 0;
        while (!finished) {
            const getReq = await axios.get(`sh/check/${id}`)
            mainLogger.info(getReq.data)
            const {processing, restarted, waiting, done, faulted, wait_time, queue_position, kudos, is_possible} = getReq.data
            const newFinished = getReq.data.finished
            const response = WarningEmbed(client, message).setTitle('🎨 Diffusion!')
            response.setDescription(`Request recieved! Refreshing every 2 seconds.\n***Update:${update}***`)
            response.addField('Finished', finished, true)
            response.addField('Processing', processing, true)
            response.addField('Restarted', restarted, true)
            response.addField('Waiting', waiting, true)
            response.addField('Done', done, true)
            response.addField('Faulted', faulted, true)
            response.addField('Wait Time', wait_time, true)
            response.addField('Queue Position', queue_position, true)
            response.addField('Kudos', kudos, true)
            response.addField('Is Possible', is_possible, true)
            await diffMessage.edit(response)
            finished = newFinished;
            if (!faulted) {
                if (is_possible) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    update+=1;
                    finished = newFinished;
                } else {
                    await diffMessage.edit(ErrorEmbed(client, message).setTitle('🎨 Diffusion!').setDescription(`Request failed! Reason: Not Possible`))
                    return
                }
            } else {
                await diffMessage.edit(ErrorEmbed(client, message).setTitle('🎨 Diffusion!').setDescription(`Request failed! Reason: Faulted`))
                return
            }
        }
        getReq = await axios.get(`sh/get/${id}`)
        const {generations} = getReq.data
        if (generations) {
            if (generations[0]) {
                const {img, seed, id, censored, worker_id, worker_name, model, state} = generations[0]
                const response = SuccessEmbed(client, message).setTitle('🎨 Diffusion!').setDescription(`Your art is ready!`);
                response.addFields([{name: 'Seed', value: seed, inline: true}, {name: 'ID', value: id, inline: true}, {name: 'Censored', value: censored, inline: true}, {name: 'Worker ID', value: worker_id, inline: true}, {name: 'Worker Name', value: worker_name, inline: true}, {name: 'Model', value: model, inline: true}, {name: 'State', value: state, inline: true}])
                response.setImage(img)
                await diffMessage.edit(response)
                return
            }
            await diffMessage.edit(ErrorEmbed(client, message).setTitle('🎨 Diffusion!').setDescription(`Request failed! Reason: No Images!`))
            return
        }
        await diffMessage.edit(ErrorEmbed(client, message).setTitle('🎨 Diffusion!').setDescription(`Request failed! Reason: No generations`))
        return
    }})();
    return;
});