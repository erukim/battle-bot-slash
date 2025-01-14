import { Event } from '../structures/Event'
import CommandManager from '../managers/CommandManager'
import ErrorManager from '../managers/ErrorManager'
import { MessageCommand } from '../structures/Command'
import BotClient from '../structures/BotClient'
import { Constants, Message } from 'discord.js'
import Automod from '../schemas/autoModSchema'
import MusicSetting from '../schemas/musicSchema'
import Embed from '../utils/Embed'
import { PlayerSearchResult, Queue } from 'discord-player'
import Level from '../schemas/levelSchema'
import LevelSetting from '../schemas/levelSettingSchema'
import { check } from 'korcen'
import { checkUserPremium } from '../utils/checkPremium'
import { userWarnAdd } from '../utils/WarnHandler'
const LevelCooldown = new Map()

export default new Event('messageCreate', async (client, message) => {
  const commandManager = new CommandManager(client)
  const errorManager = new ErrorManager(client)

  if (message.author.bot) return
  if (message.channel.type === 'DM') return
  profanityFilter(client, message)
  MusicPlayer(client, message)
  LevelSystem(client, message)
  if (!message.content.startsWith(client.config.bot.prefix)) return

  const args = message.content
    .slice(client.config.bot.prefix.length)
    .trim()
    .split(/ +/g)
  const commandName = args.shift()?.toLowerCase()
  const command = commandManager.get(commandName as string) as MessageCommand

  await client.dokdo.run(message)
  try {
    await command?.execute(client, message, args)
  } catch (error: any) {
    if (error?.code === Constants.APIErrors.MISSING_PERMISSIONS) {
      return
    }
    errorManager.report(error, { executer: message, isSend: true })
  }
})

const profanityFilter = async (client: BotClient, message: Message) => {
  if (!message.content) return
  const automodDB = await Automod.findOne({ guild_id: message.guild?.id })
  if (!automodDB) return
  if (!automodDB.useing.useCurse) return
  if (!automodDB.useing.useCurseType) return
  if (automodDB.useing.useCurseIgnoreChannel?.includes(message.channel.id))
    return
  if (check(message.content)) {
    findCurse(automodDB, message, client)
  } else {
    return
  }
}

const findCurse = async (
  automodDB: any,
  message: Message,
  client: BotClient
) => {
  if (automodDB.useing.useCurseType === 'delete') {
    await message.reply('욕설 사용으로 자동 삭제됩니다').then((m) => {
      setTimeout(() => {
        m.delete()
      }, 5000)
    })
    try {
      message.delete()
    } catch (error) {
      console.log(error)
    }
  } else if (automodDB.useing.useCurseType === 'delete_kick') {
    await message.reply('욕설 사용으로 자동 삭제 후 추방됩니다').then((m) => {
      setTimeout(() => {
        m.delete()
      }, 5000)
    })
    try {
      message.delete()
      return message.member?.kick()
    } catch (e) {
      return
    }
  } else if (automodDB.useing.useCurseType === 'delete_ban') {
    await message.reply('욕설 사용으로 자동 삭제 후 차단됩니다').then((m) => {
      setTimeout(() => {
        m.delete()
      }, 5000)
    })
    try {
      message.delete()
      return message.member?.ban({ reason: '[배틀이] 욕설 사용 자동차단' })
    } catch (e) {
      return
    }
  } else if (automodDB.useing.useCurseType === 'delete_warn') {
    await message
      .reply('욕설 사용으로 자동 삭제 후 경고가 지급됩니다')
      .then((m) => {
        setTimeout(() => {
          m.delete()
        }, 5000)
      })
    try {
      message.delete()
      return userWarnAdd(
        client,
        message.author.id,
        message.guild?.id as string,
        '[배틀이] 욕설 사용 자동경고',
        client.user?.id as string
      )
    } catch (e) {
      return
    }
  }
}

