<template lang="pug">
.width-container
  .section-title.t-bold.t-primary Mes Paramètres
  .page.px-5.py-5

    //- Shared
    div
      .t-primary.t-20.t-bold.mb-3 Mes informations de connexion
      //- TODO: HELP?
      MazInput.mb-3(disabled placeholder="Adresse e-mail" :value="emailVal" @input="updtTempEmail($event)" )
      MazInput.mb-3(disabled placeholder="Numéro de téléphone" :value="phoneVal" @input="updtTempPhone($event)" )

      button.btn.primary.outline(@click="showChangePasswordModal=true") Changement de mot de passe

    //- Beneficiary
    div(v-if="iAmRegular")
      .t-primary.t-20.t-bold.mb-3.mt-5 Code postal
      input.npt.pl-4.ml-4.t-15(style="width: 60px"
        v-bind:value="pstlCodeP" @input="updtPostal" :maxlength="5" @keydown="checkNumberDown($event)"
      )

      .t-primary.t-20.t-bold.mb-3.mt-5 Me rappeler de mes rendez-vous
      MazCheckbox.mb-2(:disabled="!emailVal" :value="rmbrEmail" @input="updtrmbrEmail($event)" ) Par email
        .disable-warning - Renseignez une adresse email
      MazCheckbox.mb-2(:disabled="!phoneVal" :value="rmbrPhone" @input="updtrmbrPhone($event)" ) Par téléphone
        .disable-warning - Renseignez un numéro de téléphone

      .t-primary.t-20.t-bold.mb-3.mt-5 Date des rappels
      MazCheckbox.mb-2(:disabled="!rmbrSameDayEnabled" :value="rmbrSameDay" @input="updtrmbrTday($event)")
        | Me prévenir le jour même
      MazCheckbox.mb-2( :disabled="!rmbrYesterDayEnabled" :value="rmbrYesterDay" @input="updtrmbrYday($event)")
        | Me prévenir la veille
      button.btn.primary.block.mt-5.w-full(v-if="saveEnabled" @click="saveUserSetting") Enregistrer

    //- Partner
    div(v-if="iAmPartner")
      .t-primary.t-20.t-bold.mb-3.mt-5 Délimitation de demande de rendez-vous
      MazCheckbox.mb-2(:value="openToFirstRdvBeneficiaries" @input="t.openToFirstRdvBeneficiaries = $event" )
        | Ouverte aux utilisateurs déjà bénéficiaires
        .maz-checkbox-hint Permettre aux utilisateurs du système Gaïa qui ne font pas encore partie
          |  de vos bénéficiaires de faire une demande de rendez-vous.
      MazCheckbox.mb-2(:value="openToFirstRdvAll" @input="t.openToFirstRdvAll = $event" )
        | Ouverte aux utilisateurs non-bénéficiaires
        .maz-checkbox-hint Permettre aux utilisateurs du système Gaïa qui ne font pas encore partie
          |  de vos bénéficiaires de faire une demande de rendez-vous.
      .t-primary.t-15.t-bold.mb-3.mt-5 Délimitation durée du premier rendez-vous (en minutes)
      .flex.f-ai-center
        div Durée minimale
        input.npt.pl-4.ml-4.t-15(@input="updtTempFirstMin"
          style="width: 60px" :value="firstMinimumRdvTime" :maxlength="3" @keydown="checkNumberDown($event)"
        )
        .ml-5 Durée maximale
        input.npt.pl-4.ml-4.t-15(@input="updtTempFirstMax"
          style="width: 60px" :value="firstMaximumRdvTime" :maxlength="3" @keydown="checkNumberDown($event)"
        )
      .t-primary.t-15.t-bold.mb-3.mt-5 Délimitation durée des rendez-vous suivants (en minutes)
      .flex.f-ai-center
        div Durée minimale
        input.npt.pl-4.ml-4.t-15(@input="updtTempNextMin"
          style="width: 60px" :value="nextMinimumRdvTime" :maxlength="3" @keydown="checkNumberDown($event)"
        )
        .ml-5 Durée maximale
        input.npt.pl-4.ml-4.t-15(@input="updtTempNextMax"
          style="width: 60px" :value="nextMaximumRdvTime" :maxlength="3" @keydown="checkNumberDown($event)"
        )
      button.btn.primary.block.mt-5.w-full(v-if="saveEnabled" @click="savePartnerSetting") Enregistrer

    //- Beneficiary
    div(v-if="iAmLogged && !iAmGreat")
      .t-primary.t-20.t-bold.mb-3.mt-5 Délimitation de demande de rendez-vous
      //- TODO : Kiosk list
      button.btn.primary.outline(@click="showAvailabilitiesManagement=true") Gestion des disponibilités

  Modal(
    v-if="showChangePasswordModal || showAvailabilitiesManagement"
    @close="showChangePasswordModal = false; showAvailabilitiesManagement = false" unlimited
  )
    AvailabilitiesManagement(
      v-if="showAvailabilitiesManagement" @close="showAvailabilitiesManagement = false"
      :userId="manageTimeUser" :kioskId="manageTimeKiosk" :partnerId="manageTimePartner"
    )
    ChangePassword(v-if="showChangePasswordModal" @close="showChangePasswordModal = false")
