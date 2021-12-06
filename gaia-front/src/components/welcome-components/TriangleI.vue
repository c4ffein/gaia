<template lang="pug">
div
  .bg-cover(:style="bgStyle")

</template>

<script>
export default {
  name: 'TriangleI',

  props: { imageBg: String, reversedX: Boolean, reversedY: Boolean, },
  computed: {
    limitHeight() { return `min-height: 100%; max-height: 100%;`; },
    mPLR() { return this.reversedX ? `${this.reversedY ? '0 100%, 0 0' : '100% 0, 100% 100%'}` : `0 100%, 100% 0`; },
    pLR() { return `clip-path: polygon(${this.reversedY ? '100% 100%' : '0 0'}, ${this.mPLR});` },
    bgStyle() { return `height: 100%; width: 100%; background-image: url(${this.imageBg}); ${this.pLR}` },
  },
}
</script>

<style scoped lang="scss">
</style>
