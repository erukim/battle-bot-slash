import {
  ClientOptions,
  CommandInteraction,
  Message,
  ShardingManagerOptions
} from 'discord.js'

export type LevelType =
  | 'fatal'
  | 'error'
  | 'warn'
  | 'info'
  | 'verbose'
  | 'debug'
  | 'chat'

export type EmbedType = 'default' | 'error' | 'success' | 'warn' | 'info'

export interface ErrorReportOptions {
  executer: Message | CommandInteraction | undefined
  isSend?: boolean
}

export interface IConfig {
  BUILD_VERSION: string
  BUILD_NUMBER: string | null
  githubToken?: string
  web: {
    baseurl: string
  }
  bot: {
    sharding: boolean
    shardingOptions?: ShardingManagerOptions
    options: ClientOptions
    token: string
    owners: string[]
    prefix: string
    cooldown?: number
  }
  report: {
    type: 'webhook' | 'text'
    webhook: {
      url: string
    }
    text: {
      guildID: string
      channelID: string
    }
  }
  database: {
    type: 'mongodb' | 'sqlite'
    url: string
    options: any
  }
  logger: {
    level: LevelType
    dev: boolean
  }
  email: {
    Google_Email: string
    Google_Client_Id: string
    Google_Client_Secret: string
    Google_Redirect_Url: string
    Google_Refresh_Token: string
  }
}

export interface logger {
  memberJoin?: boolean
  memberLeft?: boolean
  memberKick?: boolean
  memberBan?: boolean
  deleteMessage?: boolean
  editMessage?: boolean
  reactMessage?: boolean
  createChannel?: boolean
  deleteChannel?: boolean
  editChannel?: boolean
  joinVoiceChannel?: boolean
  leaveVoiceChannel?: boolean
  inviteGuild?: boolean
  serverSetting?: boolean
  eventCreate?: boolean
  eventEdit?: boolean
  eventDelete?: boolean
  memberUpdate?: boolean
}

export interface loggerDB {
  _id: mongoTypes.ObjectId;
  guild_id: string;
  guild_channel_id: string;
  useing: logger;
  published_date: Date
}


export interface VerifySettingDB {
  guild_id: string;
  role_id: string;
  type: verifyType;
  published_date: Date;
}

export interface VerifyDB {
  guild_id: string;
  user_id: string;
  token: string;
  status: verifyStatusType;
  published_date: Date;
}

export type verifyType = 'email' | 'captcha'| 'default'
export type verifyStatusType = 'success' | 'pending'