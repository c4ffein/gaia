<template lang="pug">
.width-container
  .section-title.t-bold.t-primary Réinitialisation de mot de passe
  .page.px-5.py-5
    .t-primary.t-20.t-bold.mb-5
      | Entrez votre adresse email ou identifiant pour procéder à la réinitialisation du mot de passe
    MazInput(v-model="login" placeholder="Votre email ou identifiant")
    button.btn.primary.block.mt-5.w-full(@click="sendEmail") Envoyer
  Modal(v-if="showModalInfo" @close="modalMessage=''" @okClicked="okClicked")
    Information(:msg="modalMessage" @okClicked="okClicked" :align="'left'")
</template>

<script>
import { MazInput } from 'maz-ui'
import Modal from '../reusables/Modal'
import Information from '../reusables/Information'

export default {
  name: 'AskResetPassword',

  components: { MazInput, Modal, Information },
  data () { return { login: '', showModalInfo: false } },
  computed: {
    modalMessage() { return 'Un mail vous a été envoyé avec la procédure à suivre pour procéder à la réinitialisation '
      + 'de votre mot de passe, si un compte Gaïa est bien associé à cette adresse.\n\nSi vous êtes sur de posséder '
      + ' un compte et que vous ne recevez pas ce mail, merci de vérifier votre dossier spam. Dans le cas où vous '
      + 'n\'avez rien reçu après quelques minutes, merci de contacter le support technique.' },
  },
  methods: {
    // TODO : Handle error
    sendEmail() { this.$api.askResetPassword(this.login).then(
      () => { this.showModalInfo = true; }
    ).catch(() => console.log('f')); },
    okClicked() { this.$router.push('/'); }
  },
}
</script>
