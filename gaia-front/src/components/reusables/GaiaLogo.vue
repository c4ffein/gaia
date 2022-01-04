<template lang="pug">
div
  .relative.h-full
    svg.shell(style="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0, 0, 400,258.1005586592179")
      path(:d="innerPath" :fill="cInsideColor" fill-rule="evenodd")

    .shelled.flex.f-ai-center
      .w-full.relative(style="padding-bottom: 65%;")
        svg.filling-logo(xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0, 0, 400,258.1005586592179")
          path(:d="innerPath" :fill="cInsideColor" fill-rule="evenodd")

        svg.filling-logo(xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0, 0, 400,258.1005586592179")
          path(:d="outerPath" :fill="cOutsideColor" :stroke="cOutsideColor" stroke-width="1px" stroke-linecap="butt" stroke-dasharray="0" fill-rule="evenodd")

</template>

<script>
import { gaiaLogoInnerPath, gaiaLogoOuterPath } from '@/assets/amnyos-assets.js'

export default {
  name: 'GaiaLogo',

  props: { insideColor: String, outsideColor: String },
  data: () => ({ innerPath: gaiaLogoInnerPath, outerPath: gaiaLogoOuterPath }),
  computed: {
    cInsideColor() { return this.insideColor || '#1155AA'; },
    cOutsideColor() { return this.outsideColor || '#999999'; },
  },
}
</script>

<style lang="scss">
.shell { height: 100%; visibility: hidden; }
.shelled { position: absolute; top: 0; left: 0; bottom: 0; right: 0; }
.filling-logo { position: absolute; top: 0; left: 0; bottom: 0; right: 0; }
</style>
