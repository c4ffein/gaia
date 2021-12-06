<template lang="pug">
div
  .modal-header.mb-5.t-30(:style="`text-align: {align}; white-space: pre-wrap;`")
    | {{ user.firstname }} {{ user.lastname }}
  .modal-close-button(@click="$emit('close')")
  .flex.f-jc-space-between
    div
      .mb-3(v-if="user.birthdate")
        .t-bold.t-grey Date de naissance :
        .ml-3 {{user.birthdate}}
      .mb-3(v-if="user.email")
        .t-bold.t-grey Email :
        .ml-3 {{user.email}}
      .mb-3(v-if="user.phone")
        .t-bold.t-grey Telephone :
        .ml-3 {{user.phone}}
      .mb-3(v-if="user.username")
        .t-bold.t-grey Identifiant de connexion :
        .ml-3 {{user.username}}
      .mb-3(v-if="user.temp_password")
        .t-bold.t-grey Mot de passe temporaire :
        .ml-3 {{user.temp_password}}
    div(v-if="iAmPartner || iAmGreat")
      //- TODO: Make accessible for admin
      .mb-3(v-if="iAmPartner")
        .t-bold.t-grey Statut :
        //- TODO - v-model
        MazBtnGroup.mt-4.inline.ml-3.userinfo-even-buttons(size="sm" outline :value="isBeneficiary(partnerId)"
          :items="[{ label: 'Contact', value: false}, { label: 'Bénéficiaire', value: true}]" @input="contactOrBenef"
        )
      //- TODO: Make accessible for admin
      .mb-3(v-if="iAmPartner")
        .t-bold.t-grey Parcours :
        //- TODO - v-model
        MazBtnGroup.mt-4.inline.ml-3.userinfo-even-buttons(disabled
          size="sm" outline v-model="yy" style="min-width: 500px;"
          :items="[{ label: 'En cours', value: true}, { label: 'Terminé', value: false}]"
        )
      .mb-3(v-if="userIsRegular")
        .t-bold.t-grey Accès aux formulaires :
        div(style="max-height: 100px; overflow-y: scroll;")
          router-link.ml-3.block(v-for="userForm in userForms" v-bind:key="userForm.id"
            :to="{ name: 'form', params: {id: String(userForm.id)} }"
          )
            span.t-bold {{ $api.formTypeName(userForm.type) }}
            |  - {{ prettyDate(userForm.updated_at) }}
        button.btn.primary.small.outline.mt-3(
          v-on:click="createDiagnosticForm()"
        ) Créer un Diagnostic de situation
      .mb-3(v-if="userIsPartner" style="width: 200px;")
        .t-bold.t-grey Partenaire :
        router-link.ml-3.block.t-20.t-bold(
          :to="{ name: 'partner', params: {id: String(userPartnerId)} }"
        ) {{userPartnerName}}
      .mb-3(v-if="userIsKioskOverseer" style="width: 200px;")
        .t-bold.t-grey Gestionnaire :
        div(style="max-height: 100px; overflow-y: scroll;")
          router-link.ml-3.block(v-for="userKiosk in userKiosks" v-bind:key="userKiosk.id"
            :to="{ name: 'kiosk', params: {id: String(userKiosk.id)} }"
          )
            span.t-bold {{ userKiosk.name}}
      .mb-3(v-if="userIsRegular")
        .t-bold.t-grey Certificats de RDV :
        div(style="max-height: 100px; overflow-y: scroll;")
          router-link.ml-3.block(v-for="userRdv in userRdvs" v-bind:key="userRdv.id"
            :to="{ name: 'rdv', params: {id: String(userRdv.id)} }"
          )
            span.t-bold RDV
            |  - {{ prettyDate(userRdv.start) }}
        button.btn.primary.small.outline.mt-3(
          v-on:click="createDiagnosticForm()"
        ) Voir les rendez-vous
  hr.mt-4(v-if="!userIsPartner")
  .flex.f-col(v-if="!userIsPartner")
    .flex
      router-link.block.btn.primary.outline.f-grow-1.w-1-3.my-3.mr-2(
        :to="{ name: 'profile', params: {id: String(user.id)}}"
      ) Voir le profil
      router-link.block.btn.primary.outline.f-grow-1.w-1-3.my-3.mx-2(
        :to="{ name: 'rdvs', params: {futureRDVUserId: String(user.id)}}"
      ) Prendre RDV
      button.btn.primary.outline.f-grow-1.w-1-3.my-3.ml-2(@click="startVisio()")
        | Visio immédiate
    button.btn.primary.outline.w-full.my-3(v-if="iAmSuper" @click="makeAdmin()")
      | Passer Administrateur
    button.btn.primary.outline.w-full.my-3(v-if="iAmSuper" @click="unmakeAdmin()")
      | Enlever les droits Administrateur
</template>

<script>
import { MazBtnGroup } from 'maz-ui'
import { prettyDate } from '@/libs/drftimestamp'

export default {
  name: 'UserInformation',

  data: () => ({ xx: '', yy: '' }),
  components: { MazBtnGroup },
  props: { user: Object },
  methods: {
    startVisio() { this.$api.createVisio(this.iAmPartner, this.user.id).then(
      visio => this.$router.push({name: 'visio', params: {url: visio.url}})
    ) },
    makeAdmin() { this.$api.patchUser(this.user.id, {is_admin: true}); },
    unmakeAdmin() { this.$api.patchUser(this.user.id, {is_admin: false}); },
    prettyDate(t) { return prettyDate(t); },
    createDiagnosticForm() { return this.$api.createDiagnosticForm(this.user.id); },
    makeBeneficiary(partnerId) { this.$api.makeUserBeneficiary(this.user, partnerId); },
    unmakeBeneficiary(partnerId) { this.$api.unmakeUserBeneficiary(this.user, partnerId); },
    isBeneficiary(partnerId) {return !!this.user?.partners_as_beneficiary.includes?.(partnerId)},
    contactOrBenef(v) { if(v) this.makeBeneficiary(this.partnerId); else this.unmakeBeneficiary(this.partnerId); },
  },
  computed: {
    iAmPartner() { return this.$api.iAmPartner(); },
    partnerId() { return this.$api.partnerId(); },
    iAmGreat() { return this.$api.iAmGreat(); },
    iAmSuper() { return this.$api.iAmSuper(); },
    userFormsId() { return (Array.isArray(this.user?.forms) && this.user?.forms) || []; },
    userForms() { return this.userFormsId.map(id => this.$api.data.forms?.[id]).filter(f => !!f); },
    userRdvs() { return this.userFormsId.map(id => this.$api.data.rdvs?.[id]).filter(f => !!f); },
    userPartnerId() { return this.user?.partner_as_member; },
    userPartner() { return this.userPartnerId ? this.$api.data?.partners?.[this.userPartnerId] : null },
    userIsPartner() { return !!this.userPartnerId; },
    userIsRegular() { return this.$api.isRegular(this.user.id); },
    userIsKioskOverseer() { return this.$api.isKioskOverseer(this.user.id); },
    userKiosksId() { return (Array.isArray(this.user?.kiosks_overseeing) && this.user?.kiosks_overseeing) || []; },
    userKiosks() { return this.userKiosksId.map(id => this.$api.data.kiosks?.[id]).filter(k => !!k); },
    userPartnerName() { return this.userPartner?.name; },
  },
  beforeMount() { this.$api.getUserForms(this.user); },
}
</script>

<style lang="scss">
.maz-btn-group > button.maz-btn { width: 120px; };
</style>
