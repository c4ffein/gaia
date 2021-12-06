<template lang="pug">
.welcome-container
  .title.t-primary.ml-8.t-bold Bienvenue - Compte Gestionnaire Kiosques
  //-.page
    button.btn.primary Export des statistiques
    button.btn.primary.ml-9 Export des statistiques

  //- PartnersLogos(:height="70" style="margin: 30px;")
</template>

<script>
export default {
  name: 'WelcomeKioskOverseer',
  computed: {
    partners() { return this.$api.data.partners; },
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    userId() { return this.$api.myUserId(); },
    areaCode() { return this.iAmLogged ? String(this.$api.myUser()?.postal_code) : this.selectedAreaCode },
    areaCodeFull() { return this.areaCode.length === 5; },
    partnerId() { return this.$api.partnerId() },
    partnerName() { return this.$api.data.partners?.[this.partnerId]?.name || ''; }
  },
}
</script>

<style scoped lang="scss">
.page.welcome { padding-bottom: 36px; }
.gaia-title-container { top: 123px; z-index: 420; margin: 60px 6% 60px 18%; }
.gaia-title { margin-bottom: 20px; font-size: 34px; text-shadow: 0 0 15px #000000; }
.title { margin-top: 40px; margin-bottom: 20px; font-size: 24px; }
</style>
