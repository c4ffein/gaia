<template lang="pug">
.flex.f-col
  canvas.border-solid.border-2.border-black(id="signature-canvas" width="400" height="150")
  //- how-to-set-flex-items-to-equal-width item-with-the-longest-cont : stackoverflow.com/questions/42656183
  .flex.w-full.my-4
    button.btn.primary.f-grow-1.mr-3(:disabled="!writingPresent" style="width: 100px;" @click="sign") Signer
    button.btn.primary.f-grow-1.ml-3(:disabled="!writingPresent" style="width: 100px;" @click="clear") Annuler

</template>

<script>
import { create } from '@/libs/simple-drawing-board/simple-drawing-board'


export default {
  name: 'MyRendezVousDetailsSignature',

  data: () => ({ sdb: null, writingPresent: false }),
  computed: { rdv() { return this.$api.obtRDV(this.id); } },
  methods: {
    mountDiv() { this.sdb = create(document.getElementById("signature-canvas")); },
    setObserver() { this.sdb.observer.on("drawBegin", () => { this.writingPresent = true; }); },
    sign() { this.$emit('signature', this.sdb.toDataURL().split(',')[1]); },
    clear() { this.sdb.clear(); this.writingPresent = false; },
  },
  mounted() { this.mountDiv(); this.setObserver(); },
}
</script>
