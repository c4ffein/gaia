<template lang="pug">
div
  .t-bold.t-20.t-primary.mb-5 Changement de mot de passe
  .t-error.t-bold.my-3(v-if="lastErrorMsgs['old']") Ancien mot de passe incorrect
  MazInput.mb-5(v-model="oldPassword" placeholder="Ancien mot de passe")
  .t-error.t-bold.my-3(v-if="lastErrorMsgs['new']") Le nouveau mot de passe doit faire au minimum 8 caractères
  MazInput(v-model="newPassword" placeholder="Nouveau mot de passe")
  button.btn.primary.block.mt-5.w-full(@click="changePassword") Enregistrer
  //- TODO : Better presentation
  //-| {{lastError}}
  //-| {{lastErrorMsg}}
  //-| {{lastErrorMsgPromise}}
  //- [ "code", "msg", "response", "msgPromise" ]


</template>

<script>
import { MazCheckbox, MazInput } from 'maz-ui'
// import * as h from '@/libs/object-helpers/object-helpers'

export default {
  name: 'ResetPassword',

  props: { msg: String },
  components: { MazCheckbox, MazInput },
  data () { return { newPassword: '', oldPassword: '', lastError: {} } },
  computed: {
    lastErrorMsg() { return this.lastError?.msg; },
    lastErrorMsgs() { return this.lastError?.msgs || {}; },
    lastErrorMsgPromise() { return this.lastError?.msgPromise; },
  },
  methods: {
    changePassword() {
      this.$api.changePassword(this.$api.myUserId(), this.oldPassword, this.newPassword).then(
        () => this.$emit('close')
      ).catch(e => this.$api.errorHandler.changePassword(e, this.lastError));
      // ).catch(e => this.$set(this, 'lastError', e));
    },
  },
}
</script>
