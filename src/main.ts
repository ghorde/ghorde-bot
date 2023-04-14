import * as dotenv from 'dotenv'
import { Client } from 'guilded.js'
import {startAxios} from './helpers'

dotenv.config()

const axios = startAxios(process.env.API_LOC)

const TOKEN = process.env.GUILDED_TOKEN

const guildedClient = new Client({token: TOKEN})

guildedClient.on("ready", () => console.log(`Bot is successfully logged in`));

guildedClient.on("messageCreated", (message) => {
	const serverId = message.serverId
	
	if (message.content === "test") {
			return message.reply("test indeed");
	}
});

guildedClient.login();
