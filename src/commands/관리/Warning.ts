import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildMember, MessageEmbed } from 'discord.js'
import { BaseCommand } from '../../structures/Command'
import Embed from '../../utils/Embed'
import mongoose from 'mongoose'
import Warning from '../../schemas/Warning'
import { userWarnAdd } from '../../utils/WarnHandler'
let ObjectId = mongoose.Types.ObjectId
// @ts-ignore
String.prototype.toObjectId = function () {
  // @ts-ignore
  return new ObjectId(this.toString())
}

export default new BaseCommand(
  {
    name: 'warning',
    description: '유저에게 경고를 추가합니다',
    aliases: ['경고']
  },
  async (client, message, args) => {
    let embed = new Embed(client, 'error')
      .setTitle(`경고`)
      .setDescription('경고 명령어는 (/) 명령어로만 사용이 가능해요')
    return message.reply({ embeds: [embed] })
  },
  {
    // @ts-ignore
    data: new SlashCommandBuilder()
      .setName('경고')
      .setDescription('경고 관련 명령어 입니다')
      .addSubcommand((option) =>
        option
          .setName('지급')
          .setDescription('경고를 지급합니다')
          .addUserOption((user) =>
            user
              .setName('user')
              .setDescription('유저를 적어주세요')
              .setRequired(true)
          )
          .addStringOption((reason) =>
            reason
              .setName('사유')
              .setDescription('사유를 적어주세요')
              .setRequired(false)
          )
      )
      .addSubcommand((option) =>
        option
          .setName('차감')
          .setDescription('경고를 차감합니다')
          .addUserOption((user) =>
            user
              .setName('user')
              .setDescription('유저를 적어주세요')
              .setRequired(true)
          )
          .addStringOption((id) =>
            id
              .setName('id')
              .setDescription('차감할 경고의 ID를 적어주세요')
              .setRequired(true)
          )
      )
      .addSubcommand((option) =>
        option
          .setName('조회')
          .setDescription('경고를 조회합니다')
          .addUserOption((user) =>
            user
              .setName('user')
              .setDescription('유저를 적어주세요')
              .setRequired(true)
          )
          .addNumberOption((number) =>
            number
              .setName('페이지')
              .setDescription('페이지를 적어주세요')
              .setRequired(false)
          )
      ),
    options: {
      name: '경고',
      isSlash: true
    },
    async execute(client, interaction) {
      await interaction.deferReply({ ephemeral: true })
      let member = interaction.member as GuildMember
      member = interaction.guild?.members.cache.get(member.id) as GuildMember
      if (!member.permissions.has('MANAGE_CHANNELS'))
        return interaction.editReply('해당 명령어를 사용할 권한이 없습니다')
      let reason = interaction.options.getString('사유')
      let user = interaction.options.getUser('user')
      if (!reason) reason = '없음'

      let subcommand = interaction.options.getSubcommand()
      if (subcommand === '지급') {
        return userWarnAdd(
          client,
          user?.id as string,
          interaction.guild?.id as string,
          reason,
          interaction.user.id,
          interaction
        )
      } else if (subcommand === '차감') {
        let warningID = interaction.options.getString('id')
        // @ts-ignore
        if (!ObjectId.isValid(warningID as string))
          return interaction.editReply('찾을 수 없는 경고 아이디 입니다')
        // @ts-ignore
        let warningIDtoObject = warningID.toObjectId()
        let findWarnDB = await Warning.findOne({
          userId: user?.id,
          guildId: interaction.guild?.id,
          _id: warningIDtoObject
        })

        if (!findWarnDB)
          return interaction.editReply('찾을 수 없는 경고 아이디 입니다')

        await Warning.deleteOne({
          userId: user?.id,
          guildId: interaction.guild?.id,
          _id: warningIDtoObject
        })

        const embedRemove = new MessageEmbed()
          .setColor('#2f3136')
          .setTitle('경고')
          .setDescription('아래와 같이 경고가 삭감되었습니다')
          .addField(
            '유저',
            `<@${user?.id}>` + '(' + '`' + user?.id + '`' + ')',
            true
          )
          .addField('경고 ID', warningID as string, true)
        return interaction.editReply({ embeds: [embedRemove] })
      } else if (subcommand === '조회') {
        let warningID = interaction.options.getNumber('페이지')
        let insertRes = await Warning.find({
          userId: user?.id,
          guildId: interaction.guild?.id
        })
          .sort({ published_date: -1 })
          .limit(5)
          .skip(warningID ? (warningID - 1) * 5 : 0)
        let insertResLength = await Warning.find({
          userId: user?.id,
          guildId: interaction.guild?.id
        })
        let warns = new Array()

        if (insertRes.length == 0)
          return interaction.editReply('해당 유저의 경고 기록이 없습니다')

        insertRes.forEach((reasons) =>
          warns.push({
            name: 'ID: ' + reasons._id.toString(),
            value: '사유: ' + reasons.reason
          })
        )

        const embedList = new MessageEmbed()
          .setColor('#2f3136')
          .setTitle('경고')
          .setDescription(
            `${user?.username}님의 ${insertResLength.length}개의 경고중 최근 5개의 경고 기록입니다`
          )
          .setFooter(
            `페이지 - ${warningID ? warningID : 1}/${Math.ceil(
              insertResLength.length / 5
            )}`
          )
          .addFields(warns)

        return interaction.editReply({ embeds: [embedList] })
      }
    }
  }
)
