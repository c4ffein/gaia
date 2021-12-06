<template lang="pug">
div
  iframe.daiframe(:height="iHeight" :src="iFrameSrc" title="Actualités Gaïa-Inclusion" loading="lazy")
</template>

<script>
export default {
  name: 'News',
  props: { path: String },
  data () { return { iHeight: 1000, iFrameSrc: '', lastUrlReceived: null, } },
  computed: { userId() { return this.$api.myUserId(); }, betterPath() { return this.sanit(this.path || ''); }, },
  beforeCreate() {
    this.savedCustomListener = e => {
      if (e.data.type === 1) {
        if (e.data.data?.pathname && this.sanit(e.data.data?.pathname) !== this.betterPath) {
          this.lastUrlReceived = this.sanit(e.data.data?.pathname);
          this.$router.replace({name: 'news', params: { path: this.sanit(e.data.data?.pathname) }});
        }
        this.iHeight = e.data.data.height;
      }
    };
    window.addEventListener('message', this.savedCustomListener);
  },
  destroyed() { window.removeEventListener('message', this.savedCustomListener); },
  methods: { sanit(p) { return p.slice(p[0] === '/' ? 1 : 0, p[p.length - 1] === '/' ? p.length -1 : p.length) } },
  watch: {
    betterPath: {
      immediate: true,
      handler(n) {
        const i = document.getElementsByClassName('daiframe')[0];
        if (this.lastUrlReceived !== null) return;
        if (i) i.src = `https://news.gaia-inclusion.fr/${n}`;  // Should never happen, but anyway...
        else if (this.lastUrlReceived === null) this.iFrameSrc = `https://news.gaia-inclusion.fr/${n}`;
      },
    },
  },
}
</script>

<style scoped lang="scss">
.daiframe { width: 100%; border: none; overflow-y: hidden; }
</style>
