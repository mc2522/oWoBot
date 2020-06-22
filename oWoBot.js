const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')

const reply = require('./modules/reply')
const player = require('./modules/player')

// environment variables
require('dotenv').config()

var servers = {}

// log message to console when bot is ready to receive events
client.on('ready', () => {console.log("oWoBot is listening...")})

// when the client gets a message, respond accordingly
client.on('message', async msg => {
    // if receiving message from bot, don't do anything 
    if (msg.author.bot) return
    // check commands/messages
    switch (true) {
        // if need for help or commands, send commands back
        case /!help\s*/i.test(msg.content):
        case /!commands\s*/i.test(msg.content):
            reply.sendHelp(msg)
            break
        // play music from a link
        case /!play\s*\w*/i.test(msg.content):
            player.play(servers, msg, client)
            break
        // pause music
        case /!pause\s*/i.test(msg.content):
            if (servers[msg.guild.id]) {
                player.pause(servers[msg.guild.id], msg)
            } else {
                msg.reply('No audio playing')
            }
            break
        case /!resume\s*/i.test(msg.content):
            if (servers[msg.guild.id]) {
                player.resume(servers[msg.guild.id], msg)
            } else {
                msg.reply('No audio paused')
            }
            break
        // skip current music and move on to next in queue WIP
        case /!skip\s*/i.test(msg.content):
            if (servers[msg.guild.id]) {
                player.skip(servers[msg.guild.id], msg)
            } else {
                msg.reply('No audio playing')
            }
            break
        case /^(?!!).*owo.*/i.test(msg.content):
            reply.sendFace(msg)
            break
        // ping
        case /ping\s*/i.test(msg.content):
            reply.sendPong(msg)
            break
        // knock knock joke
        case /knock knock\s*/i.test(msg.content):
            reply.sendKnock(msg)
            break
        // reply with avatar pic
        case /!avatar\s*/i.test(msg.content):
            reply.sendAvatar(msg)
            break
        // if the message starts with !, then the command is not recognized since the previous conditionals didn't pass
        case /^!/.test(msg.content):
            reply.sendError(msg)
            break
    }
})

// server greeting for new members
client.on('guildMemberAdd', async member => {
    const channel = client.channels.cache.find(process.env.GENERAL_ID)
    if (!channel) return
    channel.send(`Here comes ${member}!!!`)
})

client.login(process.env.DISCORD_TOKEN)