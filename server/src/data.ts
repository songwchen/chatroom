import type {
  RoomUser,
  UserStatus,
  Room,
  LastMessage,
  Message,
} from 'vue-advanced-chat'

// 用戶清單
export const userList: RoomUser[] = [
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

export const roomList: Room[] = []

export const roomAndUserMap: Record<string, string[]> = {
  1: ['advancedchatuser', 'beautifulchatuser'],
}

const getRoomUser = (roomId: string) => {
  const targetUsers = roomAndUserMap[roomId]
  if (!targetUsers) return []

  return userList.filter((user) => targetUsers.includes(user._id))
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
  roomName: getRoomName('1'),
  avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
  users: getRoomUser('1'),
})

export const messageList: Record<string, Message[]> = {}

const simulateGetMessage = (roomId: string, reset: boolean = true) => {
  let targetMessages = messageList[roomId] ?? []
  if (!targetMessages) return []

  const newMessages: Message[] = []

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
