import { axios, mainLogger } from "../../main";
import { CommandGeneric } from "../../factories/command/command.factory";
import { ErrorEmbed, SuccessEmbed, WarningEmbed } from "../../helpers/embeds";
import { paginate } from "../../helpers/common/paginate";

interface IModelDetails {
  performance: number;
  queued: number;
  eta: number;
  type: string;
  name: string;
  count: number;
}

export const listModels = new CommandGeneric(
  "listModels",
  ["lm"],
  "Lists models in the horde!",
  "lm <page number>",
  "DIFFUSION",
  async (client, message, args) => {
    if (parseInt(args[0])) {
      const availableModels = await axios.get("sh/models").catch((err) => {
        mainLogger.error(err);
        const response = ErrorEmbed(client, message)
          .setTitle("🎨 Diffusion!")
          .setDescription(
            `Unable to get list of models ;-;\nYou can also check out the web client for this!\nClick [here](https://ghorde.kodski.com/models) to visit the web client!`
          );
        message.reply(response);
        return;
      });
      if (!availableModels) {
        return;
      }
      const commandsPage = paginate<IModelDetails>(
        availableModels.data,
        parseInt(args[0]),
        5
      );
      if (commandsPage) {
        message.reply(
          SuccessEmbed(client, message)
            .setDescription(
              "You can also check out the web client for this!\nClick [here](https://ghorde.kodski.com/models) to visit the web client!"
            )
            .setFooter(
              `Viewing ${commandsPage.page}/${commandsPage.total_pages}`
            )
            .setTitle("Help")
            .addFields(
              commandsPage.data.map((model) => {
                return {
                  name: `${model.name} - ${model.type}`,
                  value: `Performance: ${model.performance}\nQueued: ${model.queued}\nETA: ${model.eta}\nCount: ${model.count}`,
                  inline: true,
                };
              })
            )
        );
        return;
      }
    }
    message.reply(
      ErrorEmbed(client, message).setDescription(
        "Provide Page Number\nYou can also check out the web client for this!\nClick [here](https://ghorde.kodski.com/models) to visit the web client!"
      )
    );
    return;
  }
);
