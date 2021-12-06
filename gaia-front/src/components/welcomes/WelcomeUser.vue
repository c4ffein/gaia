<template lang="pug">
.welcome-container
  //-div
    .gaia-title-container.absolute
      .gaia-title.t-white.t-bold
        | Gaïa : vous accompagner vers l’emploi
      //-
        .gaia-title-buttons
          div(v-if="iAmLogged")
            button.btn.outline(style="margin-bottom: 10px;min-width: 232px;" @click="$router.push('/profile')")
              | Accès à mon profil
            button.btn.outline(style="margin-bottom: 10px;min-width: 232px;" @click="$router.push('/rdv')")
              | Accès à mes rendez-vous

  //- PartnersLogos(:height="70" style="margin: 30px;")

  .title.t-primary.t-center.t-bold(v-if="!iAmLogged")
    | Pour accéder à Gaïa indiquez le code postal de votre lieu de résidence
    .flex.f-jc-center
      input.npt.block.pl-4.mt-5.t-15(
        style="width: 60px" v-model="selectedAreaCode" :maxlength="5" @keydown="checkNumberDown($event)"
      )

  .title.t-primary.t-center.t-bold(v-if="iAmLogged && !areaCodeFull") Pas de code postal lié à votre compte.
    br
    | Merci de le renseigner dans vos!{' '}
    router-link(:to="{ name: 'settings', params: {} }") paramètres
    |.


  div(v-if="enabledSolutionsCategories.length === 0 && areaCodeFull")
    .title.t-primary.t-center.t-bold Aucun partenaire disponible actuellement pour votre code postal.

  div(v-if="enabledSolutionsCategories.length !== 0")
    .title.t-primary.t-center.t-bold.mx-7
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
import CPDuo from '../welcome-components/CPDuo.vue'
import NeedAdvice from '../welcome-components/NeedAdvice.vue'
import { checkNumberDown } from '@/libs/inputs.js'


export default {
  name: 'WelcomeUser',
  components: { CPDuo, NeedAdvice },
  data () {
    return {
      selectedSolutionCategory: 0,
      selectedAreaCode: '',
    }
  },
  computed: {
    partners() { return this.$api.data.partners; },
    solutionCategories() { return this.$api.data.solutions; },
    solutionCategoriesPartners() { return this.$api.solutionCategoriesPartners(this.areaCode); },
    enabledSolutionsCategories() { return this.areaCodeFull ?
      this.$api.enbldSltnsCtgrs(this.areaCode) : []; },
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    userId() { return this.$api.myUserId(); },
    areaCode() { return this.iAmLogged ? String(this.$api.myUser()?.postal_code) : this.selectedAreaCode },
    areaCodeFull() { return this.areaCode.length === 5; },
  },
  methods: {
    updateSelectedCategory(category) { this.selectedSolutionCategory = category; },
    checkNumberDown(e) { return checkNumberDown(e); },
  }
}
</script>

<style scoped lang="scss">
.page.welcome { padding-bottom: 36px; }
.gaia-title-container { top: 123px; z-index: 420; margin: 60px 6% 60px 18%; }
.gaia-title { margin-bottom: 20px; font-size: 34px; text-shadow: 0 0 15px #000000; }
.title { margin-top: 40px; margin-bottom: 20px; font-size: 24px; }
</style>
