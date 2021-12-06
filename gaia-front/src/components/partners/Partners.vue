<template lang="pug">
.width-container
  .hello
    //- .card
      MazInput(v-model="searchValue" left-icon-name="search" placeholder="Chercher un nom")
    .card
      MazBtnGroup.w-full.two-choices( outline v-if="disabledPartners.length !== 0" v-model="showDisabled"
        :items="[{label:'Partenaires actifs', value: false}, {label:'Partenaires désactivés', value: true}]"
      )
      router-link.partner.flex(
        v-for="partner in showablePartners" v-bind:key="partner.id"
        :to="{ name: 'partner', params: {id: String(partner.id)} }"
      )
        .t-bold.mr-5 {{partner.name}}
        .flex.f-col.ml-5(v-for="(user, index) in limitUsers(partner.members)" v-bind:key="index")
          div {{index < 3 ? user.username : '...'}}
          span.t-grey() {{index < 3 ? user.email : ''}}

        .f-grow-1
        button.btn.primary.small.in-list-button.maz-btn--sm(
          v-if="iAmGreat" v-on:click="e => {e.preventDefault(); openUsersManagerModal(partner);}"
        ) Gestion comptes
      MazBtn.more-partners-button.w-full.t-bold(v-on:click="showPartnerAdd = true") +
  Modal(
    v-if="showUserManager || showPartnerAdd || showUserFind || showUserAdd || showPartnerDelete || informationMessage"
    @close="closeModal"
  )
    PartnerManageUsers(
      v-if="showUserManager"
      :partner="selectedPartner"
      @close="showUserManager = false"
      @userFindProceedClicked="showUserManager = false; showUserFind = true;"
    )
    button.btn.error.outline.w-full.mt-4(
      v-if="showUserManager" @click="showPartnerDelete = true; showUserManager = false;"
    ) {{ selectedPartner.is_deactivated ? 'Réactiver le partenaire' : 'Désactiver le partenaire' }}
    div(v-if="showPartnerDelete")
      .t-error.t-20.t-bold
        div(v-if="!selectedPartner.is_deactivated")
          div Êtes vous sur de vouloir désactiver le partenaire?
          div Il ne sera plus accessible jusqu'à son éventuelle réactivation
          button.btn.error.w-full.mt-4( @click="disablePartner()" ) Confirmer
        div(v-else)
          div Êtes vous sur de vouloir réactiver le partenaire?
          div Il sera de nouveau accessible
          button.btn.error.w-full.mt-4( @click="reenablePartner()" ) Confirmer
        button.btn.primary.outline.w-full.mt-4( @click="showPartnerDelete = false; showUserManager = true;" ) Annuler
    PartnerAdd(
      v-if="showPartnerAdd"
      @close="showPartnerAdd = false"
      @partnerAdded="partnerAdded"
      @userFindProceedClicked="showPartnerAdd = false; showUserFind = true;"
    )
    UserFind(
      v-if="showUserFind" @close="showUserFind = false"
      :partnerAsMember="selectedPartner.name"
      @nextClicked="makeUserPartner"
      @addUserClicked="showUserFind = false; showUserAdd = true"
    )
    UserAdd(
      v-if="showUserAdd" :partnerAsMember="selectedPartnerId" @userAdded="announceNewUser" @close="showUserAdd = false"
    )
    Information( v-if="informationMessage" :msg="informationMessage" @okClicked="informationMessage = ''" )
</template>

<script>
import * as h from '@/libs/object-helpers/object-helpers'

import { MazInput, MazBtn, MazBtnGroup } from 'maz-ui'
import Modal from '../reusables/Modal'
import PartnerManageUsers from './PartnerManageUsers'
import PartnerAdd from './PartnerAdd'
import UserFind from '../reusables/UserFind'
import UserAdd from '../reusables/UserAdd'
import Information from '../reusables/Information'

export default {
  name: 'Partners',
  props: { msg: String, id: String },
  components: { MazInput, MazBtn, MazBtnGroup, Modal, PartnerManageUsers, PartnerAdd, UserFind, UserAdd, Information },
  data() { return {
    searchValue: '',
    showDisabled: false,
    showUserManager: false,
    showPartnerAdd: false,
    showPartnerDelete: false,
    showUserFind: false,
    showUserAdd: false,
    informationMessage: '',
    selectedPartnerId: null,
  }; },
  computed: {
    iAmGreat() { return this.$api.iAmGreat(); },
    partners() { return h.oV(this.$api.data.partners); },
    notDisabledPartners() { return h.oV(this.$api.data.partners || []).filter(o => !o.is_deactivated); },
    disabledPartners() { return h.oV(this.$api.data.partners || []).filter(o => o.is_deactivated); },
    showablePartners() { return this.showDisabledQF ? this.disabledPartners : this.notDisabledPartners; },
    selectedPartner() { return this.$api.data.partners[this.selectedPartnerId] },
    showDisabledQF() { return this.showDisabled && this.disabledPartners.length !== 0 },
  },
  methods: {
    openUsersManagerModal(partner) { this.showUserManager = true; this.selectedPartnerId = partner.id; },
    disablePartner() { this.$api.patchPartner(this.selectedPartnerId, { is_deactivated: true }).then(() => {
      this.informationMessage = 'Le partenaire est maintenant désactivé'; this.showPartnerDelete = false; }); },
    reenablePartner() { this.$api.patchPartner(this.selectedPartnerId, { is_deactivated: false }).then(() => {
      this.informationMessage = 'Le partenaire est maintenant réactivé'; this.showPartnerDelete = false; }); },
    partnerAdded(partnerId) { this.selectedPartnerId = partnerId; },
    limitUsers(usersObject) { return h.oV(usersObject || {}).slice(0, 4) },
    makeUserPartner(user) { this.$api.patchUser(user.id, {partner_as_member: this.selectedPartner.id}).then(() => {
      this.$api.loadPartners(); this.announceUser(user); // For now manual reload of partners
    }); },
    announceUser(user) {
      this.showUserFind = false,
      this.informationMessage = `L'utilisateur ${user.firstname} ${user.lastname} ` +
        `est maintenant le partenaire ${this.selectedPartner.name}`; },
    announceNewUser(user) {
      this.showUserAdd = false,
      this.informationMessage = `L'utilisateur ${user.firstname} ${user.lastname} a été ajouté en tant que ` +
        `partenaire ${this.selectedPartner.name}.\nSon mot de pass est ${user.temp_password}`; },
    closeModal() { this.showPartnerAdd = this.showUserFind = this.showUserAdd = false; this.informationMessage = ''; },
  },
}
</script>


<style lang="scss">
.partner { padding: 10px 20px 10px 20px; transition: background-color 0.1s linear; text-decoration: none; }
.more-partners-button { border-top-left-radius: 0; border-top-right-radius: 0; }
.maz-btn--primary:focus::before { border: none; }
.partner:hover { background-color: rgba(0, 0, 0, 0.08); }
.in-list-button { margin-left: 10px; opacity: 0; transition: opacity 0.1s linear; }
.partner:hover .in-list-button { opacity: 1; }
.more-persons-button { width: 100%; border-top-left-radius: 0; border-top-right-radius: 0; font-weight: bold; }
.maz-btn--primary:focus::before { border: none; }
</style>
