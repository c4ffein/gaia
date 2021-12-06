<template lang="pug">
div
  div
    .ask-access-text Demande d'accès document :
    .ask-access-name Carte nationale d'identifié
  MazBtn.btn-scan Lancer le scan
</template>

<script>
import { MazTabsContent, MazTabsContentItem, MazStepper, MazCheckbox, MazSelect, MazBtn, } from 'maz-ui'

export default {
  name: 'ScanOrDownload',
  props: {
    msg: String
  },

  components: {
    MazTabsContent, // eslint-disable-line
    MazTabsContentItem, // eslint-disable-line
    MazStepper, // eslint-disable-line
    MazCheckbox, // eslint-disable-line
    MazSelect, // eslint-disable-line
    MazBtn, // eslint-disable-line
  },

  data: () => ({
  }),
}
</script>


<style lang="scss">
.btn-scan {
  width: 100%;
}
</style>
