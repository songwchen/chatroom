<template>
  <div>
    <vue-advanced-chat
      height="calc(100dvh - 80px)"
      :current-user-id="currentUserId"
      :rooms="rooms"
      :rooms-loaded="userDataFetched"
      :messages="messages"
      :messages-loaded="messagesLoaded"
      @send-message="handleSendMessage($event.detail[0])"
      @fetch-messages="fetchMessages($event.detail[0])"
      :room-info-enabled="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useAdvancedChat } from './composables/useAdvancedChat'
import { register } from 'vue-advanced-chat'
import type { RoomUser, UserStatus, Room, LastMessage, Message } from 'vue-advanced-chat'
import type { SendMessageDetailEvent, SendMessageObject } from '@/types/commonTypes'

const {
  isConnected,
  rooms,
  messages,
  initData,
  userDataFetched,
  sendMessage,
  recieveMessage,
  disconnectSocket,
} = useAdvancedChat()

const roomId = ref('0')

interface FetchMessagesOptions {
  reset?: boolean
}

interface FetchMessagesEvent {
  options?: FetchMessagesOptions
}

register()

const currentUserId = computed<string>(() => {
  return initData.value.user._id
})

const messagesLoaded = ref<boolean>(false)

const addMessages = (reset?: boolean): Message[] => {
  const newMessages: Message[] = []

  for (let i = 0; i < 20; i++) {
    newMessages.push({
      _id: String(reset ? i : messages.value.length + i),
      content: `${reset ? '' : 'paginated'} message ${i + 1}`,
      senderId: 'beautifulchatuser',
      username: 'Beautiful Chat',
      date: '13 November',
      timestamp: '10:20',
    })
  }

  return newMessages
}

const fetchMessages = ({ options = {} }: FetchMessagesEvent): void => {
  setTimeout(() => {
    if (options.reset) {
      return
    }
    messages.value = [...addMessages(), ...messages.value]
    messagesLoaded.value = true

    // addNewMessage()
  })
}

const handleSendMessage = (message: SendMessageDetailEvent): void => {
  console.log(message)

  const newMessage: Message = {
    _id: '',
    content: message.content,
    senderId: currentUserId.value,
    timestamp: new Date().toString().substring(16, 21),
    date: new Date().toDateString(),
  }

  sendMessage({
    roomId: message.roomId,
    message: newMessage,
  })

  messages.value = [...messages.value, newMessage]
}

let cleanupRecieveMessage: (() => void) | null = null

onMounted(() => {
  cleanupRecieveMessage = recieveMessage(messages, 'avc')
})

onUnmounted(() => {
  if (cleanupRecieveMessage) cleanupRecieveMessage()
  disconnectSocket()
})

// const addNewMessage = (): void => {
//   setTimeout(() => {
//     messages.value = [
//       ...messages.value,
//       {
//         _id: messages.value.length,
//         content: 'NEW MESSAGE',
//         senderId: 'advancedchatuser',
//         timestamp: new Date().toString().substring(16, 21),
//         date: new Date().toDateString(),
//       },
//     ]
//   }, 50)
// }
</script>
