<template lang="pug">
.width-container
  .section-title.t-bold.t-primary.mt-5 Réinitialisation de mot de passe
  .page.px-5.py-5(v-if="username")
    .t-primary.t-20.t-bold.mb-5 Définition du nouveau mot de passe de {{username}}
    MazInput(v-model="newPassword" placeholder="Nouveau mot de passe" type="password")
    button.btn.primary.block.mt-5.w-full(@click="resetPassword") Enregistrer
  Modal(
    v-if="tooShort || unknownErr || tmpErr || unauthErr || malformedErr || success"
    @close="closeModal" @okClicked="closeModal"
  )
    Information(:msg="modalMessage" @okClicked="closeModal" :align="'left'")
</template>

<script>
import { MazInput } from 'maz-ui'
import Modal from '../reusables/Modal'
import Information from '../reusables/Information'

export default {
  name: 'CompleteResetPassword',

  props: { token: String },
  components: { MazInput, Modal, Information },
  data () { return {
    newPassword: '', username: '',
    unauthErr: false, malformedErr: false, unknownErr: false, success: false, tmpErr: false, tooShort: false,
    gotToken: false,
  } },
  computed: {
    modalMessage() {
      if (this.tooShort) return 'Le mot de passe doit faire au moins 8 caractères.';
      if (this.success) return 'Le mot de passe a été modifié. Vous pouvez maintenant vous connecter.';
      // TODO support
      if (this.unauthErr) return 'Ce lien de changement de mot de passe n\'est plus valide. Merci de refaire une '
        + 'demande de changement de mot de passe. Si le problème persiste merci de contacter le support technique.';
      // TODO support
      if (this.malformedErr) return 'Ce lien de changement de mot de passe est malformé. Merci de refaire une demande '
        + 'de changement de mot de passe. Si le problème persiste merci de contacter le support technique.';
      if (this.unknownErr || this.tmpErr) return 'Erreur inconnue. Merci de réessayer plus tard, ou de regénérer '
        + 'un lien de réinitialisation de mot de passe.'
      return '';
    },
  },
  methods: {
    tryInitData() { if(!this.token || this.gotToken) return; this.initData(); this.gotToken = true; },
    initData() {
      this.$api.getTokenLogin(this.token).then(
       o => (this.username = `${o.firstname} ${o.lastname}`)
     ).catch( e => this.errCodeToModal(e.code) );
    },
    errCodeToModal(code) {
      if(code === 401) this.unauthErr = true;
      else if(code === 400) this.malformedErr = true;
      else this.unknownErr = true;
    },
    resetPassword() {
      if(this.newPassword.length < 8) { this.tooShort = true; return; }
      this.$api.completeResetPassword(this.token, this.newPassword).then(
        () => (this.success=true)
      ).catch(
        () => (this.tmpErr=true)
      );
    },
    closeModal() {
      if (this.success) this.$router.push({name: 'login'});
      else if(this.unknownErr || this.unauthErr) this.$router.push('/')
      else if(this.tmpErr) this.tmpErr = false;
      else if(this.tooShort) this.tooShort = false;
    },
  },
  beforeMount() { this.tryInitData(); },
  watch: { token() { this.tryInitData(); } },
}
</script>
