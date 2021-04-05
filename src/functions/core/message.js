import { reactive } from 'vue'
import { nanoid } from 'nanoid'

const sd = reactive({
	messages: {
		
	}
})

const clif_add_message = (message='Message for me!', duration=5000) => {
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