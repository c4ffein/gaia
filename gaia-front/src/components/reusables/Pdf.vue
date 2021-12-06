<template lang="pug">
div(:style="cstyle")
  div(id="pdf-viewer" :style="cstyle")
</template>

<script>
import PDFObject from '@/libs/pdfobject/pdfobject'


export default {
  name: 'Pdf',

  props: { b64: String, cstyle: String },
  data: () => ({
    embedded: false,
    isMounted: false,  // dirty ?
  }),
  watch: { b64() { if(this.isMounted) this.reembedPDF(); }, },
  methods: {
    embedPDF() { if (!this.embedded && this.b64) { PDFObject.embed(this.b64, "#pdf-viewer"); this.embedded = true; } },
    reembedPDF() { if (this.b64) { PDFObject.embed(this.b64, "#pdf-viewer"); this.embedded = true; } },
  },
  mounted() { this.embedPDF(); this.isMounted=true; },

}
</script>
