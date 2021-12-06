<template lang="pug">
.width-container
  .page.shadow.login(style="max-width: 700px; margin-left: auto; margin-right: auto")
    router-link.block(v-on:click="alert(3)" :to="{ name: 'home', params: {} }")
      GaiaLogo(style="width: 220px; display: block; margin: auto; padding-top: 20px; padding-bottom: 20px;")

    .login-field.t-center.t-bold.t-primary(v-if="futureRDVPartnerId")
      | {{`Prise de rendez-vous ${futureRDVSolutionName} avec ${futureRDVPartnerName}`}}

    // Register check
    .login-field(v-if="isRegister")
      .mb-3
        .mb-3.t-primary.t-bold
          MazSelect.mb-4(v-model="principalObjective" :options="principalObjectiveOptions"
            placeholder="Quel est votre objectif principal en intégrant Gaïa ?"
          )
        .mb-3.t-primary.t-bold
          | Quelle est aujourd’hui votre situation ?
        div
          MazCheckbox.ml-3(v-model="rCB.chomage_plus_d_un_an")
            | Vous êtes au chômage depuis plus d’1 an
          MazCheckbox.ml-3(v-model="rCB.sans_diplome")
            | Vous n’êtes pas ou peu diplômé, n’avez ni le CAP, ni le BEP, ni le Brevet des collèges
          MazCheckbox.ml-3(v-model="rCB.travailleur_handicape_en_recherche_d_emploi")
            | Vous êtes reconnu travailleur handicapé
          MazCheckbox.ml-3(v-model="rCB.moins_de_26_ans_neet")
            | Vous avez -26 ans et n’êtes ni en emploi ni en formation
          MazCheckbox.ml-3(v-model="rCB.allocataire_rsa")
            | Vous êtes allocataires du RSA
          MazCheckbox.ml-3(v-model="rCB.beneficiaire_d_une_protection_internationale")
            | Vous êtes bénéficiaire d’une protection internationale
          MazCheckbox.ml-3(v-model="rCB.femme_seule_avec_enfant")
            | Vous êtes une femme seule avec enfant
          MazCheckbox.ml-3(v-model="rCB.reside_un_quartier_prioritaire")
            | Vous résidez un quartier prioritaire
      .mb-3(v-if="isRegistrable")
        .flex.f-jc-center
          span.inline-flex.f-ai-center Merci d’indiquer le code postal de votre lieu d’habitation pour
            |  vérifier votre éligibilité :
          input.npt.pl-4.ml-4.t-15(
            style="width: 60px" :value="postalCode" @input="loadPostal" :maxlength="5" @keydown="checkNumberDown($event)"
          )
      .t-bold.t-grey(v-if="!isRegistrable") Si vous ne remplissez aucun de ces critères nous vous invitons à vous
        |  rapprocher de pôle emploi ou de la mission locale si vous avez moins de 26 ans.

    //- Login fields
    div(v-if="!isRegister" style="position: relative")
      MazInput.maz-mb-3.login-field(
        v-model="loginValue" placeholder="Identifiant" autocomplete="new-email" left-icon-name="person"
        clearable @input="resetError()" @focus="resetError()"
      )
      .login-tip
        .login-tip-inside.c4-shadow
          | Vous pouvez vous connecter avec votre identifiant généralement de la forme PrénomNom,
          |  ou, si cela a été renseigné, votre numéro de téléphone ou adresse E-mail.
    .t-bold.t-primary.login-field(v-if="isRegistrableConfirmed")
      | Votre adresse est bien prise en charge par Gaïa, vous pouvez procéder à votre inscription.
    .t-bold.login-field(v-if="isNotRegistrableConfirmed")
      | Votre code postal n'est pas pris en charge par Gaïa. Nous vous invitons à vous rapprocher
      |  de pôle emploi ou de la mission locale si vous avez moins de 25 ans.
    .flex(v-if="isRegistrableConfirmed" style="position: relative")
      MazInput.maz-mb-3.login-field(
        v-model="lastnameValue" placeholder="Nom" left-icon-name="person"
        clearable @input="resetError()" @focus="resetError()"
        style="width: calc(50% - 0px); margin-right: 10px;"
      )
      MazInput.maz-mb-3.login-field(
        v-model="firstnameValue" placeholder="Prénom"
        clearable @input="resetError()" @focus="resetError()"
        style="width: calc(50% - 0px); margin-left: 10px;"
      )
    MazInput.maz-mb-3.login-field(
      v-if="!isRegister || isRegistrableConfirmed"
      v-model="passwordValue" placeholder="Mot de passe" type="password" left-icon-name="lock"
      autocomplete="new-password" clearable @input="resetError()" @focus="resetError()"
    )
    MazInput.maz-mb-3.login-field(
      v-if="isRegistrableConfirmed"
      v-model="passwordConfirmValue" placeholder="Confirmation de mot de passe" type="password" left-icon-name="lock"
      autocomplete="new-password" clearable @input="resetError()" @focus="resetError()"
    )
    MazInput.maz-mb-3.login-field(
      v-if="isRegistrableConfirmed"
      v-model="emailValue" placeholder="Adresse Email" left-icon-name="email"
      autocomplete="new-password" clearable @input="resetError()" @focus="resetError()"
    )
    MazInput.maz-mb-3.login-field(
      v-if="isRegistrableConfirmed" v-model="phoneValue" placeholder="Numéro de téléphone" left-icon-name="phone"
      autocomplete="new-password" clearable @input="resetError()" @focus="resetError()" maxlength="13"
    )
    DateInput.login-field.mb-0(
      v-if="isRegistrableConfirmed" msg="Date de naissance" v-model="birthdateValue"
    )

    //- Error
    .loginerror(v-if="loginError.msg") {{loginError.msg}}

    //- Login buttons
    .login-buttons(v-if="!isRegister")
      button.btn.primary.w-full.block(v-on:click="login" style="margin-bottom: 16px;")
        | Connexion
      router-link.go-forgotten.t-center(:to="{ name: 'ask-reset-password', params: {} }")
        | Mot de passe oublié
      hr(style="margin-bottom: 16px; margin-top: 16px;")
      router-link.btn.primary.outline.w-full.block.mb-3(
        :to="{ name: 'register', params: { futureRDVCategoryId, futureRDVPartnerId } }"
      ) Inscription
      router-link.go-partner.t-right(
        :to="{ name: 'register', params: { futureRDVCategoryId, futureRDVPartnerId } }"
      )
      //- TODO router-link.go-partner.t-right( :to="{ name: 'register-as-partner', params: {} }" )
        | Inscription en tant que partenaire

    //- Register as beneficiary not confirmed
    .login-buttons(v-if="isRegister && !isRegistrableConfirmed")
      router-link.btn.primary.outline.w-full.block(:to="{ name: 'home', params: {} }")
        | Retour à l'Accueil

    //- Register as beneficiary buttons
    .login-buttons(v-if="isRegistrableConfirmed")
      button.btn.primary.w-full.block(v-on:click="register" style="margin-bottom: 16px;")
        | Créer mon compte
      //- TODO router-link.go-partner.t-right(
          :to="{ name: 'register-as-partner', params: {} }" outline color="login"
        ) Inscription en tant que partenaire
      router-link.btn.primary.outline.w-full.block(:to="{ name: 'home', params: {} }")
        | Annuler
    .login-buttons(v-if="isRegister && asPartner")
      button.btn.primary.w-full.block(v-on:click="login" style="margin-bottom: 16px;")
        | Créer mon compte partenaire Gaïa
      router-link.go-partner.t-right( :to="{ name: 'register', params: {} }" outline color="login")
        | Inscription en tant que simple utilisateur
  Modal(v-if="modalMessage" @close="modalMessage=''" @okClicked="okClicked")
    Information(:msg="modalMessage" @okClicked="okClicked" :align="'left'")
