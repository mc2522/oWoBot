const ytdl = require('ytdl-core')

module.exports = play = (msg, client) => {
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
    
    // WIP
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

    // get the music voice channel to join
    const channel = client.channels.cache.get(process.env.MUSIC_ID)
    // check for channel
    if (!channel) msg.channel.send('Error: cannot locate music voice channel')
    // join the channel
    const connection = channel.join().then(connection => {
        // play mp3 downloaded from provided YouTube link
        const dispatch = connection.play(ytdl(args[1], { filter: 'audioonly' }))
    }).catch(err => {
        console.error(err)
    })
}