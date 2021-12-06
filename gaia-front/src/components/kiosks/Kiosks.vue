<template lang="pug">
.width-container
  .hello
    //- .card
      MazInput(v-model="searchValue" left-icon-name="search" placeholder="Chercher un nom")
    .card
      MazBtnGroup.w-full.two-choices( outline v-if="disabledKiosks.length !== 0" v-model="showDisabled"
        :items="[{label:'Kiosques actifs', value: false}, {label:'Kiosques désactivés', value: true}]"
      )
      router-link.kiosk.flex(
        v-for="kiosk in showableKiosks" v-bind:key="kiosk.id"
        :to="{ name: 'kiosk', params: {id: String(kiosk.id)} }"
      )
        .t-bold.mr-5 {{kiosk.name}}
        .flex.f-col.ml-5(v-for="(user, index) in limitUsers(kiosk.members)" v-bind:key="index")
          div {{index < 3 ? user.username : '...'}}
          span.t-grey() {{index < 3 ? user.email : ''}}
      MazBtn.more-kiosks-button.w-full.t-bold(v-on:click="showKioskAdd = true") +
  Modal(
    v-if="showUserManager || showKioskAdd || showUserFind || showUserAdd || showKioskDelete || informationMessage"
    @close="closeModal"
  )
    KioskManageUsers(
      v-if="showUserManager"
      :kiosk="selectedKiosk"
      @close="$router.push({name: 'kiosks'})"
      @userFindProceedClicked="noShowMModal = true; showUserFind = true;"
    )
    button.btn.error.outline.w-full.mt-4(
      v-if="showUserManager" @click="showKioskDelete = true; noShowMModal = true;"
    ) {{ selectedKiosk.is_deactivated ? 'Réactiver le kiosque' : 'Désactiver le kiosque' }}
    div(v-if="showKioskDelete")
      .t-error.t-20.t-bold
        div(v-if="!selectedKiosk.is_deactivated")
          div Êtes vous sur de vouloir désactiver le kiosque?
          div Il ne sera plus accessible jusqu'à son éventuelle réactivation
          button.btn.error.w-full.mt-4( @click="disableKiosk()" ) Confirmer
        div(v-else)
          div Êtes vous sur de vouloir réactiver le kiosque?
          div Il sera de nouveau accessible
          button.btn.error.w-full.mt-4( @click="reenableKiosk()" ) Confirmer
        button.btn.primary.outline.w-full.mt-4( @click="showKioskDelete = false; noShowMModal = false;" ) Annuler
    KioskAdd(
      v-if="showKioskAdd"
      @close="showKioskAdd = false; noShowMModal = false;"
      @kioskAdded="kioskAdded"
      @userFindProceedClicked="showKioskAdd = false; showUserFind = true;"
    )
    UserFind(
      v-if="showUserFind" @close="showUserFind = false; noShowMModal = false;"
      :kioskAsMember="selectedKiosk.name"
      @nextClicked="makeUserKioskOverseer"
      @addUserClicked="showUserFind = false; showUserAdd = true"
    )
    UserAdd(
      v-if="showUserAdd" @userAdded="makeUserKioskOverseer" @close="showUserAdd = false; noShowMModal = false;"
    )
    Information(
      v-if="informationMessage" :msg="informationMessage" @okClicked="informationMessage = ''; noShowMModal = false;")
</template>

<script>
import * as h from '@/libs/object-helpers/object-helpers'

import { MazInput, MazBtn, MazBtnGroup } from 'maz-ui'
import Modal from '../reusables/Modal'
import KioskManageUsers from './KioskManageUsers'
import KioskAdd from './KioskAdd'
import UserFind from '../reusables/UserFind'
import UserAdd from '../reusables/UserAdd'
import Information from '../reusables/Information'

export default {
  name: 'Kiosks',
  props: { msg: String, id: String },
  components: { MazInput, MazBtn, MazBtnGroup, Modal, KioskManageUsers, KioskAdd, UserFind, UserAdd, Information },
  data() { return {
    searchValue: '',
    showDisabled: false,
    noShowMModal: false,
    showKioskAdd: false,
    showKioskDelete: false,
    showUserFind: false,
    showUserAdd: false,
    informationMessage: '',
  }; },
  computed: {
    showUserManager() { return !this.noShowMModal && !!this.selectedKiosk; },
    kiosks() { return h.oV(this.$api.data.kiosks); },
    notDisabledKiosks() { return h.oV(this.$api.data.kiosks || []).filter(o => !o.is_deactivated); },
    disabledKiosks() { return h.oV(this.$api.data.kiosks || []).filter(o => o.is_deactivated); },
    showableKiosks() { return this.showDisabledQF ? this.disabledKiosks : this.notDisabledKiosks; },
    selectedKioskId() { return this.$api.Id(this.id) },
    selectedKiosk() { return this.selectedKioskId ? this.$api.data.kiosks?.[this.selectedKioskId] || null : null; },
    showDisabledQF() { return this.showDisabled && this.disabledKiosks.length !== 0 },
  },
  methods: {
    openUsersManagerModal(kioskId) { this.showUserManager = true;
      this.$router.push({ name: 'kiosk', params: {id: kioskId}}); },
    deleteKiosk(id) { this.$api.deleteKiosk(id).then(() => this.loadList()); },
    disableKiosk() { this.$api.patchKiosk(this.selectedKioskId, { is_deactivated: true }).then(() => {
      this.informationMessage = 'Le kiosque est maintenant désactivé'; this.showKioskDelete = false; }); },
    reenableKiosk() { this.$api.patchKiosk(this.selectedKioskId, { is_deactivated: false }).then(() => {
      this.informationMessage = 'Le kiosque est maintenant réactivé'; this.showKioskDelete = false; }); },
    loadList() { this.$api.listKiosks(); },
    kioskAdded(kiosk) { this.selectedKiosk = kiosk; this.loadList(); }, // TODO : SLOW
    limitUsers(usersObject) { return h.oV(usersObject || {}).slice(0, 4) },
    makeUserKioskOverseer(user) {
      this.$api.makeUserKioskOverseer(user.id, this.selectedKiosk.id).then(() => {
        this.loadList();  // Quick and dirty. Do Better.
        this.showUserFind = false; this.showUserAdd = false;
        this.informationMessage = `L'utilisateur ${user.firstname} ${user.lastname} ` +
        `est maintenant gestionnaire kiosque ${this.selectedKiosk.name}`;
      });
    },
    closeModal() { this.showKioskAdd = this.showUserFind = this.showUserAdd = false; this.informationMessage = ''; },
  },
}
</script>


<style lang="scss">
.kiosk { padding: 10px 20px 10px 20px; transition: background-color 0.1s linear; text-decoration: none; }
.more-kiosks-button { border-top-left-radius: 0; border-top-right-radius: 0; }
.maz-btn--primary:focus::before { border: none; }
.kiosk:hover { background-color: rgba(0, 0, 0, 0.08); }
.in-list-button { margin-left: 10px; opacity: 0; transition: opacity 0.1s linear; }
.kiosk:hover .in-list-button { opacity: 1; }
.more-persons-button { width: 100%; border-top-left-radius: 0; border-top-right-radius: 0; font-weight: bold; }
.maz-btn--primary:focus::before { border: none; }
</style>
