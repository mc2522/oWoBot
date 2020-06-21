const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')

const sendHelp = require('./functions/help')
const play = require('./functions/play')

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
        case /!help/i.test(msg.content):
        case /!commands/i.test(msg.content):
            sendHelp(msg)
            break
        // play music from a link
        case /!play\s*\w*/i.test(msg.content):
            play(msg, client)
            break
        // skip current music and move on to next in queue WIP
        case /!skip/i.test(msg.content):
            var server = servers[msg.guild.id]
            if (server.dispatcher) server.dispatcher.end()
            break
        // stop current music WIP
        case /!stop/i.test(msg.content):
            var server = servers[msg.guild.id]
            if (msg.guild.voiceConnection) {
                for (let i = server.queue.length - 1; i >= 0; i--) {
                    server.queue.splice(i, 1)
                }
                server.dispatcher.end()
                console.log('Stopped the queue')
            }
            if (msg.guild.connection) msg.guild.voiceConnection.disconnect()
            break
        // ping
        case /ping/i.test(msg.content):
            msg.channel.send('Pong')
            break
        // knock knock joke
        case /knock knock/i.test(msg.content):
            msg.channel.send('Who\'s there?')
            break
        // reply with avatar pic
        case /!avatar/i.test(msg.content):
            msg.reply(msg.author.displayAvatarURL())
            break
        // if the message starts with !, then the command is not recognized since the previous conditionals didn't pass
        case /^!/.test(msg.content):
            msg.reply('Command not recognized')
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