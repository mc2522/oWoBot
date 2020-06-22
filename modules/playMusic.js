const ytdl = require('ytdl-core')

const playMusic = (server, msg) => {
    server.dispatcher = server.connection.play(ytdl(server.queue[0], { filter: 'audioonly' }))
    server.dispatcher.on('finish', () => {
        server.queue.shift()
        if (server.queue[0]) {
            playMusic(server, msg)
        } else {
            msg.channel.send('Song request queue empty, `!play [YouTube Link]` to play music from YouTube')
            server.connection.disconnect()
        }
    })
}

module.exports = playMusic