<template lang="pug">
.flex
  div
    span Le
    span.t-primary.t-bold  {{prettyDate(rdv.start)}}
    span  de
    span.t-primary.t-bold  {{prettyTime(rdv.start)}}
    span  à
    span.t-primary.t-bold  {{prettyTime(rdv.end)}}
    //- Other participant as user or partner
    span(v-if="iAmRegular || iAmPartner")  avec
    router-link.t-primary.t-bold.t-no-decoration(v-if="iAmRegular"
      :to="{ name: 'partner', params: {id: String(rdv.partner)} }"
    )  {{$api.obtPartner(rdv.partner).name || ''}}
    router-link.t-primary.t-bold.t-no-decoration(v-if="iAmPartner"
      :to="{ name: 'profile', params: {id: String(rdv.user)} }"
    )  {{personName(getUser(rdv.user))}}
    // Participants if manager
    span(v-if="iAmOverseer")  entre
    router-link.t-primary.t-bold.t-no-decoration(v-if="iAmOverseer"
      :to="{ name: 'partner', params: {id: String(rdv.partner)} }"
    )  {{$api.obtPartner(rdv.partner).name || ''}}
    span(v-if="iAmOverseer")  et
    router-link.t-primary.t-bold.t-no-decoration(v-if="iAmOverseer"
      :to="{ name: 'profile', params: {id: String(rdv.user)} }"
    )  {{personName(getUser(rdv.user))}}
    //- Optional kiosk info
    div(v-if="rdv.kiosk") Rendez-vous sur la borne {{kioskName(rdv.kiosk)}}
    .t-warning.t-bold(v-if="!rdv.oked_by_beneficiary")
      span(v-if="iAmRegular") En attente de votre confirmation
      span(v-if="!iAmRegular") En attente de confirmation par le bénéficiaire
    .t-warning.t-bold(v-if="!rdv.oked_by_partner")
      span(v-if="iAmPartner") En attente de votre confirmation
      span(v-if="!iAmPartner") En attente de confirmation par le partenaire
    div(v-if="!rdv.over && rdv.oked_by_partner && rdv.oked_by_beneficiary")
      | RDV mutuellement confirmé
  //- TODO : There should be handling of both over and cancelled...
  .ml-auto
  button.btn.outline.primary.small.ml-5(
    v-if="!rdv.over && ((iAmPartner && !rdv.oked_by_partner) || (iAmRegular && !rdv.oked_by_beneficiary))"
    @click="confirmRegisteredRDV(rdv.id)"
  ) Confirmer
  button.btn.outline.primary.small.ml-5(
    v-if="!rdv.over && (rdv.oked_by_partner && rdv.oked_by_beneficiary)"
    @click="startVisio(rdv)"
  ) Accéder à la visio
  button.btn.outline.primary.small.ml-5(
    v-if="rdv.over && !rdv.canceled" @click="$router.push({name: 'rdv', params:{id: String(rdv.id)}})"
  ) Certificat
  //- TODO : REMONTER DE 2...
  button.btn.outline.primary.small.ml-5(v-if="!rdv.over" @click="cancelRegisteredRDV(rdv.id)") Annuler
</template>

<script>
import { MazCheckbox, MazBtn, MazBtnGroup } from 'maz-ui'

import Modal from '../reusables/Modal.vue'
import UserFind from '../reusables/UserFind.vue'

import { prettyTime, prettyDate } from '@/libs/drftimestamp'


export default {
  name: 'RendezVous',

  components: { MazCheckbox, MazBtn, MazBtnGroup, Modal, UserFind },
  props: {rdv: Object},
  data: () => ({}),  // TODO : switch between over and not over
  computed: {
    iAmRegular() { return this.$api.iAmRegular(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    iAmOverseer() { return this.$api.iAmJustKioskOverseer() || this.$api.iAmGreat(); },
    userId() { return this.$api.myUserId(); },
    partnerId() { return this.$api.partnerId(); },
    myOverRvds() { return this.$api.myOverRdvs() },
    myNotOverRdvs() { return this.$api.myNotOverRdvs() },
  },
  methods: {
    cancelRegisteredRDV(id) { this.$api.cancelRDV(id); },
    confirmRegisteredRDV(id) { this.$api.confirmRDV(id); },
    prettyDate(s) { return prettyDate(s); },
    prettyTime(s) { return prettyTime(s); },
    personName(p) { return p ? `${p.firstname} ${p.lastname}` : ''; },
    getUser(id) { return id ? this.$api.loadUser(id) : null; },
    startVisio(e) { this.$api.startVisio(this.$api.Id(e.id), e.url); this.$router.push({name: 'visio'}) },
    kioskName(id) { return this.$api.data?.kiosks?.[id]?.name || ''; },
  },
}
</script>
