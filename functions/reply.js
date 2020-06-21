module.exports = {
    sendHelp: (msg) => {
        msg.reply(
            "\n**help/commands**:\t`!help` or `!commands`\n" + 
            "**play music**:\t`!play [YouTube Link]`"
        )
    },
    sendFace: (msg) => {
        msg.channel.send('◕w◕')
    },
    sendPong: (msg) => {
        msg.reply('pong')
    },
    sendKnock: (msg) => {
        msg.reply('Who\'s there?')
    },
    sendAvatar: (msg) => {
        msg.reply(msg.author.displayAvatarURL())
    },
    sendError: (msg) => {
        msg.reply(`I don\'t know ${msg.content} :(`)
    }
}