</template>


<script>
import { MazInput, MazCheckbox, MazSelect } from 'maz-ui'
import GaiaLogo from '../reusables/GaiaLogo'
import Modal from '../reusables/Modal'
import Information from '../reusables/Information'
import DateInput from '../reusables/DateInput'
import { checkNumberDown } from '@/libs/inputs.js'
import * as h from '@/libs/object-helpers/object-helpers'

export default {
  name: 'Login',

  components: { MazInput, MazCheckbox, Modal, Information, DateInput, MazSelect, GaiaLogo },
  props: {
    isRegister: Boolean,
    asPartner: Boolean,
    futureRDVCategoryId: String,
    futureRDVPartnerId: String,
    futureRoute: Object,
  },
  data () {
    return {
      // Login
      loginValue: '', passwordValue: '',
      // Register
      firstnameValue: '', lastnameValue: '', passwordConfirmValue: '', birthdateValue: '',
      emailValue: '', phoneValue: '',
      // Register criterias
      rCB: {
        chomage_plus_d_un_an: false,
        sans_diplome: false,
        travailleur_handicape_en_recherche_d_emploi: false,
        moins_de_26_ans_neet: false,
        allocataire_rsa: false,
        beneficiaire_d_une_protection_internationale: false,
        femme_seule_avec_enfant: false,
        reside_un_quartier_prioritaire: false,
      },
      postalCode: '',
      loginError: { msg: '' },
      modalMessage: '',
      frozen: false,
      goAfterOk: false,
      principalObjective: null,
    }
  },
  methods: {
    login() {
      if(this.frozen)return;
      this.frozen = true;
      this.$api.login(this.loginValue, this.passwordValue).then(() => {
        this.$router.push(this.nextRoute)
        this.frozen = false;
      }).catch(error => {
        this.loginError.msg = this.$api.errorHandler.login(error, this.loginError).msg;
        this.frozen = false;
      });
    },
    getSituations() { return { souhait_professionnel_integrant_gaia: this.principalObjective, ...this.rCB } },
    register() {
      if(this.frozen) return;
      if(this.passwordValue !== this.passwordConfirmValue) {
        this.loginError.msg = 'Le mot de passe et sa confirmation ne correspondent pas.';
        return;
      }
      this.frozen = true;
      this.$api.register(
        this.firstnameValue,
        this.lastnameValue,
        this.birthdateValue,
        this.emailValue,
        this.phoneValue,
        this.postalCode,
        this.passwordValue,
        this.getSituations(),
      ).then(user => {
        this.goAfterOk = true;
        this.modalMessage = `Le compte a été crée. Vous pourrez vous reconnecter avec le nom ` +
          `d'utilisateur ${user.username} et le mot de passe que vous avez défini.`;
        this.frozen = false;
      }).catch(error => {
        this.loginError.msg = this.$api.errorHandler.register(error, this.loginError).msg;
        this.frozen = false;
      });
    },
    resetError() { this.loginError.msg = ''; },
    checkNumberDown(e) { return checkNumberDown(e); },
    loadPostal(v) { this.postalCode = v.target.value; this.$api.updtPstl(this.postalCode); },
    okClicked() { this.modalMessage=''; if (this.goAfterOk) this.$router.push(this.nextRoute); },
  },
  computed: {
    isStatusOk() { return h.oV(this.rCB).some(v => !!v); },
    isRegistrable() { return this.isRegister && this.isStatusOk; },
    postalFull() { return this.isRegistrable && this.postalCode.length === 5; },
    isPostalNotLoaded() { return this.postalFull && this.$api.isPostalAvailable(this.postalCode) === undefined; },
    isRegistrableConfirmed() { return this.postalFull &&  this.$api.isPostalAvailable(this.postalCode); },
    isNotRegistrableConfirmed() { return this.postalFull && this.$api.isPostalAvailable(this.postalCode) === false; },
    nextRoute() {
      if (this.futureRoute) return this.futureRoute;
      if (!this.futureRDVCategoryId || !this.futureRDVPartnerId) return this.$api.iAmPartner() ?
        { name: 'partner', params: { id: String(this.$api.myPartnerAMId()) }} : { name: 'home' };
      return { name: 'rdvs', params: {
        futureRDVCategoryId: String(this.futureRDVCategoryId), futureRDVPartnerId: String(this.futureRDVPartnerId)
      } }
    },
    futureRDVSolutionName() { return this.$api?.data?.solutions?.[this.futureRDVCategoryId]?.name; },
    futureRDVPartnerName() { return this.$api?.data?.partners?.[this.futureRDVPartnerId]?.name; },
    principalObjectiveOptions() { return [
      { label: 'Découvrir un métier', value: 'decouvrir_un_metier' },
      { label: 'Consolider vos compétences', value: 'consolider_vos_competences' },
      { label: 'Créer une entreprise', value: 'creer_une_entreprise' },
      { label: 'Acquérir de l’expérience', value: 'acquerir_de_l_experience' },
    ] },
  },
}
</script>


