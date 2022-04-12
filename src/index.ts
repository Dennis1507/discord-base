import { Client, Intents } from 'discord.js';
import * as dotenv from 'dotenv';


const client = new Client({ intents: Intents.FLAGS.GUILDS });
dotenv.config();

client.login(process.env.token);