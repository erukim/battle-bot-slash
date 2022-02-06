import { Event } from '../structures/Event'
import CommandManager from '../managers/CommandManager'
import ErrorManager from '../managers/ErrorManager'
import { MessageCommand } from 'src/structures/Command'
import config from 'config'
import LoggerSetting from 'src/schemas/LogSettingSchema'
import Embed from 'src/utils/Embed'
import { GuildChannel, TextChannel, User } from 'discord.js'

export default new Event('messageReactionAdd', async (client, messageReaction, user) => {
  const { guild } = messageReaction.message
    
    if(user.bot) return
    if(!guild) return
    if(messageReaction.partial) messageReaction = await messageReaction.fetch()
    if(messageReaction.message.partial) messageReaction.message = await messageReaction.message.fetch()
    let LoggerSettingDB = await LoggerSetting.findOne({guild_id: messageReaction.message.guild?.id})
    if(!LoggerSettingDB) return
    if(!LoggerSettingDB.useing.reactMessage) return

    let logChannel = messageReaction.message.guild?.channels.cache.get(LoggerSettingDB.guild_channel_id) as TextChannel
    if(!logChannel) return
    let embed = new Embed(client, 'success')
      .setTitle('반응 추가')
      .addField('채널', `<#${messageReaction.message.channel.id}>` + '(`' + messageReaction.message.channel.id + '`)')
      .addField('메시지', `[메시지](${messageReaction.message.url})`)
      .addField('유저', `<@${user.id}>` + '(`' + user.id + '`)')
      .addField('반응 이모지', messageReaction.emoji.toString())
    return await logChannel.send({embeds: [embed]})
})
