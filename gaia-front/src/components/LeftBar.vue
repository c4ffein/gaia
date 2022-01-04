<template lang="pug">
.leftbar
  .leftbar-buttons
    router-link(v-if="iAmLogged" :to="{ name: 'settings', params: {} }") Mes paramètres
    router-link(v-if="iAmRegular" :to="{ name: 'profile', params: {id: String(userId)}}")
      | Mes données personnelles
    router-link(v-if="iAmPartner" :to="{ name: 'partner', params: {id: String(iAmPartner)} }")
      | Mon offre de service
      //- TODO: Mes offres de service si plusieurs
    router-link(v-if="iAmLogged && !iAmJustKioskOverseer" :to="{ name: 'documents', params: {} }") Mes documents

    router-link(v-if="iAmPartner || iAmGreat" :to="{ name: 'user-list', params: {} }")
      | {{userListName}}

    router-link(v-if="iAmGreat" :to="{ name: 'solutions', params: {} }")
      | Liste des solutions

    router-link(v-if="iAmGreat" :to="{ name: 'partners', params: {} }") Gestion des partenaires

    router-link(v-if="iAmGreat" :to="{ name: 'kiosks', params: {} }") Gestion des kiosques

    router-link(:to="{ name: 'rdvs', params: {} }") Programmation des RDV
    a(v-if="iAmLogged" v-on:click="logOut") Déconnexion
    router-link.gaia-button(:to="{ name: 'home', params: {} }")
      GaiaLogo.mx-auto(style="width: 120px;")
</template>


<script>
import GaiaLogo from './reusables/GaiaLogo';

export default {
  name: 'LeftBar',
  components: { GaiaLogo },
  computed: {
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    iAmGreat() { return this.$api.iAmGreat(); },
    iAmRegular() { return this.$api.iAmRegular(); },
    iAmJustKioskOverseer() { return this.$api.iAmJustKioskOverseer(); },
    iAmSuper() { return this.$api.iAmSuper(); },
    userId() { return this.$api.myUserId(); },
    userListName() { return this.iAmPartner ? 'Liste des bénéficiaires' : 'Liste d\'utilisateurs'; },
  },
  methods: {
    logOut() { // TODO : Watdo if cant revoke token on server, use then etc
      this.$api.logout()
      if (String(this.$router.currentRoute.name) !== 'home') this.$router.push('/'); // TODO SEND SIGNAL TO APP INSTEAD
    },
  },
}
</script>


<style scoped lang="scss">
.leftbar { top: 0; left: 0; height: 100%; background-color: white; display: inline-block; }
a.gaia-button.router-link-active { background-color: white; }
a.gaia-button:hover { filter: brightness(90%); }
.leftbar-buttons { display: inline-block; padding-right: 5px; padding-left: 10px; width: 100%; }
.leftbar-buttons > a {
  @extend .no-select;
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  font-weight: bold;
  margin-top: 13px;
  box-shadow: none;
  text-align: center;
  text-decoration: none;
  padding: 13px 5px;
  border-radius: 10px;
  color: $primary-color;
  transition: 0.2s;
}
.leftbar-buttons > a:not(.router-link-active):hover { background-color: rgba(0, 0, 0, 0.1); }
.leftbar-buttons > .router-link-active { color: white; background-color: $primary-color; }
</style>
