import { ErrorEmbed, SuccessEmbed } from "../helpers/embeds";
import { CommandGeneric } from "../factories/command/command.factory";
import { BotRates, UserRate, axios, mainLogger } from "../main";

export const randomImage = new CommandGeneric(
  "randomImage",
  ["rimg", "ri"],
  "Sends a random image from unsplash!",
  "randomImage",
  "image",
  async (client, message) => {
    if (await BotRates.checkRateLimit("unsplash")) {
      if (await UserRate.checkRateLimit("unsplash", message.author.id)) {
        const res = await axios
          .post(`/image/random`, { id: message.author.id })
          .catch(async (e) => {
            mainLogger.error(
              `Error while getting image, serverId: ${message.serverId}! ${e}`
            );
            await message.reply(
              ErrorEmbed(client, message).setDescription(
                "Could not get image! Please try again later!"
              )
            );
            return;
          });
        if (res) {
          if (res.data.success) {
            let data = res.data;
            await message.reply(
              SuccessEmbed(client, message)
                .setTitle("📷 Your Image")
                .setDescription(`Image id: ${data.data[0].id}`)
                .setImage(data.data[0].imgLink)
            );
            return;
          }
          await message.reply(
            ErrorEmbed(client, message).setDescription(
              "Remote API Error! Please try again later!"
            )
          );
          return;
        }
        await message.reply(
          ErrorEmbed(client, message).setDescription(
            "Bot API Error! Please try again later!"
          )
        );
        return;
      }
      await message.reply(
        ErrorEmbed(client, message).setDescription(
          "You are being ratelimited! Please try again later!"
        )
      );
      return;
    }
    await message.reply(
      ErrorEmbed(client, message).setDescription(
        "The bot is being ratelimited! Please try again later!"
      )
    );
    return;
  }
);
