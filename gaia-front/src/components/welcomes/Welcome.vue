<template lang="pug">
div(style="flex-grow: 1;")
  WelcomeAdmin(v-if="iAmLogged && iAmAdmin")
  WelcomePartner(v-if="iAmLogged && iAmPartner && !iAmGreat")
  WelcomeKioskOverseer(v-if="iAmLogged && iAmJustKioskOverseer")
  WelcomeUser(v-if="iAmLogged && iAmRegular")
  WelcomeRandom(v-if="!iAmLogged")
</template>

<script>
import CPDuo from '../welcome-components/CPDuo.vue'
import NeedAdvice from '../welcome-components/NeedAdvice.vue'
import WelcomeRandom from './WelcomeRandom.vue'
import WelcomeAdmin from './WelcomeAdmin.vue'
import WelcomeUser from './WelcomeUser.vue'
import WelcomePartner from './WelcomePartner.vue'
import WelcomeKioskOverseer from './WelcomeKioskOverseer.vue'
import Presentation from './Presentation.vue'


export default {
  name: 'Welcome',
  components: {
    CPDuo, NeedAdvice,
    WelcomeUser, WelcomeRandom, WelcomeAdmin, WelcomePartner, WelcomeKioskOverseer, Presentation,
  },
  beforeCreate() {
    if(this.$api.iAmPartner()) this.$router.push({name: 'partner', params: {id: String(this.$api.partnerId())}});
  },
  computed: {
    partners() { return this.$api.data.partners; },
    solutionCategories() { return this.$api.data.solutions; },
    solutionCategoriesPartners() { return this.$api.solutionCategoriesPartners(this.areaCode); },
    enabledSolutionsCategories() { return this.areaCodeValid ? this.$api.enbldSltnsCtgrs(this.areaCode) : []; },
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    iAmAdmin() { return this.$api.iAmAdmin(); },
    iAmGreat() { return this.$api.iAmGreat(); },
    iAmJustKioskOverseer() { return this.$api.iAmJustKioskOverseer() },
    iAmRegular() { return this.$api.iAmRegular() },
    userId() { return this.$api.myUserId(); },
    areaCode() { return this.iAmLogged ? String(this.$api.myUser()?.postal_code) : this.selectedAreaCode },
    areaCodeValid() { return this.areaCode.length === 5; },
  },
}
</script>

<style scoped lang="scss">
.page.welcome { padding-bottom: 36px; }
.gaia-title-container { top: 123px; z-index: 420; margin: 60px 6% 60px 18%; }
.gaia-title { margin-bottom: 20px; font-size: 34px; text-shadow: 0 0 15px #000000; }
.title { margin-top: 40px; margin-bottom: 20px; font-size: 24px; }
</style>
