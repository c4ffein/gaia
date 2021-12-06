<template lang="pug">
div
  .modal-header Ajout de catégorie de solution proposable par les partenaires
  MazInput(v-model="nameValue" placeholder="Nom")
  MazInput(v-model="iconValue" placeholder="Icone Material")
  br
  .modal-info(v-if="registered") La catégorie de solutions a été ajoutée.

  .error-square(v-if="errorValue") {{ this.errorValue }}
  MazBtn.w-full(@click="addSolution") Ajouter
  MazBtn.w-full(@click="$emit('close')") Fermer
</template>

<script>
import { MazInput, MazBtn } from 'maz-ui'


export default {
  name: 'SolutionAdd',
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
    addSolution() {
      this.frozen = false;
      this.$api.postSolution({name: this.nameValue, icon: this.iconValue}).then(solution => {
        this.registered = true;
        this.nameValue = solution['name'];
        this.iconValue = solution['icon'];
        this.errorValue = '';
      }).catch(e => {
        if (e.code == 400){
          if (e.msgPromise) e.msgPromise.then(msg => { this.handleError(msg) });
          else this.handleError(e.msg);
        }
        else {
          this.errorValue = 'Impossible d\'ajouter la catégorie de solution pour une raison inconnue.\n'
            + 'Si les informations fournies sont correctes et que le problème persiste, '
            + 'merci de contacter le support technique.';
        }
        this.registered = false;
      });
    },
    handleError(msg) {
      const tra = { // TODO : Put somewhere else
      };
      const tr = s => tra[s];
      let e = 'Impossible d\'ajouter la catégorie de solution pour les raisons suivantes :\n'
      for (const [key, value] of Object.entries(msg)) {
        e += `${tr(key)}:\n`;
        for (const val in value) console.log(val), e += `  - ${tr(value[val])}\n`;
      }
      this.errorValue = e;
    },
  },
}
</script>
