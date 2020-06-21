const Discord = require('discord.js')
const client = new Discord.Client()
const ytdl = require('ytdl-core')
const fs = require('fs')

// environment variables
require('dotenv').config()

var servers = {}

// log message to console when bot is ready to receive events
client.on('ready', () => {console.log("oWoBot is listening...")})

// when the client gets a message, respond accordingly
client.on('message', async msg => {

    // check if the command is to play music
    if (/!play \w+/i.test(msg.content)) {
        const args = msg.content.split(' ')

        const play = (connection, msg) => {
            var server = servers[msg.guild.id]
            server.dispatcher = connection.playStream(ytdl(server.queue[0], { filter: 'audioonly' }))
            server.queue.shift()
            server.dispatcher.on('end', () => {
                if (server.queue[0]) {
                    play(connection, msg)
                } else {
                    connection.disconnect()
                }
            })
        }
        
        const channel = client.channels.cache.get(process.env.MUSIC_ID)
        // check for channel
        if (!channel) msg.channel.send('Error: cannot locate music voice channel')
        // join the channel
        const connection = await channel.join().then(connection => {
            const dispatch = connection.play('music.mp3')

            dispatch.on('finish', () => {
                msg.reply('Music finished.')
            })
        }).catch(err => {
            console.error(err)
        })
        // if no queue in server in msg's server (guild), create new queue for server and store it in servers object
        /*if (!server[msg.guild.id])
            servers[msg.guild.id] = { queue: [] }
        var server = servers[msg.guild.id]
        server.push(ars[1])
        play(connection, msg)*/


        return
    }

    // check other commands/messages
    switch (msg.content.toLowerCase()) {
        case '!skip':
            var server = servers[msg.guild.id]
            if (server.dispatcher) server.dispatcher.end()
            return
        case '!stop':
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
        case 'ping':
            msg.channel.send('Pong')
            return
        case 'knock knock':
            msg.channel.send('Who\'s there?')
            return
        // reply with avatar pic
        case '!avatar':
            msg.reply(msg.author.displayAvatarURL())
            return
    }
    
    // if the message starts with !, then the command is not recognized since the previous conditionals didn't pass
    if (msg.content.substring(0, 1) === '!') 
        msg.reply('Command not recognized')

    return

})

// server greeting for new members
client.on('guildMemberAdd', async member => {
    const channel = client.channels.cache.find(process.env.GENERAL_ID)
    if (!channel) return
    channel.send(`Here comes ${member}!!!`)
})

client.login(process.env.DISCORD_TOKEN)