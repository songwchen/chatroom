import type {
  RoomUser,
  UserStatus,
  Room,
  LastMessage,
  Message,
  MessageFile,
} from 'vue-advanced-chat'

export type InitData = {
  user: RoomUser
  rooms: Room[]
  messages: Message[]
}

export type SendMessageObject = {
  roomId: string
  message: Message
}

export type SendMessageDetailEvent = {
  content: string
  roomId: string
  files?: MessageFile
  replyMessage?: Message
  usersTag?: Array<unknown>
}
