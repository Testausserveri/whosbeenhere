const fs = require("fs/promises")
const bot = require("./discord")
const Discord = require("discord.js")

/**
 * Check whether a channel has 
 * @param {Discord.Snowflake} channelId 
 * @returns 
 */
const hasMemberLog = async (channelId) => {
    const logFile = `./logs/${channelId}.log`
    const fileExists = async path => !!(await fs.stat(path).catch(e => false));
    return await fileExists(logFile)
}

/**
 * Add header to a new log file
 * @param {Discord.Snowflake} channelId 
 */
const initMemberLog = async (channelId) => {
    const logFile = `./logs/${channelId}.log`
    fs.appendFile(logFile, `Member journal for channel #${channelCache[channelId].channel.name}\n${new Date().toISOString()}\n\n`)
}

const channelCache = {}
/**
 * Cache a channel and create/load a journal if needed
 * @param {Discord.Snowflake} channelId 
 */
const cacheChannel = async (channelId) => {
    try {
        if (channelCache[channelId]?.channel == undefined) {
            const logExists = await hasMemberLog(channelId)
            
            channelCache[channelId] = {
                log: logExists ? await loadMemberLog(channelId) : [],
                channel: await bot.channels.fetch(channelId)
            }

            if (!logExists) await initMemberLog(channelId)

            console.log(`Channel #${channelCache[channelId].channel.name} cached`)
        }
    } catch (e) {
        console.error(`Couldn't cache ${channelId} channel: ${e.message}`)
    }

}

/**
 * Returns all members of a voice channel
 * @param {Discord.Snowflake} channelId 
 * @returns {Array<Discord.Snowflake>} Array of user id's
 */
const fetchVoiceMembers = async (channelId) => {
    await cacheChannel(channelId) // caches the Discord channel if it isn't yet
    if (!channelCache[channelId]?.channel) return [] // this may occur if the channel wasn't cached succesfully, e.g. no permissions
    return (channelCache[channelId].channel.members).map(member => ({
        id: member.user.id,
        tag: member.user.tag
    }))
}

/**
 * Load existing member journal from a file
 * @param {Discord.Snowflake} channelId 
 * @returns {Array<Discord.Snowflake>} Array of member id's
 */
const loadMemberLog = async (channelId) => {
    const contents = await fs.readFile(`./logs/${channelId}.log`, "utf8")
    const members = contents.split("\n").filter(line => /^[0-9]+\t.*#[0-9]{4}$/.test(line.trim())).map(line => {
        const [id, tag] = line.split("\t")
        return {
            id, tag
        }
    })

    return members
}

/**
 * Fetch voice channel members and log not-seen-before members to the journal
 * @param {*} channelId 
 */
const updateMemberLog = async (channelId) => {
    const members = await fetchVoiceMembers(channelId)
    for (const member of members) {
        if (!channelCache[channelId].log.find(m => m.id == member.id)) {
            console.log(`Logged new member ${member.tag} on channel ${channelId}`)
            fs.appendFile(`./logs/${channelId}.log`, `${member.id}\t${member.tag}\n`)
            channelCache[channelId].log.push(member)
        }
    }
}

module.exports = {hasMemberLog, initMemberLog, loadMemberLog, updateMemberLog}
