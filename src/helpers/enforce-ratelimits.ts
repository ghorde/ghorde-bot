import { BotRates, UserRate } from "../main";

export default () => {
  BotRates.addRateLimit("unsplash", 1000);
  UserRate.addRateLimit("unsplash", 5000);
  BotRates.addRateLimit("waifu", 200);
  UserRate.addRateLimit("waifu", 800);
};
