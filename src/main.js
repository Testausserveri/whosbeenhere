#! /usr/bin/env node
require("dotenv").config()
if (!process.env.DISCORD_TOKEN) throw new Error("Environmental variable DISCORD_TOKEN is missing")

const fs = require("fs/promises")
const { updateMemberLog } = require("./journal")
const bot = require("./discord")

// Creates ./logs/ regardless of whether it exists
fs.mkdir("./logs/", { recursive: true })

bot.on("ready", async () => {
    console.log(`Bot is ready! ${bot.user.tag}`)
})

bot.on("voiceStateUpdate", async (oldState, newState) => {
    if (oldState.channelId) updateMemberLog(oldState.channelId)
    if (newState.channelId) updateMemberLog(newState.channelId)
})

bot.login(process.env.DISCORD_TOKEN)
