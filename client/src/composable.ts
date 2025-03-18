import type { SendMessageDetailEvent } from './types/commonTypes'
import type { Message as AvcMessage } from 'vue-advanced-chat'
import type { Message as BtfMessage } from './types/beautifulChatTypes'

export const convertMessageAvcToBtf = (avcMessage: AvcMessage): BtfMessage => {
  return {
    author: avcMessage.senderId,
    type: 'text',
    id: avcMessage._id,
    isEdited: false,
    data: {
      text: avcMessage.content ?? '',
    },
  }
}
