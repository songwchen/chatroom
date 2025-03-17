<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showFile="true"
      :showEdition="true"
      :showDeletion="true"
      :deletionConfirmation="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="false"
      :messageStyling="messageStyling"
      :messageMargin="messageMargin"
      :showMinimizeButton="true"
      @onType="handleOnType"
      @edit="editMessage"
    />
    <!-- :minimize="handleMinimize"
    :icons="icons" -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { User, Message } from '@/types/beautifulChatTypes'

// 參與者資料
const participants = reactive<User[]>([
  {
    id: 'user1',
    name: 'Matteo',
    imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4',
  },
  {
    id: 'user2',
    name: 'Support',
    imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4',
  },
])

// 其他響應式資料
const titleImageUrl = ref('https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png')
const messageList = ref<Message[]>([
  { id: '1', type: 'text', author: `me`, data: { text: `Say yes!` }, isEdited: false },
  { id: '2', type: 'text', author: `user1`, data: { text: `No.` }, isEdited: false },
])
const newMessagesCount = ref(0)
const isChatOpen = ref(true)
const showTypingIndicator = ref('')
const alwaysScrollToBottom = ref(false)
const messageStyling = ref(true)
const messageMargin = reactive({ system: '25px auto' })
const acceptedFileTypes = reactive(['image/*', 'audio/*'])

// 顏色設定
const colors = reactive({
  header: {
    bg: '#4e8cff',
    text: '#ffffff',
  },
  launcher: {
    bg: '#4e8cff',
  },
  messageList: {
    bg: '#ffffff',
  },
  sentMessage: {
    bg: '#4e8cff',
    text: '#ffffff',
  },
  receivedMessage: {
    bg: '#eaeaea',
    text: '#222222',
  },
  userInput: {
    bg: '#f4f7f9',
    text: '#565867',
  },
  emojiPicker: {
    bg: 'white',
    text: '#b8c3ca',
  },
})

// 方法
const sendMessage = (text: string) => {
  if (text.length > 0) {
    newMessagesCount.value = isChatOpen.value ? newMessagesCount.value : newMessagesCount.value + 1
    onMessageWasSent({ id: '0', author: 'support', type: 'text', data: { text }, isEdited: false })
  }
}

const onMessageWasSent = (message: Message) => {
  // 當使用者發送訊息時調用
  messageList.value = [...messageList.value, message]
}

const openChat = () => {
  // 當使用者點擊按鈕打開聊天時調用
  isChatOpen.value = true
  newMessagesCount.value = 0
}

const closeChat = () => {
  // 當使用者點擊按鈕關閉聊天時調用
  isChatOpen.value = false
}

const handleScrollToTop = () => {
  // 當使用者滾動訊息列表到頂部時調用
  // 可以利用分頁功能加載更多訊息
  console.log('Scrolled to top')
}

const handleOnType = () => {
  console.log('Emit typing event')
}

const editMessage = (message: Message) => {
  const m = messageList.value.find((m) => m.id === message.id)
  if (m) {
    m.isEdited = true
    m.data.text = message.data.text
  }
}
</script>
