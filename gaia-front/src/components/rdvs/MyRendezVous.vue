<template lang="pug">
div
  .t-bold.t-primary.t-18.mb-3 {{ (iAmRegular || iAmPartner) ? 'Mes rendez-vous' : 'Rendez-vous' }}
  MazBtnGroup.w-full.two-choices.mb-3(
    size="sm" outline @input="showOver = $event" :value="showOver"
    :items="[{label: 'Prévus', value: false}, {label: 'Terminés', value: true}]"
  )
  div(v-if="iAmJustKioskOverseer || iAmGreat")
    MazSelect(:options="myKiosksOptions" v-model="selectedKiosks" multiple placeholder="kiosques")

  div(v-if="!showOver")
    div(v-if="Object.keys(myNotOverRdvs).length !== 0")
      div(v-for="rdv in myNotOverRdvs").mb-4.mt-3.ml-3
        MyRendezVousItem(:rdv="rdv")
    .t-bold.t-primary.t-18(v-else) Aucun rendez-vous prévu actuellement
  div(v-if="showOver")
    //- TODO : Better handling of canceled rdvs
    div(v-if="myOverRdvs.length !== 0")
      div(style="max-height: 300px; overflow-y: scroll;")
        .mb-4.mt-3.ml-3(v-for="[rdvId, rdv] in myOverRdvs")
          MyRendezVousItem(v-if="!rdv.canceled" :rdv="rdv")
    .t-bold.t-primary.t-18(v-else) Aucun rendez-vous prévu actuellement
</template>

<script>
import { MazCheckbox, MazBtn, MazBtnGroup, MazSelect } from 'maz-ui'

import Modal from '../reusables/Modal.vue'
import UserFind from '../reusables/UserFind.vue'
import MyRendezVousItem from './MyRendezVousItem.vue'

import { prettyTime, prettyDate } from '@/libs/drftimestamp'
import * as h from '@/libs/object-helpers/object-helpers'


export default {
  name: 'RendezVous',

  components: { MazCheckbox, MazBtn, MazBtnGroup, Modal, UserFind, MyRendezVousItem, MazSelect },
  data: () => ({ showOver: false, selectedKiosks: [] }),
  computed: {
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    iAmRegular() { return this.$api.iAmRegular(); },
    userId() { return this.$api.myUserId(); },
    partnerId() { return this.$api.partnerId(); },
    partners() { return this.$api.data.partners; },
    myOverRdvs() { return (this.selectedKiosks && this.selectedKiosks.length !== 0) ? h.oE(this.$api.allRdvs()).filter(([, v]) => this.selectedKiosks.includes(v.kiosk)) : h.oE(this.$api.myOverRdvs()).slice().reverse(); },
    // myOverRdvs() { return  h.oE(this.$api.myOverRdvs()).slice().reverse(); },
    myNotOverRdvs() { return (this.selectedKiosks && this.selectedKiosks.length !== 0) ? h.oFE(h.oE(this.$api.allRdvs()).filter(([, v]) => this.selectedKiosks.includes(v.kiosk))) : this.$api.myNotOverRdvs() },
    // myNotOverRdvs() { return  this.$api.myNotOverRdvs() },
    iAmJustKioskOverseer() { return this.$api.iAmJustKioskOverseer(); },
    iAmGreat() { return this.$api.iAmGreat(); },
    myUser() { return this.$api.data.users?.[this.userId]; },
    myKiosksId() { return this.iAmGreat ? h.oK(this.$api.data.kiosks || {}) : (this.myUser?.kiosks_overseeing || []); },
    myKiosksOptions() { return this.myKiosksId.map(id => ({ label: this.$api.data.kiosks?.[id]?.name || '', value: id })); },
  },
  methods: {
    cancelRegisteredRDV(id) { this.$api.cancelRDV(id); },
    confirmRegisteredRDV(id) { this.$api.confirmRDV(id); },
    prettyDate(s) { return prettyDate(s); },
    prettyTime(s) { return prettyTime(s); },
    personName(p) { return p ? `${p.firstname} ${p.lastname}` : ''; },
    getUser(id) { return id ? this.$api.loadUser(id) : null; },
    startVisio(e) { this.$api.startVisio(this.$api.Id(e.id), e.url); this.$router.push({name: 'visio'}) },
  },
}
</script>
