import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePaage',
      component: () => import('@/views/HomePage.vue'),
      children: [
        {
          path: '/',
          components: {
            AdvancedChatWindow: () => import('@/views/AdvancedChat.vue'),
            BeautifulChatWindow: () => import('@/views/BeautifulChat.vue'),
          },
        },
      ],
    },
  ],
})

export default router
