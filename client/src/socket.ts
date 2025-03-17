import { onMounted, reactive } from 'vue'
import type { Ref } from 'vue'
import { io } from 'socket.io-client'
import type { RoomUser, UserStatus, Room, LastMessage, Message } from 'vue-advanced-chat'
import type { InitData, SendMessageObject } from '@/types/commonTypes'

const url = 'http://localhost:3000'

interface AppState {
  connected: boolean
}

export const state = reactive<AppState>({
  connected: false,
})

export const socket = io(url)

socket.on('connect', () => {
  state.connected = true
  if (state.connected) {
    console.log('socket connected')
  }
})

socket.on('disconnect', () => {
  state.connected = false
})

/** functions */

export const useSocket = () => {
  /** 獲取使用者資訊 */
  const getInitData = async (userId: string): Promise<InitData> => {
    return new Promise((rsv, rej) => {
      /** 模擬伺服器500ms後回應 */
      setTimeout(() => {
        socket.emit('getInitData', userId, (res: InitData) => {
          if (res) {
            rsv(res)
          } else {
            rej(new Error('failed to get user data'))
          }
        })
      }, 500)
    })
  }

  /** 發送訊息 */
  const sendMessage = (data: SendMessageObject) => {
    socket.emit('sendMessage', data.roomId, data.message, (data: string | Message[]) => {
      if (typeof data === 'string') {
        console.log(data)
      }
    })
  }

  /** 接收訊息 */
  const recieveMessage = (messagesRef: Ref<Message[]>) => {
    socket.on('recieveMessage', (newMessage) => {
      messagesRef.value = [...messagesRef.value, newMessage]
    })

    return () => {
      socket.off('recieveMessage')
    }
  }

  return {
    getInitData,
    sendMessage,
    recieveMessage,
  }
}

let testCount = 1

export const socketConnectionTest = () => {
  socket.emit('connectionTest', `test No.${testCount}`, (res: string) => {
    console.log(res)
    testCount++
  })
}
