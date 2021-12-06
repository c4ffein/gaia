<template lang="pug">
div
  .modal-header Modification de solution proposable par les partenaires
  MazInput(v-model="selected.name" placeholder="Nom")
  MazInput(v-model="selected.icon" placeholder="Icone Material")
  br
  .modal-info(v-if="registered") La catégorie de solutions a été ajoutée.

  .error-square(v-if="errorValue") {{ this.errorValue }}
  MazBtn.w-full(@click="addSolution") Modifier
  MazBtn.w-full(@click="$emit('close')") Fermer
</template>

<script>
import { MazInput, MazBtn } from 'maz-ui'


export default {
  name: 'SolutionAdd',
  props: { msg: String, selected: Object },
  components: { MazInput, MazBtn },
  data() { return { errorValue: '', frozen: false, registered: false, }; }, // Frozen todo?
  methods: {
    addSolution() {
      this.frozen = false;
      this.$api.putSolution(this.selected.id, {name: this.selected.name, icon: this.selected.icon}).then(() => {
        this.registered = true; this.errorValue = '';
      }).catch(e => {
        if (e.code == 400){
          if (e.msgPromise) e.msgPromise.then(msg => { this.handleError(msg) });
          else this.handleError(e.msg);
        }
        else {
          this.errorValue = 'Impossible de modifier la catégorie de solution pour une raison inconnue.'
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
      let e = 'Impossible de modifier la catégorie de solution pour les raisons suivantes :\n'
      for (const [key, value] of Object.entries(msg)) {
        e += `${tr(key)}:\n`;
        for (const val in value) console.log(val), e += `  - ${tr(value[val])}\n`;
      }
      this.errorValue = e;
    },
  },
}
</script>
