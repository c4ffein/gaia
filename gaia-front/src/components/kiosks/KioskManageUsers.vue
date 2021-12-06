<template lang="pug">
div
  .modal-header.mb-5.t-30(:style="`text-align: {align}; white-space: pre-wrap;`")
    | {{ kiosk.name }}
  .modal-close-button(@click="$emit('close')")
  MazInput(v-if="iAmSuper" :value="printedKey" @input="inputKey" placeholder="Kiosk Key")
  .flex.mt-4(v-if="tKey !== null")
    button.btn.primary.w-1-2.mr-2.small(@click="saveKey()") Enregistrer
    button.btn.primary.w-1-2.ml-2.small.outline(@click="cancelKey()") Annuler
  .flex.f-col.mt-5(v-for="(user, userId) in kiosk.overseers")
    .flex.f-jc-space-between
      .w-full
        .flex
          div
            .mb-3(v-if="user.birthdate")
              span.t-bold.t-grey Date de naissance :
              span.ml-3 {{user.birthdate}}
            .mb-3(v-if="user.email")
              span.t-bold.t-grey Email :
              span.ml-3 {{user.email}}
            .mb-3(v-if="user.phone")
              span.t-bold.t-grey Telephone :
              span.ml-3 {{user.phone}}
            .mb-3(v-if="user.username")
              span.t-bold.t-grey Identifiant de connexion :
              span.ml-3 {{user.username}}
            .mb-3(v-if="user.temp_password")
              span.t-bold.t-grey Mot de passe temporaire :
              span.ml-3 {{user.temp_password}}
          .f-grow-1
          button.btn.outline.primary.ml-3(v-on:click="goToUser(userId)") Voir
          button.btn.outline.primary.ml-3(@click="unmakeUserKioskOverseer(userId)") Retirer
        hr.w-full
  button.btn.primary.w-full(@click="$emit('userFindProceedClicked')") +

</template>

<script>
import { MazBtnGroup, MazInput } from 'maz-ui'

export default {
  name: 'KioskManageUser',

  data: () => ({ tKey: null }),
  components: { MazBtnGroup, MazInput },
  props: { kiosk: Object },
  methods: {
    unmakeUserKioskOverseer(userId) {
      this.$api.unmakeUserKioskOverseer(userId, this.kiosk.id).then(() => {
        this.$api.loadKiosks();
        // this.informationMessage = `L'utilisateur ${user.firstname} ${user.lastname} n'est maintenant plus partenaire.`;
      });
    },
    inputKey(v) { this.tKey = (v !== this.kiosk?.key && !(v == '' && this.kiosk?.key == null)) ? v : null; },
    goToUser(userId) { return this.$router.push({name: 'user-list-user', params: { id: String(userId) }}); },
    saveKey() { return this.$api.patchKiosk(this.kiosk.id, { key: this.tKey || null }).then(() => this.tKey = null); },
    cancelKey() { this.tKey = null; },
  },
  computed: {
    iAmPartner() { return this.$api.iAmPartner(); },
    iAmSuper() { return this.$api.iAmSuper(); },
    printedKey() { return this.tKey !== null ? this.tKey : this.kiosk?.key; },
    isKeyModified() { return this.tKey !== null; },
  },
}
</script>

<style lang="scss">
.maz-btn-group > button.maz-btn { width: 120px; };
</style>
