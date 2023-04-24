import { mainLogger } from "../main";
import { CommandGeneric } from "../factories/command/command.factory";
import { SuccessEmbed } from "../helpers/embeds";

export const edit = new CommandGeneric(
  "edit",
  ["e"],
  "Editttt",
  "Edits itself after 5 secs",
  "dev",
  async (client, message) => {
    const response = SuccessEmbed(client, message)
      .setTitle("🏓 Pong!")
      .setDescription(
        `Latency is ${
          message.createdAt.getTime() - Date.now()
        }ms. API Latency is ${Math.round(client.ws.ping)}ms`
      );
    const reply = await message.reply(response);
    let i = 0;
    (async () => {
      while (i < 5) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        i++;
        mainLogger.info(i);
        await reply.edit(`Edits itself after ${5 - i} secs`);
      }
    })();
    return;
  }
);
