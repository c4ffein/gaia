<template lang="pug">
.welcome-container
  .title.t-primary.t-center.t-bold.mx-7(v-if="!iAmLogged")
    | Pour accéder à Gaïa,!{' '}
    router-link(:to="{ name: 'login' }") connectez-vous
    |  si vous possédez déjà un compte, sinon indiquez le code postal de votre lieu de résidence
    .flex.f-jc-center.gap-5.mt-5
      input.npt.block.pl-4.t-15(
        style="width: 60px" v-model="selectedAreaCode" :maxlength="5" @keydown="checkNumberDown($event)"
      )

  .title.t-primary.t-center.t-bold(v-if="notCovered") Désolé ! Votre commune ne participe pas encore au projet Gaïa
  .title.t-primary.t-center.t-bold(v-if="loadedFailed") Impossible de contacter le service pour vérifier le code
    |  postal. Merci de vérifier la connexion à internet ou de contacter un responsable.

  div(v-if="!noSolutions")
    .title.t-primary.t-center.t-bold {{ a.discover }}
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
import { reusablesAssets } from '@/assets/amnyos-assets'


export default {
  name: 'OffersGetLinkToRdv',
  components: { CPDuo, NeedAdvice, GaiaLogo, PartnersLogos },
  data () {
    return { selectedSolutionCategory: 0, selectedAreaCode: '', postalResetter: null, lstRsttrId: 0, a: reusablesAssets }
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
.title { margin-top: 40px; margin-bottom: 20px; font-size: 24px; }
</style>