</template>

<script>
import { MazCheckbox, MazInput } from 'maz-ui'
import { checkNumberDown } from '@/libs/inputs.js'
import ChangePassword from './ChangePassword'
import Modal from '../reusables/Modal'
import AvailabilitiesManagement from '../rdvs/AvailabilitiesManagement'
import * as h from '@/libs/object-helpers/object-helpers'

export default {
  name: 'Settings',

  props: { msg: String },
  components: { MazCheckbox, MazInput, Modal, ChangePassword, AvailabilitiesManagement },
  data () { return { t: {}, showChangePasswordModal: false, showAvailabilitiesManagement: false } },
  computed: {

    settings() { return this.$api?.data?.userSettings?.[this.$api.myUserId()] || {}; },

    // Shared
    emailVal() { if(this.t.email === '') return ''; return this.t.email || this.$api.myUser()?.email; },
    phoneVal() { if(this.t.phone === '') return ''; return this.t.phone || this.$api.myUser()?.phone; },
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    iAmGreat() { return this.$api.iAmGreat(); },
    iAmRegular() { return this.$api.iAmRegular(); },
    saveEnabled() { return h.oK(this.t).length !== 0; },

    // Beneficiary
    rmbrPhone() { return !!this.tOrGet('rmbrPhone', this.settings.remember_through_phone); },
    rmbrEmail() { return !!this.tOrGet('rmbrEmail', this.settings.remember_through_email); },
    rmbrPhoneAndAvlbl() { return this.rmbrPhone && !!this.phoneVal; },
    rmbrEmailAndAvlbl() { return this.rmbrEmail && !!this.emailVal; },
    rmbrSameDayEnabled() { return this.rmbrEmailAndAvlbl || this.rmbrPhoneAndAvlbl; },
    rmbrYesterDayEnabled() { return this.rmbrEmailAndAvlbl || this.rmbrPhoneAndAvlbl; },
    rmbrSameDay() { return !!this.tOrGet('rmbrSameDay', this.settings.remember_same_day); },
    rmbrYesterDay() { return !!this.tOrGet('rmbrYesterDay', this.settings.remember_day_before); },
    pstlCodeS() { return String(this.$api.myUser()?.postal_code || ''); },
    pstlCodeP() { return this.tOrGet('pstl', this.pstlCodeS) || ''; },

    // Partner
    partner() { return this.$api.myPartnerAM(); },
    openToFirstRdvBeneficiaries() {
      return this.t.open_to_first_rdv_beneficiaries !== undefined ? !!this.t.open_to_first_rdv_beneficiaries :
        !this.partner || !!this.partner.open_to_first_rdv_beneficiaries;
    },
    openToFirstRdvAll() { return this.t.open_to_first_rdv_all !== undefined ?
      !!this.t.open_to_first_rdv_all : !this.partner || !!this.partner.open_to_first_rdv_all; },
    firstMinimumRdvTime() { return this.t.minimum_rdv_time !== undefined ?
      !!this.t.open_to_first_rdv_beneficiaries : !this.partner ? '' : this.partner.first_minimum_rdv_time; },
    firstMaximumRdvTime() { return this.t.maximum_rdv_time !== undefined ?
      !!this.t.open_to_first_rdv_all : !this.partner ? '' : this.partner.first_maximum_rdv_time; },
    nextMinimumRdvTime() { return this.t.minimum_rdv_time !== undefined ?
      !!this.t.open_to_first_rdv_beneficiaries : !this.partner ? '' : this.partner.next_minimum_rdv_time; },
    nextMaximumRdvTime() { return this.t.maximum_rdv_time !== undefined ?
      !!this.t.open_to_first_rdv_all : !this.partner ? '' : this.partner.next_maximum_rdv_time; },

    // ManageTime - Todo : put in data to handle select of more than one kiosk
    manageTimeUser() { return (this.$api.iAmPartner() || this.$api.iAmJustKioskOverseer()) ? null : this.$api.myUserId(); },
    manageTimeKiosk() { return this.$api.iAmJustKioskOverseer() ? this.$api.myUser()?.kiosks_overseeing?.[0] : null; },
    manageTimePartner() { return this.$api.iAmPartner() ? this.$api.myPartnerAMId() : null; },
  },
  methods: {
    tOrGet(tName, oVal) { return this.t[tName] !== undefined ? this.t[tName] : oVal },
    tOrDel(tName, nVal, oVal) { nVal !== oVal ? (this.$set(this.t, tName, nVal)) : this.$delete(this.t, tName); },
    // Shared
    updtTempEmail(event) { this.$set(this.t, 'email', event); },
    updtTempPhone(event) { this.$set(this.t, 'phone', event); },
    resetPassword() { this.$api.resetPassword().then(x => console.log(x)) },

    // User
    updtrmbrEmail(event) { this.tOrDel('rmbrEmail', event, this.settings.remember_through_email); },
    updtrmbrPhone(event) { this.tOrDel('rmbrPhone', event, this.settings.remember_through_phone); },
    updtrmbrTday(event) { this.tOrDel('rmbrSameDay', event, this.settings.remember_same_day); },
    updtrmbrYday(event) { this.tOrDel('rmbrYesterDay', event, this.settings.remember_day_before); },
    updtPostal(event) { this.tOrDel('pstl', event.target.value, this.pstlCodeS); },
    dltTmps(a) { a.forEach(v => this.$delete(this.t, v)); },
    saveUserSetting() {
      this.$api.patchUserSettings(this.$api.myUserId(), {
        remember_through_email: this.t.rmbrEmail,
        remember_through_phone: this.t.rmbrPhone,
        remember_same_day: this.t.rmbrSameDay,
        remember_day_before: this.t.rmbrYesterDay,
      }).then(() => this.dltTmps(['rmbrEmail', 'rmbrPhone', 'rmbrSameDay', 'rmbrYesterDay']));
      this.$api.patchUser(this.$api.myUserId(), { postal_code: this.t.pstl } ).then(() => this.dltTmps(['pstl']));
    },

    // Partner
    updtTempFirstMin(v) { this.$set(this.t, 'first_minimum_rdv_time', v.target.value); },
    updtTempFirstMax(v) { this.$set(this.t, 'first_maximum_rdv_time', v.target.value); },
    updtTempNextMin(v) { this.$set(this.t, 'next_minimum_rdv_time', v.target.value); },
    updtTempNextMax(v) { this.$set(this.t, 'next_maximum_rdv_time', v.target.value); },
    checkNumberDown(e) { return checkNumberDown(e); },
    savePartnerSetting() {
      this.$api.patchPartner(this.$api.partnerId(), {
        first_minimum_rdv_time: this.t.first_minimum_rdv_time,
        first_maximum_rdv_time: this.t.first_maximum_rdv_time,
        next_minimum_rdv_time: this.t.next_minimum_rdv_time,
        next_maximum_rdv_time: this.t.next_maximum_rdv_time,
      } ).then(() => this.dltTmps([
        'first_minimum_rdv_time', 'first_maximum_rdv_time', 'next_minimum_rdv_time', 'next_maximum_rdv_time'
      ]));
    },
  },
  beforeMount() { this.$api.loadUserSettings(this.$api.myUserId()); },
}
</script>
