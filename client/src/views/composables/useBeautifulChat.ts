import { ref, watch } from 'vue'
import type { User, Message } from '@/types/beautifulChatTypes'
import { useSocket } from '@/socket'
import type { InitData } from '@/types/commonTypes'
import { convertMessageAvcToBtf } from '@/composable'

const { isConnected, getInitData, recieveMessage, disconnectSocket } = useSocket('btf')

export const useBeautifulChat = () => {
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

  const messages = ref<Message[]>([])

  const initData = ref<InitData>({ ...defaultInitData })
  const userDataFetched = ref(false)

  watch(isConnected, async (newState) => {
    if (!newState) return

    initData.value = await getInitData('beautifulchatuser')
    if (initData.value.user._id) {
      userDataFetched.value = true
    }
    console.log(initData.value)

    messages.value = initData.value.messages.map((message) => {
      const convertedResult = convertMessageAvcToBtf(message)
      convertedResult.author = 'me'

      return convertedResult
    })
  })

  return {
    messages,
    initData,
    userDataFetched,
    recieveMessage,
    disconnectSocket,
  }
}
