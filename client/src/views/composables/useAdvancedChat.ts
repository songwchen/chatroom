import { onMounted, ref, watch } from 'vue'
import type { RoomUser, UserStatus, Room, LastMessage, Message } from 'vue-advanced-chat'
import { useSocket } from '@/socket'
import type { InitData } from '@/types/commonTypes'

export const useAdvancedChat = () => {
  const { isConnected, getInitData, sendMessage, recieveMessage, disconnectSocket } =
    useSocket('avc')

  const defaultInitData: InitData = {
    user: {
      _id: '',
      username: '',
      avatar: '',
      status: {
        state: 'offline',
        lastChanged: '',
      },
    },
    rooms: [],
    messages: [],
  }

  const rooms = ref<Room[]>([])
  const messages = ref<Message[]>([])

  const initData = ref<InitData>({ ...defaultInitData })
  const userDataFetched = ref(false)

  watch(isConnected, async (newState) => {
    console.log('isConnected changed !')
    if (!newState) return

    initData.value = await getInitData('advancedchatuser')
    if (initData.value.user._id) {
      userDataFetched.value = true
    }
    console.log('initData.value: ', initData.value)

    rooms.value = initData.value.rooms
    messages.value = initData.value.messages
  })

  return {
    isConnected,
    rooms,
    messages,
    initData,
    userDataFetched,
    sendMessage,
    recieveMessage,
    disconnectSocket,
  }
}
