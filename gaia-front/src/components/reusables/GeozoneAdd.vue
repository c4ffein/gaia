<template lang="pug">
div
  .modal-header Ajout de zone géographique
  MazInput(v-model="nameValue" placeholder="Nom")
  br
  .modal-info(v-if="registered") La zone géographique a été ajoutée.

  .error-square(v-if="errorValue") {{ this.errorValue }}
  MazBtn.w-full(@click="addGeozone") Ajouter la zone géographique
  MazBtn.w-full(@click="$emit('close')") Fermer
</template>

<script>
import { MazInput, MazBtn } from 'maz-ui'


export default {
  name: 'GeozoneAdd',
  props: { msg: String },
  components: { MazInput, MazBtn },
  data() {
    return {
      nameValue: '',
      errorValue: '',
      frozen: false, // TODO?
      registered: false,
    };
  },
  methods: {
    addGeozone() {
      this.frozen = false;
      this.$api.registerGeozone(this.nameValue,).then(geozone => {
        this.registered = true;
        this.nameValue = geozone['name'];
        this.errorValue = '';
      }).catch(e => {
        if (e.code == 400){
          if (e.msgPromise) e.msgPromise.then(msg => { this.handleError(msg) });
          else this.handleError(e.msg);
        }
        else {
          this.errorValue = 'Impossible d\'ajouter la zone géographique pour une raison inconnue.'
            + '\nSi les informations fournies sont correctes et que le problème persiste, '
            + 'merci de contacter le support technique.';
        }
        this.registered = false;
      });
    },
    handleError(msg) {
      const tra = { // TODO : Put somewhere else
      };
      const tr = s => tra[s];
      let e = 'Impossible d\'ajouter la zone géographique pour les raisons suivantes :\n'
      for (const [key, value] of Object.entries(msg)) {
        e += `${tr(key)}:\n`;
        for (const val in value) console.log(val), e += `  - ${tr(value[val])}\n`;
      }
      this.errorValue = e;
    },
  },
}
</script>
