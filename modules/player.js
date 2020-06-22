const ytdl = require('ytdl-core')

module.exports = {
    play: (servers, msg, client) => {
        const args = msg.content.split(/\s+/)
        // check if number of args is 2, since command + link
        if (args.length != 2) {
           msg.reply('Wrong command\n**Play music command:** `!play [YouTube Link]`')
           return
        }
        // check if url is valid
        if (!/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/.test(args[1])) {
            msg.reply('Give me an actual YouTube link pls')
            return
        }
        // play music
        const playMusic = (server, connection) => {
            console.log(server)
            server.dispatcher = connection.play(ytdl(server.queue[0], { filter: 'audioonly' }))
            server.dispatcher.on('finish', () => {
                msg.channel.send('Moving to next song')
                server.queue.shift()
                if (server.queue[0]) {
                    playMusic(server, connection)
                } else {
                    connection.disconnect()
                }
            })
        }
        // get the music voice channel to join
        const channel = client.channels.cache.get(process.env.MUSIC_ID)
        // check for channel
        if (!channel) msg.channel.send('Error: cannot locate music voice channel')
        // join the channel
        const connection = channel.join().then(connection => {
            // check if there is an array (queue) in the queues object with the associated msg.guild.id, initialize if none
            if (!servers[msg.guild.id])
                servers[msg.guild.id] = { queue: [] }
            let server = servers[msg.guild.id]
            // if there is a song in queue, just push song into queue and don't play immediately
            if (server.queue.length > 0) {
                server.queue.push(args[1])
                msg.reply(`Added to song request queue position: **${server.queue.length}**`)
                return
            }
            // otherwise push the song into queue and play immediately
            server.queue.push(args[1])
            playMusic(server, connection)
        }).catch(err => {
            console.error(err)
        })
    },
    pause: (server, msg) => {
        if (server.dispatcher) {
            server.dispatcher.pause()
        } else {
            msg.reply('No video playing...')
        }
    },
    resume: (server, msg) => {
        if (server.dispatcher) {
            server.dispatcher.resume()
        } else {
            msg.reply('No video paused...')
        }
    },
} 