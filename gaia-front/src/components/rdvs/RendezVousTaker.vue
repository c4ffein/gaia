<template lang="pug">
div
  .t-bold.t-primary.t-18.mb-3(v-if="!iAmPartner")
    | Découvrez l’offre d’accompagnement de nos partenaires et prenez un rendez-vous avec un conseiller
  div(v-if="!postalCodeValid && !iAmPartner")
    .t-bold Code postal non reconnu.
      br
      | Merci de le mettre à jour depuis!{' '}
      router-link(:to="{ name: 'settings', params: {} }") vos paramètres
      |.
  div(v-if="postalCodeValid || iAmPartner")
    //-.t-bold Objet du rendez-vous
    NeedAdvice(
      :solutionCategories="enbldSltnsCtgrs"
      :selectedSolutionCategory="selectedSolutionCategory"
      @selectedSolutionCategory="updateSelectedCategory"
      small
    )
    .t-bold(v-if="selectedSolutionCategory !== 0") Sélectionnez un interlocuteur
      .flex.f-col.f-ai-center(v-if="!iAmPartner")
        MazBtnGroup.mt-4(v-model="selectedPartner" :items="availablePartners" size="lg" outline)
      UserFind(v-if="iAmPartner" :initialwillUser="futureRDVUserId"
        :createEnabled="false" :actionEnabled="false" v-on:selectedUser="setwillUserId"
      ) {{willUser}}
    div(v-if="selectedPartner")
      .mt-5(v-if="willPartnerDescription" v-html="willPartnerDescription")
      .mt-5(v-if="willPartnerSolutionDescription" v-html="willPartnerSolutionDescription")

    div(v-if="willPartner")
      div(v-if="willUsedUrl")
        .mb-5.mt-8.t-primary.t-bold.t-20 Plus de précisions sur le site de notre partenaire :
        iframe.w-full(
          v-if="!willUsedUrlIsAlternate" sandbox="allow-scripts allow-forms" :src="willUsedUrl" style="height: 400px;"
        )
        div(v-if="willUsedUrlIsAlternate")
          MazCheckbox.mb-5(v-model="acceptRecontact").
            En cochant cette case, j'accepte que mon numéro de téléphone et ma fiche d'inscription deviennent
            accessibles au partenaire afin qu'il puisse me recontacter directement si il le souhaite.
          .flex.f-jc-center
            MazBtn(v-if="willUsedUrlIsAlternate" @click="openPartnerSite" ) Ouvrir le site partenaire
      //- Full-power calendar.
      Calendrier.mt-5(v-else
        :willPartnerId="String((iAmPartner ? partnerId : willPartner) || '')"
        :willUserId="String((iAmPartner ? willUser : userId) || '')"
        @rdvCreated="emitRdvCreated")
  Modal(v-if="errorMessage" @close="errorMessage = null")
    Information( error v-if="errorMessage" :msg="errorMessage" @okClicked="errorMessage = ''" )
</template>

<script>
import { MazCheckbox, MazBtn, MazBtnGroup } from 'maz-ui'

import Calendrier from './Calendrier.vue'
import NeedAdvice from '../welcome-components/NeedAdvice.vue'
import Information from '../reusables/Information.vue'
import Modal from '../reusables/Modal.vue'
import UserFind from '../reusables/UserFind.vue'

import { prettyTime, prettyDate } from '@/libs/drftimestamp'
import { sMarked } from '@/libs/inputs'


export default {
  name: 'RendezVous',

  props: { futureRDVCategoryId: String, futureRDVPartnerId: String, futureRDVUserId: String },
  components: { MazCheckbox, MazBtn, MazBtnGroup, Calendrier, NeedAdvice, Information, Modal, UserFind },
  data: () => ({
    selectedDate: new Date(),
    checkboxRDVCreation: true,
    checkboxRDVSituationPoint: false,
    selectedSolutionCategory: 0,
    selectedPartner: 0,
    selectedUser: 0,
    willUserObject: null,
    errorMessage: '',
    acceptRecontact: true,
  }),
  computed: {
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    userId() { return this.$api.myUserId(); },
    partnerId() { return this.$api.partnerId(); },
    partners() { return this.$api.data.partners; },
    enbldSltnsCtgrs() { return this.iAmPartner ? this.enbldSltnsCtgrsPartner : this.enbldSltnsCtgrsPostal; },
    enbldSltnsCtgrsPartner() { return this.$api.enbldSltnsCtgrs(null, this.$api.partnerId()); },
    enbldSltnsCtgrsPostal() { return this.$api.enbldSltnsCtgrs(this.postalCode); },
    solutionCategoriesPartners() { return this.$api.solutionCategoriesPartners(this.postalCode); },
    willPartner() { return this.selectedPartner || this.partnerId; },
    willUser() { return this.iAmPartner ? this.selectedUser ? String(this.selectedUser) : null : this.userId; },
    willPartnerDescription() { return sMarked(this.partners[this.willPartner]?.description); },
    willPartnerSolution() { return this.partners[this.willPartner]?.solutions[this.selectedSolutionCategory]; },
    willPartnerSolutionDescription() { return sMarked(this.willPartnerSolution?.description); },
    willUsedUrl() { return this.willPartnerSolution?.iframe_enabled ? this.willPartnerSolution?.iframe_url : null; },
    willUsedUrlIsAlternate() { return !!this.willPartnerSolution?.iframe_as_alt; },
    availablePartners() { return this.solutionCategoriesPartners[this.selectedSolutionCategory].map(
      partnerId => ({ label: this.partners[partnerId].name, value: partnerId })
    ); },
    myRdvs() { return this.$api.myRdvs() },
    canTakeRdvs() { return true; },
    notManyRDV() { return false; },
    postalCode() { return String(this.$api.myUser()?.postal_code || ''); },
    postalCodeValid() { return this.postalCode.length === 5; },
  },
  methods: {
    updateSelectedCategory(category) { this.selectedSolutionCategory = category; },
    prettyDate(s) { return prettyDate(s); },
    prettyTime(s) { return prettyTime(s); },
    setwillUserId(userId) { this.selectedUser = userId; },
    openPartnerSite() {
      const u = this.$api.data?.users?.[this.userId];
      if (this.acceptRecontact) this.$api.makeUserVisitorOfPartner(u, this.willPartner);
      this.$api.tryOpenKioskUrl(this.willUsedUrl).catch(() => this.showPartnerSiteError());
    },
    showPartnerSiteError() {
      this.errorMessage = 'Impossible d\'ouvrir le site partenaire à cause d\'une erreur inconnue';
    },
    emitRdvCreated(id) { this.$emit('rdvCreated', id); },
  },
  beforeMount() {
    if (this.futureRDVCategoryId || this.futureRDVPartnerId || this.futureRDVUserId) {
      this.selectedSolutionCategory = this.$api.Id(this.futureRDVCategoryId);
      if (!this.$api.iAmPartner()) this.selectedPartner = this.$api.Id(this.futureRDVPartnerId);
      if (this.$api.iAmPartner()) this.selectedUser = this.$api.Id(this.futureRDVUserId);
    }
  },

}
</script>
