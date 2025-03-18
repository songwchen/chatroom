// server.ts - 使用 TypeScript 的聊天室後端服務器
import express from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'
import type {
  RoomUser,
  UserStatus,
  Room,
  LastMessage,
  Message as AvcMessage,
  UsernameOptions,
} from 'vue-advanced-chat'
import type { Message as BtfMessage } from './types/beautifulChatTypes'
import { roomList, avcUserList, messageList, roomAndUserMap } from './data'

/** 創建 Express 應用 */
const app = express()
app.use(cors())

/** 創建 HTTP 服務器 */
const server = http.createServer(app)

/** function */
const getUserRooms = (userId: string): Room[] => {
  const result = roomList.filter((room) => room.users.find((user) => user._id === userId))
  return result ?? []
}

const getRoomMessages = (roomId: string): AvcMessage[] => {
  const result = messageList[roomId]
  return result ?? []
}

/** 配置 Socket.io 並允許跨域 */
const io = new Server(server, {
  cors: {
    origin: '*', // 在生產環境中應該限制為您的前端域名
    methods: ['GET', 'POST'],
  },
})

const userIdAndSocketMap: Record<string, Socket> = {}

/** 處理 Socket.io 連接 */
io.on('connection', (socket: Socket) => {
  console.log('new user connected: ', socket.id)

  /** 連接測試 */
  socket.on('connectionTest', (testString, cb) => {
    cb(`server recieved string: ${testString} / id: ${socket.id}`)
  })

  /** 處理用戶加入 */
  socket.on('getInitData', (userId: string, cb) => {
    const targetUserData = avcUserList.find((userData) => userData._id === userId)

    if (targetUserData) {
      userIdAndSocketMap[userId] = socket
    }

    const targetRooms = getUserRooms(userId)
    const targetMessages = getRoomMessages('1')

    const returnData = {
      user: targetUserData,
      rooms: targetRooms,
      messages: targetMessages,
    }

    cb(returnData)
  })

  /** 使用者發送訊息 */
  socket.on('sendMessage', (roomId: string, message: AvcMessage, cb) => {
    let targetMessages = messageList[roomId]
    if (!targetMessages) {
      cb('Room Not Found')
    }

    if (!message._id) {
      message._id = String(targetMessages.length)
    }

    const recieverID =
      roomAndUserMap[roomId].find((userId: string) => userId !== message.senderId) ?? message._id

    // AVC rerecievingMessage
    // const recievingMessage = { ...message }

    // Btf rerecievingMessage
    const recievingMessage: BtfMessage = {
      author: message.senderId,
      type: 'text',
      id: message._id,
      isEdited: false,
      data: {
        text: message.content,
      },
    }

    userIdAndSocketMap[recieverID].emit('recieveMessage', recievingMessage)
  })
})

/** 簡單的健康檢查端點 */
app.get('/', (req, res) => {
  res.send('聊天服務器正在運行')
})

/** 啟動服務器 */
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`服務器在端口 ${PORT} 上運行`)
})
