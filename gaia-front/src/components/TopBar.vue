<template lang="pug">
.topbar.fixed.flex.f-jc-space-between.f-ai-center.w-full(
  :class="(showSimple ? iAmSuper ? 'sbf bg-white' : 'sbf bg-primary' : 'bg-white') + (transparent ? '' : ' c4-shadow')"
  :style="showSimple ? iAmSuper ? {} : { backgroundImage: 'url(' + image + ')' } : { height: '120px' }"
)
  .shade.absolute(v-if="showSimple && !iAmSuper")
  router-link(v-if="!showSimple" :to="{ name: 'home', params: {} }")
    GaiaLogo.gaia-logo
  PartnersLogos.f-auto.nonshlagged(v-if="!showSimple" :height="70")
  .sbft.t-white.t-bold(v-if="showSimple && !iAmPartner && !iAmGreat") {{ username }}
  .sbft.t-white.t-bold(v-if="showSimple && iAmPartner && !iAmGreat") {{ partnername }}
  .sbft.t-white.t-bold(v-if="showSimple && iAmAdmin") Espace Administrateur
  .sbft.t-black.t-bold(v-if="showSimple && iAmSuper") Superuser.
  .topbar-buttons(v-if="!showSimple")
    router-link.btn.primary(v-if="!iAmLogged" :to="{ name: 'login' }")
      | Connexion
    router-link.btn.primary(
      v-if="iAmLogged && !iAmPartner" :to="{ name: 'profile', params: {id: String(userId)}}")
      | Mon Compte
    router-link.btn.primary(v-if="iAmLogged && iAmPartner" :to="{ name: 'partner', params: {id: String(iAmPartner)} }")
      | Mon Compte
    .btn.primary(v-if="iAmLogged" v-on:click="logOut")
      | Déconnexion
</template>

<script>
import PartnersLogos from './welcome-components/PartnersLogos.vue'
import GaiaLogo from './reusables/GaiaLogo.vue'

export default {
  name: 'TopBar',

  components: { PartnersLogos, GaiaLogo },
  data: () => ({ image: require("@/assets/unsplash/fields/ales-me-m.jpg"), }),
  props: { transparent: Boolean },
  computed: {
    userId() { return this.$api.myUserId(); },
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    iAmAdmin() { return this.$api.iAmAdmin(); },
    iAmSuper() { return this.$api.iAmSuper(); },
    iAmGreat() { return this.$api.iAmGreat(); },
    partnerId() { return this.$api.partnerId(); },
    user() { return this.$api.myUser(); },
    username() { return (this.user && this.user.id) ? ` ${this.user.firstname} ${this.user.lastname}` : ''; },
    partnername() { return this.iAmPartner ? this.$api.data.partners[this.$api.partnerId()]?.name : ''; },
    showSimple() { return this.iAmLogged; },
  },
  // watch: { '$route': {
  //   deep: true, handler: function (page) { this.showSimple = this.isNamePageBannerSimple(String(page.name)); }
  // } },
  methods: {
    logOut() { // TODO : Watdo if cant revoke token on server, use then etc
      this.$api.logout()
      if (String(this.$router.currentRoute.name) !== 'home') this.$router.push('/'); // TODO SEND SIGNAL TO APP INSTEAD
    },
    // isNamePageBannerSimple(page) {
    isNamePageBannerSimple() {
      return this.iAmLogged;
      // return page !== 'home' && page !== 'login' && page !== 'register' && page !== 'register-as-partner';
    },
  },
  // beforeMount() { this.showSimple = this.isNamePageBannerSimple(this.$route.name); },
}
</script>

<style scoped lang="scss">
.topbar { z-index: 9000; top: 0; left: 0; height: 100px; box-sizing: border-box; padding-left: 5%; padding-right: 1%; }
.sbf { background-size: cover; background-repeat: no-repeat; background-position: center center; }  // dynamic so...
.sbft { position: absolute; bottom: 10px; left: 10px; font-size: 40px; }
.gaia-logo { height: 66px; margin-left: 6%; margin-right: auto; display: inline-block; float: left; }
.topbar-buttons { display: inline-block; padding-right: 25px; margin-left: auto; padding-left: 10px; float: right; }
.btn { display: inline-block; box-shadow: none; margin-left: 20px; }
@media (max-width: 649px) { .nonshlagged { display: none; } }
.shade { top: 0; left: 0; right: 0; bottom: 0; background-color: $primary-color; opacity: 0.7; }
</style>
