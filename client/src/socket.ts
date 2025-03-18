import { onMounted, reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { io } from 'socket.io-client'
import type {
  RoomUser,
  UserStatus,
  Room,
  LastMessage,
  Message as AvcMessage,
} from 'vue-advanced-chat'
import type { Message as BtfMessage } from './types/beautifulChatTypes'
import type { InitData, SendMessageObject } from '@/types/commonTypes'
import { convertMessageAvcToBtf } from './composable'

const url = 'http://localhost:3000'

export const useSocket = (name: string) => {
  const socket = io(url)
  const isConnected = ref(false)
  const socketName = name

  socket.on('connect', () => {
    isConnected.value = true
    if (isConnected) {
      console.log(`${socketName} socket connected`)
    }
  })

  /** 獲取使用者資訊 */
  const getInitData = (userId: string): Promise<InitData> => {
    /** 模擬伺服器500ms後回應 */
    return new Promise((rsv, rej) => {
      socket.emit('getInitData', userId, (res: InitData) => {
        setTimeout(() => {
          if (res) {
            console.log(`successful get ${name} user data`)
            rsv(res)
          } else {
            rej(new Error('failed to get user data'))
          }
        }, 500)
      })
    })
  }

  /** 發送訊息 */
  const sendMessage = (data: SendMessageObject) => {
    socket.emit('sendMessage', data.roomId, data.message, (data: string | AvcMessage[]) => {
      if (typeof data === 'string') {
        console.log(data)
      }
    })
  }

  /** 接收訊息 */
  const recieveMessage = (
    messagesRef: Ref<AvcMessage[]> | Ref<BtfMessage[]>,
    type: 'avc' | 'btf',
  ) => {
    socket.on('recieveMessage', (newMessage) => {
      console.log('client recieved message: ', newMessage)
      if (type === 'avc') {
        messagesRef.value = [...messagesRef.value, newMessage]
      }
      if (type === 'btf') {
        // console.log('newMessage: ', newMessage)
        // console.log('convertMessageAvcToBtf(newMessage): ', convertMessageAvcToBtf(newMessage))
        messagesRef.value = [...messagesRef.value, newMessage]
        console.log('recieved btf messages: ', messagesRef.value)
      }
    })

    return () => {
      socket.off('recieveMessage')
    }
  }

  const disconnectSocket = () => {
    socket.disconnect()
  }

  return {
    isConnected,
    getInitData,
    sendMessage,
    recieveMessage,
    disconnectSocket,
  }
}

// let testCount = 1

// export const socketConnectionTest = () => {
//   socket.emit('connectionTest', `test No.${testCount}`, (res: string) => {
//     console.log(res)
//     testCount++
//   })
// }
