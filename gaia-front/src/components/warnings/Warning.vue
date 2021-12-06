<template lang="pug">
  .card.shadow.warning.relative
    div
      .flex
        MazBtn.warning-icon(icon-name="warning" fab color="warning")
        .warning-title.t-bold {{msg}}
        .warning-close-button(v-if="hideable" @click="$emit('hideIt', warningId)")
    .warning-buttons
      MazBtn.w-full(v-if="btn" outline color="warning" v-on:click="clicked") {{btn}}
</template>

<script>
import { MazBtn } from 'maz-ui'

export default {
  name: 'Warning',
  components: { MazBtn },
  props: { visioId: String, visioUrl: String, hideable: {type: Boolean, default: false}, obj: Object, type: String },
  data () { return { } },
  methods: {
    clicked() {
      if (this.action) return this.action();
      if (this.url) this.$router.push(this.url);
      else { this.$api.startVisio(this.$api.Id(this.visioId), this.visioUrl); this.$router.push({name: 'visio'}); }
    },
  },
  computed: {
    myUserId() { return this.$api.data?.userId; },
    isForm() { return this.obj && this.type === 'form'; },
    isAllForms() { return this.type === 'allForms'; },
    isRDV() { return this.type === 'rdv'; },
    warningId() { return [this.type, this.obj?.id]; },
    msg() {
      if (this.isAllForms) return 'Plusieurs formulaires sont à compléter';
      if (this.isForm) {
        if (this.obj.validationformulaire) return 'Demande de validation de complétion du rendez-vous';
        if (this.obj.validation) return 'Demande de validation d\'informations demandées par un partenaire';
        return `${this.$api.formTypeAltName(this.obj.type)} en attente`;
      }
      if (this.isRDV) {
        // msg: `Vous avez un rendez-vous visio dans ${myNextRdv.start} minutes`, // TODO : ou en cours
        return `Vous avez un rendez-vous visio en cours`; // TODO : ou en cours
      }
      return '';
    },
    url() {
      // TODO : this.obj.validationformulaire ? 'formulaire/validationrdv
      if (this.isAllForms) return `/profile/${this.myUserId}`;
      if (this.isForm) return `/formulaire/${this.obj.id}`;
      return null;
    },
    btn() {
      if (this.isAllForms) return 'Voir les formulaires';
      if (this.isForm) {
        return !this.isForm ? null : this.obj.validation ? 'Voir la demande' : 'Compléter le formulaire';
      }
      if (this.isRDV) return 'Accéder au rendez-vous';
      return null;
    },

  }
}
// const nextKioskRdv = nextRDVOfList(this.apiData.kiosk.rdvs);
// const nextKioskWarning = (!nextKioskRdv || (myNextRdv && nextKioskRdv.id === myNextRdv.id)) ? undefined
//   : nextKioskRdv.open ? {
//     msg: `Un rendez-vous visio accessible sans compte est prévu dans ${nextKioskRdv.start} minutes`, // TODO : ou en cours
//     visioUrl: 'nextKioskRdv.visioUrl',
//     btn: 'Accéder au rendez-vous',
//   } : this.iAmLogged ? {
//     msg: `Un rendez-vous visio est prévu pour un autre utilisateur dans ${nextKioskRdv.start} minutes. Merci de bientôt vous déconnecter.`, // TODO : ou en cours
//     action: this.$api.logout,
//     btn: 'Déconnexion',
//   } : {
//     msg: `Un rendez-vous visio au nom de X est prévu dans ${nextKioskRdv.start} minutes.`, // TODO : ou en cours
//     url: 'login',
//     btn: 'Connexion',
//   };
</script>


<style scoped lang="scss">
.warning-icon { margin: 20px 0px 20px 20px; padding: 20px 20px 20px 20px; }
.warning-title { padding: 20px 20px 20px 20px; font-size: 14pt; }
.warning-buttons { padding: 0 20px 20px 20px; }

.warning-close-button {
  height: 26px; width: 26px; position: absolute; right: 13px; top: 13px;
  color: $grey-color; transition: 0.3s; cursor: pointer;
}
.warning-close-button:hover { color: black; }
.warning-close-button:before{ display: inline-block; font-size: 47px; position: absolute; top: -13px; content: "\00d7"; }
.warning-close-button:after{
  display: inline-block; font-size: 20px;
  position: absolute; bottom: 25px; padding-top: 10px; padding-bottom: 10px; left: -180px; right: -40px;
  text-align: center; background-color: white;
  content: "Me le rappeler plus tard";
  box-shadow:0 0 20px 0 rgba(0,0,0,.1);
  z-index: 66000;
  visibility: hidden; opacity: 0; transition: visibility 0.15s, opacity 0.15s linear;
}
.warning-close-button:hover:after{ visibility: visible; opacity: 1; }

</style>
