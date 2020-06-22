module.exports = {
    sendHelp: (msg) => {
        msg.reply(
            '\n**help/commands**:\t`!help` or `!commands`\n' + 
            '**play music**:\t`!play [YouTube Link]`\n' +
            '**pause music:**\t`!pause`\n' +
            '**resume music:**\t`!resume\n`' + 
            '**skip music:**\t`!skip`\n' +
            '( ﾟДﾟ)b'
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
        msg.reply('I don\'t know what is: `' + msg.content + '`\n｡･ﾟﾟ･(>д<)･ﾟﾟ･｡')
    }
}