const MusicPlayer = async (client: BotClient, message: Message) => {
  if (!message.guild) return
  if (!message.content) return
  const musicDB = await MusicSetting.findOne({
    channel_id: message.channel.id,
    guild_id: message.guild.id
  })
  if (!musicDB) return
  const prefix = [client.config.bot.prefix, '!', '.', '$', '%', '&', '=']
  for (const i in prefix) {
    if (message.content.startsWith(prefix[i])) return message.delete()
  }
  await message.delete()
  const errembed = new Embed(client, 'error')
  const sucessembed = new Embed(client, 'success').setColor('#2f3136')
  const user = message.guild?.members.cache.get(message.author.id)
  const channel = user?.voice.channel
  if (!channel) {
    errembed.setTitle('❌ 음성 채널에 먼저 입장해주세요!')
    return message.channel.send({ embeds: [errembed] }).then((m) => {
      setTimeout(() => {
        m.delete()
      }, 15000)
    })
  }
  const guildQueue = client.player.getQueue(message.guild.id)
  if (guildQueue) {
    if (channel.id !== message.guild.me?.voice.channelId) {
      errembed.setTitle('❌ 이미 다른 음성 채널에서 재생 중입니다!')
      return message.channel.send({ embeds: [errembed] }).then((m) => {
        setTimeout(() => {
          m.delete()
        }, 15000)
      })
    }
  }
  const song = (await client.player.search(message.content, {
    requestedBy: message.author
  })) as PlayerSearchResult
  if (!song || !song.tracks.length) {
    errembed.setTitle(`❌ ${message.content}를 찾지 못했어요!`)
    return message.channel.send({ embeds: [errembed] }).then((m) => {
      setTimeout(() => {
        m.delete()
      }, 15000)
    })
  }
  let queue: Queue
  if (guildQueue) {
    queue = guildQueue
    queue.metadata = message
  } else {
    queue = await client.player.createQueue(message.guild, {
      metadata: message
    })
  }
  try {
    if (!queue.connection) await queue.connect(channel)
  } catch (e) {
    client.player.deleteQueue(message.guild.id)
    errembed.setTitle(`❌ 음성 채널에 입장할 수 없어요 ${e}`)
    return message.channel.send({ embeds: [errembed] }).then((m) => {
      setTimeout(() => {
        m.delete()
      }, 15000)
    })
  }
  if (song.playlist) {
    const songs: string[] = []
    song.playlist.tracks.forEach((music) => {
      songs.push(music.title)
    })
    sucessembed.setAuthor(
      '재생목록에 아래 노래들을 추가했어요!',
      undefined,
      song.playlist.url
    )
    sucessembed.setDescription(songs.join(', '))
    sucessembed.setThumbnail(song.playlist.thumbnail)
    queue.addTracks(song.tracks)
    if (!queue.playing) await queue.play()
    return message.channel.send({ embeds: [sucessembed] }).then((m) => {
      setTimeout(() => {
        m.delete()
      }, 15000)
    })
  } else {
    queue.addTrack(song.tracks[0])
    sucessembed.setAuthor(
      `재생목록에 노래를 추가했어요!`,
      undefined,
      song.tracks[0].url
    )
    sucessembed.setDescription(
      `[${song.tracks[0].title}](${song.tracks[0].url}) ${song.tracks[0].duration} - ${song.tracks[0].requestedBy}`
    )
    sucessembed.setThumbnail(song.tracks[0].thumbnail)
    if (!queue.playing) await queue.play()
    return message.channel.send({ embeds: [sucessembed] }).then((m) => {
      setTimeout(() => {
        m.delete()
      }, 15000)
    })
  }
}

const LevelSystem = async (client: BotClient, message: Message) => {
  if (!message.guild) return
  if (
    [client.config.bot.prefix, '!', '.', '$', '%', '&', '=', ';;'].find((x) =>
      message.content.toLowerCase().startsWith(x)
    )
  )
    return
  const levelSetting = await LevelSetting.findOne({
    guild_id: message.guild.id
  })
  if (!levelSetting) return
  if (!levelSetting.useage) return
  if (!LevelCooldown.has(`${message.guild.id}_${message.author.id}`))
    LevelCooldown.set(`${message.guild.id}_${message.author.id}`, Date.now())
  const cooldown = LevelCooldown.get(`${message.guild.id}_${message.author.id}`)
  if (cooldown && Date.now() - cooldown > 1000) {
    const isPremium = await checkUserPremium(client, message.author)
    LevelCooldown.set(`${message.guild.id}_${message.author.id}`, Date.now())
    const levelData = await Level.findOne({
      guild_id: message.guild.id,
      user_id: message.author.id
    })
    const level = levelData ? levelData.level : 1
    const nextLevelXP = (!level ? 1 : level + 1) * 13
    const xpPerLevel = '1'.toString().includes('-') ? '1'.split('-') : '1'
    const min = parseInt(xpPerLevel[0])
    const max = parseInt(xpPerLevel[1])
    let xpToAdd = Array.isArray(xpPerLevel)
      ? min + Math.floor((max - min) * Math.random())
      : xpPerLevel
    if (isPremium) xpToAdd = Number(xpToAdd) * 1.3
    if (!levelData || (levelData && levelData.currentXP < nextLevelXP))
      return await Level.findOneAndUpdate(
        { guild_id: message.guild.id, user_id: message.author.id },
        { $inc: { totalXP: xpToAdd, currentXP: xpToAdd } },
        { upsert: true }
      )
    const newData = await Level.findOneAndUpdate(
      { guild_id: message.guild.id, user_id: message.author.id },
      { $inc: { level: 1 }, $set: { currentXP: 0 } },
      { upsert: true, new: true }
    )
    /*const levelEmbed = new Embed(client, 'info')
    levelEmbed.setTitle(`${message.author.username}님의 레벨이 올랐어요!`)
    levelEmbed.setDescription(
      `레벨이 \`LV.${level ? level : 0} -> LV.${newData.level}\`로 올랐어요!`
    )*/
    return message.reply(
      `${message.author}님의 레벨이 \`LV.${level ? level : 0} -> LV.${
        newData.level
      }\`로 올랐어요!`
    )
  }
}
