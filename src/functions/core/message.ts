import { reactive } from 'vue'
import { nanoid } from 'nanoid'
import type { MessageState } from '../../types'

const sd = reactive<MessageState>({
  messages: {}
})

const clif_add_message = (message = 'Message for me!', duration = 5000): void => {
  const id = nanoid()
  sd.messages[id] = message
  setTimeout(() => {
    delete sd.messages[id]
  }, duration)
}

export default {
  sd,
  clif_add_message
}
