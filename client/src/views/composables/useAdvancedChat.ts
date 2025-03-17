import { ref, watch } from 'vue'
import type { RoomUser, UserStatus, Room, LastMessage, Message } from 'vue-advanced-chat'
import { useSocket, state as socketState } from '@/socket'
import type { InitData } from '@/types/commonTypes'

const { getInitData } = useSocket()

export const useAdvancedChat = () => {
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

  watch(
    () => socketState.connected,
    async (newState) => {
      if (!newState) return

      initData.value = await getInitData('advancedchatuser')
      if (initData.value.user._id) {
        userDataFetched.value = true
      }
      console.log(initData.value)

      rooms.value = initData.value.rooms
      messages.value = initData.value.messages
    },
  )

  return {
    rooms,
    messages,
    initData,
    userDataFetched,
  }
}
