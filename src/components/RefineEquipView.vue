<template>
  <div
    v-if="equip.name"
    class="selected-equip"
    :class="{'selected-equip__broken': equip.attribute}"
  >
    <div class="img-container">
      <img :src="itemviewtable[equip.resourceviewid]">
    </div>
    <span
      v-if="equip.refineCount"
      class="refine-count"
    >+{{ equip.refineCount }}</span><span
      class="equip-name"
    >{{ equip.name }}</span>

    <input
      v-if="equip.attribute"
      type="button"
      class="repair-btn"
      value="repair"
      @click="$emit('repair')"
    >
  </div>
</template>

<script>
import * as itemviewtable from '../functions/itemviewtable.js'
export default {
	props: { equip: { type: Object, default: () => {}}},
	emits: ['repair'],
	setup() { return { itemviewtable }}
}
</script>