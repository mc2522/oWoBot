const ytdl = require('ytdl-core')

const playMusic = (server, msg) => {
    // play music from link
    server.dispatcher = server.connection.play(ytdl(server.queue[0], { filter: 'audioonly' }))
    // once music finishes...
    server.dispatcher.on('finish', () => {
        // remove current music from queue and play next song if any
        server.queue.shift()
        if (server.queue[0]) {
            playMusic(server, msg)
        } else {
            msg.channel.send('Song request queue empty\n.･ﾟﾟ･(／ω＼)･ﾟﾟ･.')
        }
    })
}

module.exports = playMusic