import { ErrorEmbed, SuccessEmbed } from "../helpers/embeds";
import { CommandGeneric } from "../factories/command/command.factory";
import { BotRates, UserRate, mainLogger } from "../main";
import axios from "axios";

export const waifu = new CommandGeneric(
  "waifu",
  ["w", "ih", "instanthappiness"],
  "Sends a random waifu!",
  "waifu",
  "image",
  async (client, message) => {
    if (await BotRates.checkRateLimit("waifu")) {
      if (await UserRate.checkRateLimit("waifu", message.author.id)) {
        const res = await axios
          .get(`https://api.waifu.pics/sfw/waifu`)
          .catch(async (e) => {
            mainLogger.error(
              `Error while getting waifu image, serverId: ${message.serverId}! ${e}`
            );
            await message.reply(
              ErrorEmbed(client, message).setDescription(
                "Could not get image! Please try again later!"
              )
            );
            return;
          });
        if (res) {
          let data = res.data;
          await message.reply(
            SuccessEmbed(client, message)
              .setTitle("📷 Your Image")
              .setDescription(`Image link: ${data.url}`)
              .setImage(data.url)
          );
          return;
        }
        await message.reply(
          ErrorEmbed(client, message).setDescription(
            "Waifu API Error! Please try again later!"
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
