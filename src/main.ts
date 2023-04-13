import * as dotenv from 'dotenv'
import { Client } from 'guilded.js'

dotenv.config()

const TOKEN = process.env.GUILDED_TOKEN

const client = new Client({token: TOKEN})

client.on("ready", () => console.log(`Bot is successfully logged in`));
	client.on("messageCreated", (message) => {
			if (message.content === "test") {
				    return message.reply("test indeed");
			}
	});

client.login();
