<template lang="pug">
.width-container
  .card
    MazInput(v-model="searchValue" left-icon-name="search" placeholder="Chercher un nom") k

  MazBtnGroup.my-5.w-full.two-choices(v-model="showOnlyMines" :items="showOnlyMinesOptions" outline)

  .card
    button.btn.primary.t-normal.w-full.b-8-8-0-0.t-regular(
      v-if="showOnlyMines" v-on:click="showUserFind = true"
    ) Passer un utilisateur bénéficiaire
    button.btn.primary.t-normal.w-full.b-8-8-0-0.t-regular(
      v-if="!showOnlyMines" v-on:click="showUserAdd = true"
    ) Ajouter un utilisateur
    router-link.person.flex.py-3.px-5( :to="{ name: 'user-list-user', params: {id: String(person.id)} }"
      v-for="person in showedPersons" v-bind:key="person.id"
    )
      span.t-primary.t-bold {{person.firstname}} {{person.lastname}}
      span.ml-5.t-grey {{prettyDate(person.birthdate)}}
      span.ml-5.t-grey(v-if="person.email") {{person.email}}
      span.ml-5.t-grey(v-if="person.phone && person.phone !== '0'") {{person.phone}}
      .f-grow-1
    //- MazBtn.t-bold.add-user-button(v-on:click="showUserFind = true") +
    //- TODO : SHOW MORE...

  Modal(
    v-if="showUserFind || showUserAdd || informationMessage || shownUser"
    @close="showUserFind = showUserAdd = informationMessage = false; showNone()"
  )
    UserFind(
      v-if="showUserFind" @close="showUserFind = false"
      :partnerAsBeneficiary="iAmPartner ? this.myPartnerAM.name : ''"
      @nextClicked="makeUserBeneficiary"
      @addUserClicked="showUserFind = false; showUserAdd = true"
    )
    UserAdd(v-if="showUserAdd" @close="showUserAdd = false; loadList()")
    Information(
      v-if="informationMessage"
      :msg="informationMessage"
      @okClicked="informationMessage = ''"
    )
    UserInformation(v-if="shownUser" :user="shownUser" @close="showNone()")
</template>


<script>
import { MazInput, MazBtn, MazBtnGroup } from 'maz-ui'
import Modal from './reusables/Modal'
import UserFind from './reusables/UserFind'
import UserAdd from './reusables/UserAdd'
import Information from './reusables/Information'
import UserInformation from './reusables/UserInformation'

import { prettyDate } from '@/libs/drftimestamp'
import * as h from '@/libs/object-helpers/object-helpers'

export default {
  name: 'UserList',
  props: { msg: String, id: String },
  components: { MazInput, MazBtn, MazBtnGroup, Modal, UserFind, UserAdd, Information, UserInformation },
  data() {
    return {
      searchValue: '',
      showUserFind: false,
      showUserAdd: false,
      informationMessage: '',
      showOnlyMines: 1,
      limitShowed: 200, // TODO : Limit on scroll
    };
  },
  methods: {
    openModal(person) { alert(`WiP infos  ${person.firstname} ${person.lastname}`); },
    loadList() { this.$api.listUsers(); },
    // TODO : Allow to make user partner from this screen?
    makeUserBeneficiary(user) {
      this.$api.makeUserBeneficiary(user, this.iAmPartner).then(() => {
        this.showUserFind = false,
        this.informationMessage = `L'utilisateur ${user.firstname} ${user.lastname} ` +
        `est maintenant bénéficiaire.`;
        this.loadList();
      });
    },
    prettyDate(date) { return prettyDate(date); },
    showNone() { this.$router.replace({name: 'user-list'}) },
  },
  computed: {
    persons() { return h.oV(this.$api.data.users || {}); },
    showOnlyMinesOptions() { return this.iAmGreat ? [
        { label: 'Uniquement les partenaires', value: 1 }, { label: 'Tous les utilisateurs', value: 0 },
      ] : [
        { label: 'Uniquement mes bénéficiaires', value: 1 }, { label: 'Tous les utilisateurs', value: 0 },
    ] } ,
    iAmPartner() { return this.$api.iAmPartner(); },
    myPartnerAM() { return this.$api.myPartnerAM(); },
    iAmGreat() { return this.$api.iAmGreat(); },
    listedPersons() { return this.showOnlyMines ?
      this.iAmGreat ? this.persons.filter(person => person.partner_as_member) :
      this.persons.filter(person => person.partners_as_beneficiary.includes(this.iAmPartner)) : this.persons;
    },
    showedPersons() { return this.$api.usersInSearch(this.listedPersons, this.searchValue).slice(0, 60); },  // TODO
    idShownUser() { return this.$api.Id(this.id) },
    shownUser() { return this.idShownUser ? this.$api.data.users?.[this.idShownUser] || null : null; },
  },
  beforeMount() { this.loadList(); },  // TODO : BAD
}
</script>


<style lang="scss">
.person { transition: background-color 0.1s linear; }
.person:hover { background-color: rgba(0, 0, 0, 0.08); }
.person.selected { background-color: rgba(0, 0, 0, 0.2); }
.person-button { opacity: 0; transition: opacity 0.1s linear; }
.person:hover .person-button { opacity: 1; }
a.person { text-decoration: none; }
// .add-user-button { width: 100%; border-top-left-radius: 0; border-top-right-radius: 0; }
// .add-user-button { width: 100%; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
</style>
