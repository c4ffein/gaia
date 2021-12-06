<template lang="pug">
.width-container
  div(v-if="gotRdvs && canTakeRdvs")
    MazBtnGroup.mt-4.two-choices.mb-5.shadow(size="lg" outline :value="showOnlyViewPanel" @input="setTab"
      :items="[{label: 'RDV programmés', value: true}, {label: 'Prise de RDV', value: false}]")
  .page.shadow
    .px-8.py-8.flex.f-col(v-if="showOnlyViewPanel"
      style="max-width: 800px; margin-left: auto; margin-right: auto;"
    )
      MyRendezVous(v-if="iAmLogged")
    .px-8.py-8.flex.f-col(v-if="!showOnlyViewPanel"
      style="max-width: 800px; margin-left: auto; margin-right: auto;"
    )
      RendezVousTaker(
        :futureRDVUserId="futureRDVUserId"
        :futureRDVPartnerId="futureRDVPartnerId"
        :futureRDVCategoryId="futureRDVCategoryId"
        @rdvCreated="rdvCreated"
      )
  Modal(v-if="informationMessage || id" @close="noSelect" closable :unlimited="!informationMessage")
    Information( v-if="informationMessage" :msg="informationMessage" @okClicked="noSelect" )
    MyRendezVousDetails(v-if="id && !informationMessage" :id="String(id)" @close="noSelect")
</template>

<script>
import { MazBtnGroup } from 'maz-ui'

import MyRendezVous from './MyRendezVous.vue'
import MyRendezVousDetails from './MyRendezVousDetails.vue'
import RendezVousTaker from './RendezVousTaker'
import Information from '../reusables/Information.vue'
import Modal from '../reusables/Modal.vue'

import * as h from '@/libs/object-helpers/object-helpers'


export default {
  name: 'RendezVous',

  props: { id: String, futureRDVCategoryId: String, futureRDVPartnerId: String, futureRDVUserId: String },
  components: { MazBtnGroup, Information, Modal, MyRendezVous, MyRendezVousDetails, RendezVousTaker },
  data: () => ({ informationMessage: '', showOnlyViewPanelD: null, }),
  computed: {
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    userId() { return this.$api.myUserId(); },
    partnerId() { return this.$api.partnerId(); },
    partners() { return this.$api.data.partners; },
    myRdvs() { return this.$api.myRdvs() },
    gotRdvs() { return h.oK(this.myRdvs).length !== 0; },
    gotFutureIntent() { return this.futureRDVUserId || this.futureRDVPartnerId || this.futureRDVCategoryId; },
    canTakeRdvs() { return true; }, // TODO
    allRDVs() { return this.$api.allRdvs(); },
    canOnlySeeViewPanel() { return this.$api.iAmSuper() || this.$api.iAmGreat() || this.$api.iAmJustKioskOverseer(); },
    showOnlyViewPanel() { return this.canOnlySeeViewPanel || (this.showOnlyViewPanelD === null ?
      !this.gotFutureIntent && (this.gotRdvs || !this.canTakeRdvs) : this.showOnlyViewPanelD); },
  },
  methods: {
    setTab(v) { this.showOnlyViewPanelD = v; },
    getUserName(r) { return r?.firstname && r?.lastname ? `${r.firstname} + ${r.lastname}` : ''; },
    rdvCreated(i) {
      const r = this.$api.data.rdvs?.[i]?.[this.partnerId ? 'user' : 'partner'];
      const n = !r ? '' : this.partnerId ? this.getUserName(this.$api.data?.users?.[r]) : (this.$api.data?.partners?.[r]?.name || '');
      this.informationMessage = `Le rendez-vous${n ? ' avec '+n : ''} a été ajouté.`; },
    noSelect() {
      if (this.informationMessage) { this.informationMessage = null; return; }
      this.$router.push({name: 'rdvs', params: h.oFE( // useless?
        ['Category', 'Partner', 'User'].map(v => [`futureRDV${v}Id`, this[`futureRDV${v}Id`]])) });
    },
  },
}
</script>
