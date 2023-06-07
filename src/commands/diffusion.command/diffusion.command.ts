import { axios, mainLogger } from "../../main";
import { CommandGeneric } from "../../factories/command/command.factory";
import { ErrorEmbed, SuccessEmbed, WarningEmbed } from "../../helpers/embeds";
import { AxiosResponse } from "axios";
import { getArgs, removeArgs, removeFlags, parseFlags } from "../../helpers/common/flag-detector";
import { Embed, Message } from "guilded.js";

export const diffusion = new CommandGeneric(
  "diffusion",
  ["diff", "d"],
  "Uses stable horde to generate ai art!",
  "diff <prompt>",
  "DIFFUSION",
  async (client, message, args) => {
    let response = SuccessEmbed(client, message)
      .setTitle("🎨 Diffusion!")
      .setDescription(`Request recieved!`);
    const { model, token, height, width } = getArgs(args.join(" "));
    const { karras } = parseFlags(args.join(" "));
    let prompt = removeArgs(args.join(" "));
    prompt = removeFlags(prompt);
    const availableModels = await axios.get("sh/models").catch((err) => {
      mainLogger.error(err);
      const response = ErrorEmbed(client, message)
        .setTitle("🎨 Diffusion!")
        .setDescription(`Request failed!`);
      message.reply(response);
      return;
    });
    if (!availableModels) {
      return;
    }
    const availableModelNames = await availableModels.data.map(
      (model: any) => model.name
    );
    mainLogger.info([model, availableModelNames]);
    if (model) {
      if (!availableModelNames.includes(model)) {
        const response = ErrorEmbed(client, message)
          .setTitle("🎨 Diffusion!")
          .setDescription(
            `Model not found!\nHint: Use \`lm\` to get a list of available models!\nHint: Use \`ms\` to get stats of a model!\nHint: Use single quotes to pass in flags!`
          );
        message.reply(response);
        return;
      }
    }
    const diffMessage = await message.reply(response);
    const putReq: false | AxiosResponse<any, any> = await axios
      .post("sh/generate", { prompt, model, token, height, width, karras, guildedId: message.author.id })
      .catch((err) => {
        mainLogger.error(err);
        const response = ErrorEmbed(client, message)
          .setTitle("🎨 Diffusion!")
          .setDescription(`Request failed!`);
        diffMessage.edit(response);
        return false;
      });
    if (!putReq) {
      return;
    }
    const forceEditMessage = async (message: Message, embed: Embed, count: number = 1) => {
      if (count <= 5) {
        await message.edit(embed).catch((err) => {
          mainLogger.warn(err);
          count += 1;
          forceEditMessage(message, embed, count);
        });
      }
      return;
    }
    (async () => {
      if (putReq.data.id) {
        console.log(putReq.data)
        const id = putReq.data.id;
        let getReq = await axios.get(`sh/check/${id}`);
        let { finished } = getReq.data;
        let update = 0;
        while (!finished) {
          let checkStatusHelper = 0;
          const checkStatus: () => Promise<
            AxiosResponse<any, any>
          > = async () => {
            const getReq = await axios
              .get(`sh/check/${id}`)
              .catch(async (e) => {
                checkStatusHelper += 1;
                if (checkStatusHelper < 5) {
                  mainLogger.error(
                    `❌ Check Request Failed, Retrying, Recursion is not good D: ${e}`
                  );
                  const res = await checkStatus();
                  return res;
                } else {
                  mainLogger.error(
                    `❌ Request ultimately failed, sending error! ${e}`
                  );
                  const response = ErrorEmbed(client, message)
                    .setTitle("🎨 Diffusion!")
                    .setDescription(`Request failed!`);
                  forceEditMessage(diffMessage, response);
                  throw new Error(
                    `❌ Request ultimately failed, throwing error! ${e}`
                  );
                }
              });
            return getReq;
          };
          const getReq = await checkStatus();
          if (!getReq) {
            return;
          }
          const {
            processing,
            restarted,
            waiting,
            done,
            faulted,
            wait_time,
            queue_position,
            kudos,
            is_possible,
          } = getReq.data;
          const newFinished = getReq.data.finished;
          const response = WarningEmbed(client, message).setTitle(
            "🎨 Diffusion!"
          );
          response.setDescription(
            `Request recieved! Refreshing every 5 seconds.\n***Update:${update}***\n(if this pauses, the command is broken.. devs are finding a fix)`
          );
          response.addField("Custom Token", putReq.data.token ? "Yes" : "No", true);
          response.addField("Model", putReq.data.model ? putReq.data.model : "unknown", true);
          response.addField("Finished", finished, true);
          response.addField("Processing", processing, true);
          response.addField("Restarted", restarted, true);
          response.addField("Waiting", waiting, true);
          response.addField("Done", done, true);
          response.addField("Faulted", faulted, true);
          response.addField("Wait Time", wait_time, true);
          response.addField("Queue Position", queue_position, true);
          response.addField("Kudos", kudos, true);
          response.addField("Is Possible", is_possible, true);
          response.addField("Prompt", putReq.data.prompt ? putReq.data.prompt : "unknown", true);
          await forceEditMessage(diffMessage, response);
          finished = newFinished;
          if (!faulted) {
            if (is_possible) {
              await new Promise((resolve) => setTimeout(resolve, 5000));
              update += 1;
              finished = newFinished;
            } else {
              await forceEditMessage(diffMessage, ErrorEmbed(client, message).setTitle("🎨 Diffusion!").setDescription(`Request failed! Reason: Not Possible`));
              return;
            }
          } else {
            await forceEditMessage(diffMessage, ErrorEmbed(client, message).setTitle("🎨 Diffusion!").setDescription(`Request failed! Reason: Not Faulted`));
            return;
          }
        }
        getReq = await axios.get(`sh/get/${id}`);
        const { generations } = getReq.data;
        if (generations) {
          if (generations[0]) {
            const {
              img,
              seed,
              id,
              censored,
              worker_id,
              worker_name,
              model,
              state,
            } = generations[0];
            const response = SuccessEmbed(client, message)
              .setTitle("🎨 Diffusion!")
              .setDescription(`Your art is ready!`);
            response.addFields([
              { name: "Custom Token", value: putReq.data.token ? "Yes" : "No", inline: true},
              { name: "Seed", value: seed, inline: true },
              { name: "ID", value: id, inline: true },
              { name: "Censored", value: censored, inline: true },
              { name: "Worker ID", value: worker_id, inline: true },
              { name: "Worker Name", value: worker_name, inline: true },
              { name: "Model", value: model, inline: true },
              { name: "State", value: state, inline: true },
              { name: "Prompt", value: putReq.data.prompt ? putReq.data.prompt : "unknown", inline: true}
            ]);
            response.setImage(img);
            await forceEditMessage(diffMessage, response);
            return;
          }
          await forceEditMessage(diffMessage, ErrorEmbed(client, message).setTitle("🎨 Diffusion!").setDescription(`Request failed! Reason: No Images!`));
          return;
        }
        await forceEditMessage(diffMessage, ErrorEmbed(client, message).setTitle("🎨 Diffusion!").setDescription(`Request failed! Reason: No Generations!`));
        return;
      }
    })();
    return;
  }
);
