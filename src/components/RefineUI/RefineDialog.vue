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

<style lang="scss" scoped>
.dialog {
	border-radius: 10px;
	background: white;
	color: black;
	font-size: 1.2rem;
	min-height: 50px;
	padding: 10px;

	p {
		padding: 0;
		margin: 0;
	}
}
</style>