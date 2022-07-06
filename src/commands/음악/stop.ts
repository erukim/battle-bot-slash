import { BaseCommand, SlashCommand } from '../../structures/Command'
import UserDB from '../../schemas/userSchema'
import Embed from '../../utils/Embed'
import { SlashCommandBuilder, userMention } from '@discordjs/builders'
import DateFormatting from '../../utils/DateFormatting'

export default new BaseCommand(
  {
    name: 'stop',
    description: '노래 재생을 정지합니다',
    aliases: ['정지', 'musicstop']
  },
  async (client, message, args) => {
    let errembed = new Embed(client, 'error')
      .setTitle(`❌ 에러 발생`)
      .setColor('#2f3136')
    let sucessembed = new Embed(client, 'success')
      .setColor('#2f3136')
    if(!message.guild) {
      errembed.setDescription('이 명령어는 서버에서만 사용이 가능합니다.')
      return message.reply({embeds: [errembed]})
    }
    const queue = client.player.getQueue(message.guild.id);
    if (!queue || !queue.playing) {
      errembed.setDescription('노래가 재생 중이지 않습니다.')
      return message.reply({embeds: [errembed]});
    }

    queue.stop()
    queue.destroy()
    sucessembed.setDescription(`${userMention(message.author.id)}님의 요청으로 노래 재생이 정지되었어요!`)
    return message.reply({embeds: [sucessembed]});
  },
  {
    data: new SlashCommandBuilder()
    .setName('정지')
    .setDescription('노래 재생을 정지합니다'),
    options: {
      name: '정지',
      isSlash: true
    },
    async execute(client, interaction) {
      await interaction.deferReply({ ephemeral: true })
      let errembed = new Embed(client, 'error')
        .setTitle(`❌ 에러 발생`)
        .setColor('#2f3136')
      let sucessembed = new Embed(client, 'success')
        .setColor('#2f3136')
      if(!interaction.guild) {
        errembed.setDescription('이 명령어는 서버에서만 사용이 가능합니다.')
        return interaction.editReply({embeds: [errembed]})
      }
      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) {
        errembed.setDescription('노래가 재생 중이지 않습니다.')
        return interaction.editReply({embeds: [errembed]});
      }
      queue.stop()
      queue.destroy()
      sucessembed.setDescription(`${userMention(interaction.user.id)}님의 요청으로 노래 재생이 정지되었습니다.`)
      return interaction.editReply({embeds: [sucessembed]});
    }
  }
)