<style scoped lang="scss">
.page.login { margin-top: 20px; padding-bottom: 20px; }
.login-icon { margin: 20px 0px 20px 20px; padding: 20px 20px 20px 20px; }
.login-title { padding: 20px 20px 20px 20px; font-size: 14pt; font-weight: bold; }
.login-buttons { padding: 0 20px 0 20px; }
.login-field { margin: 0 20px 20px 20px; }
.login-field+.login-tip {
  position: absolute; bottom: 50px; margin: 10px; left: 0; right: 0;
  background-color: #ffffff; color: $primary-color;
  visibility: hidden; opacity: 0; transition: visibility 0.15s, opacity 0.15s linear;
  display: flex; justify-content: center; align-items: center;
}
.login-field:hover+.login-tip { visibility: visible; opacity: 1; }
.login-tip-inside { padding: 10px; display:inline-block; justify-content: center; }
.go-partner, .go-forgotten, a.login-a {
  display: block; transition: 0.3s; text-decoration: underline; text-decoration-color: transparent;
}
.go-partner:hover, .go-forgotten:hover, a.login-a:hover { text-decoration-color: $primary-color; }
.loginerror {
  padding: 10px; margin-top: 20px; margin-bottom: 20px; border-top: 2px solid red; border-bottom: 2px solid red;
  background-color: rgba(255, 0, 0, 0.1); color: red; text-align: center; white-space: pre-wrap;
}
</style>
