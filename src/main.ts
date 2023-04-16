import * as dotenv from 'dotenv'
import { Client, Embed, Message } from 'guilded.js'
import { startAxios } from './helpers'
import { configureLogger } from './helpers/configure-logger'
import pino, { LevelWithSilent } from 'pino'
import { getServerPrefix } from './helpers/common/get-server-prefix'
import { aliasUnique, commands, getCommandRouter } from './commands';
import { ErrorEmbed } from './helpers/embeds'
import { BotRateLimiter, UserRateLimiter } from './helpers/common/timeout-manager'

dotenv.config()

const TOKEN = process.env.GUILDED_TOKEN
export const defaultPrefix = process.env.DEFAULT_PREFIX

export const axios = startAxios(process.env.API_LOC)
export const mainLogger = configureLogger(pino, 'main', (process.env.LOGGER_LEVEL).toLowerCase() as LevelWithSilent)

export const UserRate = new UserRateLimiter()
export const BotRates = new BotRateLimiter()
BotRates.addRateLimit('unsplash', 1000)
UserRate.addRateLimit('unsplash', 10000)

const client = new Client({token: TOKEN})

if (aliasUnique(commands)) {
	mainLogger.info(`👌 All aliases are unique!`)
	const commandRouter = getCommandRouter(commands)

	client.on("ready", () => console.log(`Bot is successfully logged in`));

	client.on("messageCreated", async(message: Message) => {
		if(message.authorId == "dN6OpaGd") return; // ignore bot messages
		const {serverId} = message
		mainLogger.info(`👂 Recieved message from guild: ${serverId}`)
		const prefix = await getServerPrefix(axios, serverId)
		if (message.content.startsWith(prefix)) {
			mainLogger.info(`💻 Recieved command from guild: ${serverId}`)
			const [command, ...args] = message.content.slice(prefix.length).trim().split(/ +/g).filter((word) => word.length > 0);
			const commandFunction = commandRouter.get(command);
			if (commandFunction) {
				mainLogger.info(`📥 Executing command from guild: ${serverId}`)
				const embed = await commandFunction(client, message, args, prefix);
				return;
			} else {
				mainLogger.info(`📥 Command not found from \nguild: ${serverId}\nuser: ${message.authorId}`)
				return message.reply(ErrorEmbed(client, message).setDescription(`Command not found!`))
			}
		}
	});
	client.login();
} else {
	mainLogger.fatal(`🔥 Commands need to have unique aliases!`)
}