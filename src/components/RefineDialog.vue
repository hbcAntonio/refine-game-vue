<template>
  <div class="dialog">
    <p>{{ dialog }}</p>
  </div>
</template>

<script>
export default {
	props: { dialog: { type: String, default: 'Hello there! Who can I help you?'}}
}
</script>