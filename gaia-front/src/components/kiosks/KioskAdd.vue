<template lang="pug">
div
  .modal-header.mb-5 Ajout de kiosque
  MazInput.mb-4(v-model="nameValue" placeholder="Nom du kiosque")
  .modal-info.mb-4(v-if="registered")
    | Le kiosque vient d'être créer et peut à tout moment être trouvé dans la liste des kiosques.
    | Il est maintenant possible d'ajouter le premier compte utilisateur de ce kiosque.

  .error-square.mb-4(v-if="errorValue") {{ this.errorValue }}
  MazBtn.w-full.mb-3(v-if="!registered" @click="addKiosk") Ajouter le kiosque
  MazBtn.w-full.mb-3(v-if="registered" @click="$emit('userFindProceedClicked', idValue)")
    | Procéder à l'ajout d'utilisateur
  MazBtn.w-full(@click="$emit('close')") Fermer
</template>

<script>
import { MazInput, MazBtn } from 'maz-ui'


export default {
  name: 'KioskAdd',
  props: { msg: String },
  components: { MazInput, MazBtn },
  data() {
    return {
      registered: false,
      nameValue: '',
      idValue: '',
      errorValue: '',
      frozen: false,
    };
  },
  methods: {
    addKiosk() {
      this.frozen = false;
      this.$api.postKiosk({name: this.nameValue}).then(kiosk => {
        this.nameValue = kiosk['name'];
        this.idValue = kiosk['id'];
        this.errorValue = '';
        this.registered = true;
        this.$emit('kioskAdded', kiosk.id);
      }).catch(e => {
        if (e.code == 400){
          if (e.msg) this.handleError(e.msg);
          else if (e.msgPromise) e.msgPromise.then(msg => { this.handleError(msg) });
        }
        else {
          this.errorValue = 'Impossible d\'ajouter le kiosque pour une raison inconnue. \n'
            + 'Si les informations fournies sont correctes et que le problème persiste, '
            + 'merci de contacter le support technique.';
        }
        this.registered = false;
      });
    },
    handleError(msg) {
      const tra = { // TODO : Put somewhere else
        'username': 'Nom d\'utilisateur',
        'This field is required.': 'Requis',
        'email': 'Email',
        'Enter a valid email address.': 'Adresse invalide.',
        'user with this email address already exists.': 'Un utilisateur possède déjà cette adresse email',
      }
      const tr = s => tra[s];
      let e = 'Impossible d\'ajouter l\'utilisateur pour les raisons suivantes :\n'
      for (const [key, value] of Object.entries(msg)) {
        e += `${tr(key)}:\n`;
        for (const val in value) console.log(val), e += `  - ${tr(value[val])}\n`;
      }
      this.errorValue = e;
    },
  },
}
</script>
