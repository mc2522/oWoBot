const playMusic = require('./playMusic')

module.exports = {
    // command for play music
    play: (servers, msg) => {
        const args = msg.content.split(/\s+/)
        // check if number of args is 2, since command + link
        if (args.length != 2) {
            msg.reply('Wrong command\n(｀Д´)' + '\n**Play music command:** `!play [YouTube Link]`')
            return
        }
        // check if url is valid
        if (!/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/.test(args[1])) {
            msg.reply('Give me an actual YouTube link pls\n[○･｀Д´･○]')
            return
        }
        // check if in voice channel, and has an initialized server
        if (servers[msg.guild.id] && servers[msg.guild.id].connection) {
            if (!servers[msg.guild.id].queue)
                servers[msg.guild.id].queue = [] 
            // servers[msg.guild.id].connection = connection
            let server = servers[msg.guild.id]
            // if there is a song in queue, just push song into queue and don't play immediately
            if (server.queue.length > 0) {
                server.queue.push(args[1])
                msg.reply(`Added to song request queue position: **${server.queue.length}**\n(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧`)
                return
            }
            // otherwise push the song into queue and play immediately
            server.queue.push(args[1])
            playMusic(server, msg)
        } else {
            msg.reply('Join a channel first!\nヽ( `д´*)ノ')
        }
    },
    // command for stop and disconnect from voice channel
    disconnect: (server, msg) => {
        // check if there's a queue and reset it
        if (server.queue) 
            server.queue = []
        // disconnect from voice channel
        if (server.connection) {
            server.connection.disconnect()
            server.dispatcher = undefined
            server.connection = undefined
        } else {
            msg.reply('Not playing anything!\n（；¬＿¬)')
        }
    },
    // command for pause music
    pause: (server, msg) => {
        if (server.dispatcher) {
            server.dispatcher.pause()
        } else {
            msg.reply('No audio playing...\n(；¬д¬)')
        }
    },
    // command for resume paused audio
    resume: (server, msg) => {
        if (server.dispatcher) {
            server.dispatcher.resume()
        } else {
            msg.reply('No audio paused...\nヽ( `д´*)ノ')
        }
    },
    // command for skip current audio
    skip: (server, msg) => {
        if (server.dispatcher) {
            // get rid of first audio 
            server.queue.shift()
            // if something is left in the queue, play
            if (server.queue.length > 0) {
                playMusic(server, msg)
            } else {
                msg.reply('Song request queue empty, `!play [YouTube Link]` to add to queue or `!stop`/`!disconnect` to stop\n.･ﾟﾟ･(／ω＼)･ﾟﾟ･.')
            }
        } else {
            msg.reply('Song request queue empty\n.･ﾟﾟ･(／ω＼)･ﾟﾟ･.')
        }
    }
} 