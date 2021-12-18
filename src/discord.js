const {Client, Intents} = require("discord.js")
const bot = new Client({intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS]})

module.exports = bot;