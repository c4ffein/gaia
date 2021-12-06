<template lang="pug">
.relative(:style="cStyle")
  .absolute.dot(v-for="position in positions" :style="pStyle(position)")

</template>

<script>
export default {
  name: 'Dots',

  // TODO : Better color handling
  props: {
    'width': { default: 0, type: Number },
    'height': { default: 0, type: Number },
    'ang': { default: 90, type: Number },
    color: String,
    reversed: Boolean,
    arr: { default: () => [3, 5, 8, 11], type: Array },
    rL: Boolean,
    rT: Boolean,
  },
  computed: {
    cStyle() { return `width: ${this.width}px; height: ${this.height}px;`; },
    positions() { return this.arr.map((n, p) => this.nT(n).map(x => [x, p])).flat(1); },
  },
  methods: {
    nT(l) { return [...Array(l).keys()] },
    pStyle(position) {
      return `left: ${position[0]*(this.rL ? -16 : 16)}px; top: ${position[1]*(this.rT ? -16 : 16)}px;`;
    },
  },
}
</script>

<style scoped lang="scss">
.dot { width: 6px; height: 6px; background-color: #1144AA; border-radius: 50%; margin: 0 10px 10px 0; }
</style>
