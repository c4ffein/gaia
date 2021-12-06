<template lang="pug">
div
  div
    .ask-access-text Document :
    .ask-access-name Premier contrat
  .document-viewer-container
    .document-spacer
    .document-viewer
  MazBtn.btn-print Valider
  MazBtn.btn-save(outline) Imprimer
</template>

<script>
import { MazTabsContent, MazTabsContentItem, MazStepper, MazCheckbox, MazSelect, MazBtn, } from 'maz-ui'

export default {
  name: 'PrintOrSave',
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
.page-inside {
  padding: 50px;
}
.red {
  color: red;
}
.btn-print {
  width: 100%;
  margin-bottom: 20px;
}
.btn-save {
  width: 100%;
}
.ask-access-text {
  text-align: left;
  font-weight: bold;
  font-size: 18px;
  color: $primary-color;
}
.ask-access-name {
  text-align: left;
  position: relative;
  width: calc(100% - 20px);
  left: 20px;
}
.document-viewer-container {
  position: relative!important;
  min-height: 0;
  width: 100%;
  padding-top: 130%; /* 6:10 Aspect Ratio */
  position: relative; /* If you want text inside of it */
  background-color: grey;
  margin-bottom: 20px;
}
</style>
