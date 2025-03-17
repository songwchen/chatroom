export type User = {
  id: string
  name: string
  imageUrl: string
}

export type Message = {
  author: string | 'me'
  type: 'text' | 'emoji' | 'file'
  id: string
  isEdited: boolean
  data: {
    [key: string]: any
  }
}

export type QuickReply = Omit<Message, 'isEdited'> & { suggestions: Array<string> }

export type ColorSchema = {
  header: {
    bg: string
    text: string
  }
  launcher: {
    bg: string
  }
  messageList: {
    bg: string
  }
  sentMessage: {
    bg: string
    text: string
  }
  receivedMessage: {
    bg: string
    text: string
  }
  userInput: {
    bg: string
    text: string
  }
}
