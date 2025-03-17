<template>
  <section class="p-4 min-w-full h-20 flex gap-2 justify-center items-center">
    <div class="text-3xl">Homepage</div>
    <div class="flex gap-6">
      <template v-for="(item, index) in buttonStates" :key="index">
        <button @click="item.onClick">{{ item.text }}</button>
      </template>
    </div>
  </section>
  <section class="grid grid-cols-2">
    <RouterView name="AdvancedChatWindow" />
    <RouterView name="BeautifulChatWindow" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { socket, socketConnectionTest } from '@/socket'

interface ButtonState {
  text: string
  onClick: () => void
}

const buttonStates = ref<ButtonState[]>([
  {
    text: 'socket test',
    onClick: socketConnectionTest,
  },
])
</script>
