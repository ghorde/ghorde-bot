import * as dotenv from 'dotenv'
import { Client } from 'guilded.js'
import { startAxios } from './helpers'
import { configureLogger } from './helpers/configure-logger'
import pino, { LevelWithSilent } from 'pino'

dotenv.config()

const TOKEN = process.env.GUILDED_TOKEN

const axios = startAxios(process.env.API_LOC)
export const mainLogger = configureLogger(pino, 'main', (process.env.LOGGER_LEVEL).toLowerCase() as LevelWithSilent)

const client = new Client({token: TOKEN})

client.on("ready", () => console.log(`Bot is successfully logged in`));
client.on("messageCreated", (message) => {
	mainLogger.info(`👂 Recieved message from guild: ${message.serverId}`)
	if (message.content === "test") {
			return message.reply("test indeed");
	}
});
client.login();
