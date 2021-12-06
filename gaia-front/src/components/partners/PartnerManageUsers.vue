<template lang="pug">
div
  .modal-header.mb-5.t-30(:style="`text-align: {align}; white-space: pre-wrap;`")
    | {{ partner.name }}
  .modal-close-button(@click="$emit('close')")
  .flex.f-col(v-for="(user, userId) in partner.members")
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
          button.btn.outline.primary.ml-3(@click="unmakeUserPartner(userId)") Retirer
        hr.w-full
  button.btn.primary.w-full(@click="$emit('userFindProceedClicked')") +

</template>

<script>
import { MazBtnGroup } from 'maz-ui'

export default {
  name: 'PartnerManageUser',

  components: { MazBtnGroup },
  props: { partner: Object },
  methods: {
    unmakeUserPartner(userId) {
      this.$api.patchUser(userId, {partner_as_member: null}).then(() => {
        this.$api.loadPartners();
        // this.informationMessage = `L'utilisateur ${user.firstname} ${user.lastname} n'est maintenant plus partenaire.`;
      });
    },
    goToUser(userId) { return this.$router.push({name: 'user-list-user', params: { id: String(userId) }}); },
  },
  computed: { iAmPartner() { return this.$api.iAmPartner(); }, },
}
</script>

<style lang="scss">
.maz-btn-group > button.maz-btn { width: 120px; };
</style>
