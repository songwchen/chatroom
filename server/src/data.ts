import type { RoomUser as AvcUser, Room, Message as AvcMessage } from 'vue-advanced-chat'
import type { User as BtfUser, Message as BtfMessage } from './types/beautifulChatTypes'

/* --------------------
  用戶清單
-------------------- */

export const avcUserList: AvcUser[] = [
  {
    _id: 'advancedchatuser',
    username: 'Advanced Chat',
    avatar: '',
    status: {
      state: 'offline',
      lastChanged: '',
    },
  },
  {
    _id: 'beautifulchatuser',
    username: 'Beautiful Chat',
    avatar: '',
    status: {
      state: 'offline',
      lastChanged: '',
    },
  },
]

export const btfUserList: BtfUser[] = [
  {
    id: 'advancedchatuser',
    name: 'Advanced Chat',
    imageUrl: '',
  },
  { id: 'beautifulchatuser', name: 'Beautiful Chat', imageUrl: '' },
]

/* --------------------
  聊天室清單 (只有 advanced chat 會用到)
-------------------- */

export const roomList: Room[] = []

export const roomAndUserMap: Record<string, string[]> = {
  1: ['advancedchatuser', 'beautifulchatuser'],
}

const getRoomUser = (roomId: string) => {
  const targetUsers = roomAndUserMap[roomId]
  if (!targetUsers) return []

  return avcUserList.filter((user) => targetUsers.includes(user._id))
}

const getRoomName = (roomId: string) => {
  const targetUsers = roomAndUserMap[roomId]
  if (!targetUsers) {
    return 'Room Not found'
  }

  return targetUsers.join(' / ')
}

roomList.push({
  roomId: '1',
  roomName: getRoomName('1'), // 目前是 "advancedchatuser / beautifulchatuser"
  avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
  users: getRoomUser('1'), // 目前是 ['advancedchatuser', 'beautifulchatuser']
  // users: [], // 目前是 ['advancedchatuser', 'beautifulchatuser']
})

/* --------------------
  模擬訊息清單
-------------------- */

export const messageList: Record<string, AvcMessage[]> = {}

const simulateGetMessage = (roomId: string, reset: boolean = true) => {
  let targetMessages = messageList[roomId] ?? []
  if (!targetMessages) return []

  const newMessages: AvcMessage[] = []

  for (let i = 0; i < 20; i++) {
    newMessages.push({
      _id: String(reset ? i : targetMessages.length + i),
      content: `${reset ? '' : 'paginated'} Room:${1} message ${i + 1}`,
      senderId: 'beautifulchatuser',
      username: 'Beautiful Chat',
      date: '13 November',
      timestamp: '10:20',
    })
  }

  return newMessages
}

messageList['1'] = simulateGetMessage('1')
