<template lang="pug">
.welcome-container
  div
    //-.gaia-title-container.absolute
      .flex.gap-7
        GaiaLogo(style="height: 200px;" insideColor="#ffffff" outsideColor="#dddddd")
        .t-30.t-white.pt-8(style="max-width: 700px").
          vous accompagne vers l’emploi

      .about-button.absolute(style="bottom: 0px; color: white;")
        router-link.btn.white.outline.block(style="border: 2px solid #ffffff;" :to="{ name: 'about', params: {} }")
          | En savoir plus sur le projet Gaïa

  .title.t-primary.t-center.t-bold.mx-7(v-if="!iAmLogged")
    | Pour accéder à Gaïa,!{' '}
    router-link(:to="{ name: 'login' }") connectez-vous
    |  si vous possédez déjà un compte, sinon indiquez le code postal de votre lieu de résidence
    .flex.f-jc-center.gap-5.mt-5
      input.npt.block.pl-4.t-15(
        style="width: 60px" v-model="selectedAreaCode" :maxlength="5" @keydown="checkNumberDown($event)"
      )

  //- div(v-if="enabledSolutionsCategories.length === 0 && areaCodeFull && areaCodeCovered")
    .title.t-primary.t-center.t-bold Aucun partenaire disponible actuellement
      span(v-if="iAmLogged") pour votre code postal
      |.
      br
      span Vous pouvez cependant!{' '}
        span(v-if="!iAmLogged")
          router-link(:to="{ name: 'register', params: {} }")  créer votre compte
          |  ou!{' '}
          router-link(:to="{ name: 'login', params: {} }")  vous connecter
        router-link(v-if="iAmLogged && !iAmPartner" :to="{ name: 'profile', params: {id: String(userId)}}")
          | accéder à votre compte
        router-link(v-if="iAmPartner" :to="{ name: 'partner', params: {id: String(iAmPartner)} }") accéder à votre compte
      | .

  .title.t-primary.t-center.t-bold(v-if="notCovered") Désolé ! Votre commune ne participe pas encore au projet Gaïa
  .title.t-primary.t-center.t-bold(v-if="loadedFailed") Impossible de contacter le service pour vérifier le code
    |  postal. Merci de vérifier la connexion à internet ou de contacter un responsable.

  div(v-if="!noSolutions")
    .title.t-primary.t-center.t-bold
      | Découvrez l’offre d’accompagnement de nos partenaires et prenez un rendez-vous avec un conseiller
    NeedAdvice(
      :solutionCategories="enabledSolutionsCategories"
      :selectedSolutionCategory="selectedSolutionCategory"
      @selectedSolutionCategory="updateSelectedCategory"
    )
    div(v-if="selectedSolutionCategory !== 0 && solutionCategoriesPartners[selectedSolutionCategory].length !== 0")
      div(v-for="(partner, index) in solutionCategoriesPartners[selectedSolutionCategory]")
        CPDuo(
          v-if="partners[partner].solutions[selectedSolutionCategory].enabled"
          :title="partners[partner].name"
          :texts="partners[partner].solutions[selectedSolutionCategory].description"
          :reversed="Boolean(index % 2)"
          :futureRDVCategoryId="String(selectedSolutionCategory)",
          :futureRDVPartnerId="String(partner)",
        )

</template>

<script>
import PartnersLogos from './PartnersLogos.vue'
import GaiaLogo from '../reusables/GaiaLogo.vue'
import CPDuo from './CPDuo.vue'
import NeedAdvice from './NeedAdvice.vue'
import { checkNumberDown } from '@/libs/inputs.js'


export default {
  name: 'OffersGetLinkToRdv',
  components: { CPDuo, NeedAdvice, GaiaLogo, PartnersLogos },
  data () {
    return { selectedSolutionCategory: 0, selectedAreaCode: '', postalResetter: null, lstRsttrId: 0, }
  },
  computed: {
    partners() { return this.$api.data.partners; },
    solutionCategories() { return this.$api.data.solutions; },
    solutionCategoriesPartners() { return this.$api.solutionCategoriesPartners(this.areaCode); },
    enabledSolutionsCategories() { return this.areaCodeFull ? this.$api.enbldSltnsCtgrs(this.areaCode) : []; },
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    userId() { return this.$api.myUserId(); },
    areaCode() { return this.iAmLogged ? String(this.$api.myUser()?.postal_code) : this.selectedAreaCode },
    areaCodeFull() { return this.areaCode.length === 5; },
    isKiosk() { return false },  // TODO : KIOSK
    noSolutions() { return this.enabledSolutionsCategories.length === 0; },
    notCovered() { return this.areaCodeFull && this.$api.data.postals[this.areaCode] && this.noSolutions; },
    loadedFailed() { return false },  // TODO
  },
  methods: {
    updateSelectedCategory(category) { this.selectedSolutionCategory = category; },
    checkNumberDown(e) { if (this.isKiosk) this.rgstrRsttr(); return checkNumberDown(e); },
    getRst() { this.lstRsttrId++; return this.lstRsttrId; },
    rgstrRsttr() { const i = this.getRst(); setTimeout(() => { if (i === this.lstRsttrId) this.rstPstl()}, 120000); },
    rstPstl() { this.selectedAreaCode = ''; },
  }
}
</script>

<style scoped lang="scss">
.page.welcome { padding-bottom: 36px; }
// .gaia-title-container { top: 123px; z-index: 420; margin: 60px 6% 60px 18%; }
// .gaia-title-container { top: 121px; height: 270px; width: calc(76% - 40px); z-index: 420; margin: 40px calc(20px + 12%) 40px calc(20px + 12%); box-sizing: border-box; }
.gaia-title-container { height: 270px; width: calc(76% - 40px); z-index: 420; margin: 40px calc(20px + 12%) 40px calc(20px + 12%); box-sizing: border-box; }
//.gaia-title-container { top: 121px; height: 174px; width: calc(76% - 40px); z-index: 420; margin: 40px calc(20px + 12%) 40px calc(20px + 12%); box-sizing: border-box; }
// .gaia-title { margin-bottom: 40px; font-size: 34px; text-shadow: 0 0 15px #000000; }
.gaia-title { margin-bottom: 20px; font-size: 40px; }
// .gaia-subtitle { margin-bottom: 20px; font-size: 20px; text-shadow: 0 0 15px #000000; color: #ffffff; }
.gaia-subtitle { margin-bottom: 20px; font-size: 20px; color: #ffffff; }
// .gaia-subtitle { margin-bottom: 20px; font-size: 20px; color: $primary-color; }
.title { margin-top: 40px; margin-bottom: 20px; font-size: 24px; }

// .tempbg { background-color: $primary-color; }
.tempbg { background-color: #1362aa; }
</style>
