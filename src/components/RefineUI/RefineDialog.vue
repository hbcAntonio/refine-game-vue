<template>
	<div class="dialog">
		<p>{{ dialog }}</p>
	</div>
</template>

<script>
export default {
	props: { dialog: { type: String, default: 'Hello there! How can I help you?'}}
}
</script>