<template lang="pug">
.visio-container(:class="isFull? 'visio-page' : 'visio-min'")
  .card.shadow.visio
    iframe.visio-iframe(id="visio-iframe" title="Visio iFrame" allow="camera; microphone; display-capture" :src="url")
    .close-visio-iframe(v-if="isFull" v-on:click="closeVisio")
  Modal( v-if="showConfirm" @close="closeConfirm")
    .t-bold.t-primary.t-20 Souhaitez-vous marquer le rendez-vous comme terminé, ou seulement quitter la visio en cours?
    .t-warning.t-bold.t-18.ml-3.mr-3.mt-3 Si vous marquez le rendez-vous comme terminé, vous ne pourrez plus y accéder.
    MazBtn.t-bold.w-full.mt-3(color="warning" @click="stopVisio") Terminer le rendez-vous
    MazBtn.t-bold.w-full.mt-4(@click="pauseVisio") Quitter la visio
    hr
    MazBtn.t-bold.w-full(outline @click="closeConfirm") Annuler
</template>

<script>
import { MazBtn } from 'maz-ui'
import Modal from './Modal'

export default {
  name: 'Visio',
  components: { MazBtn, Modal },
  props: { msg: String, btn: String },
  data: () => ({ showConfirm: false }),
  computed: {
    url() { return this.$api.data.visio.url},
    isFull() { return String(this.$route.name) === 'visio'; },
  },
  methods: {
    closeConfirm() { this.showConfirm = false; },
    // TODO : https://robertnyman.com/html5/postMessage/postMessage.html
    closeVisio() { this.showConfirm = true; },
    pauseVisio() { this.$api.pauseVisio(); this.showConfirm = false; },
    stopVisio() { this.$api.stopVisio().then(() => { this.showConfirm = false; }); },
  },
  mounted() {
    focus();
    const listener = addEventListener('blur', () => {
      window.setTimeout(() => {  // Needed for Firefox, when blur event fired, activeElement still not updated
        if(document.activeElement === document.getElementById('visio-iframe')) this.$router.push({name: 'visio'});
        removeEventListener(listener);
      }, 0);
    });
  },
}
</script>

<style scoped lang="scss">
.visio-page .visio-iframe { background-color: #000000; position: absolute; top: 0; left: 0; height: 100%; width: 100%; border-radius: 5px; }
.visio-close { position: absolute; top: 20px; right: 20px; }
.visio-page { position: fixed; top: 130px; left: calc(10% + 160px); right: 10%; bottom: 160px; }  // width: 400px;  }
.visio-min { z-index: 40000; position: fixed; left: 20px; bottom: -3px; width: 300px; }
.close-visio-iframe {
  position: absolute; bottom: 10px; height: 50px; border-radius: 25px; width: 50px; left: 0; right: 0;
  // width: 400px;
  background-color: #CC2222;
  left: 50%;
  -webkit-transform: translate(-50%,0);
      -ms-transform: translate(-50%,0);
          transform: translate(-50%,0);
}
// .close-visio-iframe {
//   height: 26px;
//   width: 26px;
//   color: $grey-color;
//   transition: 0.3s;
//   cursor: pointer;
// }
// .close-visio-iframe:hover { color: black; }
.close-visio-iframe:after{
  display: inline-block; font-size: 47px; position: absolute; color: white; top: -7px; left: 11px; content: "\00d7";
}
// .close-visio-iframe {
//   position: absolute;
//   top: 120px;
//   height: 50px;
//   right: 5%;
//   width: 50px;
//   // width: 400px;
//   background-color: black;
// }
// .close-visio-iframe {
//   height: 26px;
//   width: 26px;
//   color: $grey-color;
//   transition: 0.3s;
//   cursor: pointer;
// }
// .close-visio-iframe:hover { color: black; }
// .close-visio-iframe:after{
//   display: inline-block;
//   font-size: 47px;
//   position: absolute;
//   top: -13px;
//   content: "\00d7";
// }
</style>
