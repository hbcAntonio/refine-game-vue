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
	background: linear-gradient(white, rgb(224, 224, 224));
	color: black;
	font-size: 1.2rem;
	min-height: 50px;
	padding: 10px;

	p {
		padding: 0;
		margin: 0;
	}

	@media screen and (max-width: 700px)  {
		background: rgba(255, 255, 255, 0.247);
		color: white;
	}
}
</style>