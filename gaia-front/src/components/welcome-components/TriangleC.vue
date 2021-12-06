<template lang="pug">
.relative(:style="cStyle")
  .absolute.bg-cover(:style="bgStyle")

</template>

<script>
export default {
  name: 'TriangleC',

  // TODO : Better color handling
  props: {
    'width': { default: 0, type: Number },
    'height': { default: 0, type: Number },
    'ang': { default: 90, type: Number },
    color: String,
    reversedX: Boolean,
    reversedY: Boolean,
  },
  computed: {
    limitHeight() { return `min-height: 100%; max-height: 100%;`; },
    cStyle() { return `width: ${this.width}px; height: ${this.height}px;`; },
    mPLR() { return this.reversedX ? `${this.reversedY ? '0 100%, 0 0' : '100% 0, 100% 100%'}` : `0 100%, 100% 0`; },
    pLR() { return `clip-path: polygon(${this.reversedY ? '100% 100%' : '0 0'}, ${this.mPLR});` },
    bgStyle() { return `height: 100%; width: 100%; background: linear-gradient(${this.ang}deg, #3377CC 0%, ${this.color} 35%, ${this.color} 100%);  ${this.pLR}` },
  },
}
</script>

<style scoped lang="scss">
</style>
