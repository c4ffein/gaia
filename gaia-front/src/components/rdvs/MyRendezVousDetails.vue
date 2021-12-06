<template lang="pug">
.flex(style="height: 800px;")
  .modal-close-button(@click="$emit('close')")
  Pdf(v-if="rdvCertificate && b64" :b64="b64" cstyle="width: 600px; height: 100%;")
  //-div(v-if="embedded" style="width: 600px; height: 100%;")
    div(id="pdf-viewer" style="width: 600px; height: 100%;")

  //- No RDV
  .t-secondary.t-20.t-bold.m-5(v-if="!rdv") Chargement...

  //- RDV
  .flex.f-col(v-if="rdv")
    .px-5
      span Le
      span.t-primary.t-bold  {{prettyDate(rdv.start)}}
      span  de
      span.t-primary.t-bold  {{prettyTime(rdv.start)}}
      span  à
      span.t-primary.t-bold  {{prettyTime(rdv.end)}}
      span  avec
      //-span.t-primary.t-bold  {{partners[rdv.partner].name}}
      router-link.t-primary.t-bold.t-no-decoration(v-if="!$api.iAmPartner()"
        :to="{ name: 'partner', params: {id: String(rdv.partner)} }"
      )  {{$api.obtPartner(rdv.partner).name || ''}}
      router-link.t-primary.t-bold.t-no-decoration(v-if="$api.iAmPartner()"
        :to="{ name: 'profile', params: {id: String(rdv.user)} }"
      )  {{personName(getUser(rdv.user))}}

    //- Didn't happen
    .flex.f-col.overflow-y-auto.mt-5.px-5(v-if="!rdv.over && !rdv.canceled")
      .t-primary.t-20.t-bold.m-5 Ce rendez-vous n'a pas encore eu lieu.
      .t-18.mb-4
        .t-primary(v-if="rdv.oked_by_beneficiary") Validé par le bénéficiaire
        .t-warning(v-if="!rdv.oked_by_beneficiary") Non validé par le bénéficiaire
        .t-primary(v-if="rdv.oked_by_partner") Validé par le partenaire
        .t-warning(v-if="!rdv.oked_by_partner") Non validé par le partenaire
        div(v-if="rdv.kiosk")
          .t-primary(v-if="rdv.oked_by_kiosk") Validé par le gestionnaire borne Gaïa
          .t-warning(v-if="!rdv.oked_by_kiosk") Non validé par le gestionnaire borne Gaïa
      button.btn.outline.primary.small.ml-5(v-if="rdvOked" @click="startVisio(rdv)") Accéder à la visio

    //- RDV happened, not canceled
    .flex.f-col.overflow-y-auto.mt-5.px-5(v-if="rdv.over && !rdv.canceled")
      div(v-if="!rdvCertificate || !b64")
        .t-primary.t-18.t-bold.m-5 Le rendez-vous est marqué comme effectué.
        button.btn.primary.mb-4.w-full(@click="askCertificate") Demander un certificat
      div(v-if="rdvCertificate && !isFinal && iAmThePartner")
        .t-primary.t-bold.t-16.mb-3 Entretien réalisé par
        MazInput.mb-3(:value="partnerLastname" @input="updatePartnerLastname($event)" placeholder="Nom de famille" )
        MazInput.mb-3(:value="partnerFirstname" @input="updatePartnerFirstname($event)" placeholder="Prénom" )
        MazInput.mb-3(:value="partnerBirthdate" @input="updatePartnerBirthdate($event)" placeholder="Date de naissance")
        MazInput.mb-3(:value="partnerPhoneNumber" @input="updatePartnerPhoneNumber($event)" placeholder="Numéro de téléphone")
        MazInput.mb-3(:value="partnerEmail" @input="updatePartnerEmail($event)" placeholder="Email")
        MazInput.mb-3(:value="partnerOrgAddress" @input="updatePartnerOrgAddress($event)" placeholder="Adresse de l'organisation")
        //- TODO : text overflow on back
        MazInput.mb-3(:value="report" textarea @input="updateReport($event)" placeholder="Compte rendu")
        //- how-to-set-flex-items-to-equal-width item-with-the-longest-cont : stackoverflow.com/questions/42656183
        //- TODO : see also the other
        .flex.w-full.my-4
          button.btn.primary.f-grow-1.mr-3(:disabled="!fieldsModif" style="width: 100px;" @click="saveAll") Enregistrer
          button.btn.primary.f-grow-1.ml-3(:disabled="!fieldsModif" style="width: 100px;" @click="resetAll") Annuler
        .t-warning(v-if="fieldsModif && ((iAmThePartner && userSigned) || (iAmTheUser && partnerSigned))")
          div Attention : l'enregistrement de ces informations ou la
          div signature en l'état supprimeraient celles déjà
          div apposées par d'autres utilisateurs.
      .pt-5(v-if="rdvCertificate && !iDidSign && !isFinal")
        MyRendezVousDetailsSignature.pt-5(@signature="signatureReceived")
        div Attention : ne sera plus modifiable une fois que les
        div deux parties auront signées ce document.
      .w-full.pt-5(v-if="iDidSign && !isFinal")
        button.btn.primary.w-full(@click="removeSignature") Retirer la signature
        .pt-3 (Reste possible tant que les deux parties
        div n'ont pas signées le document)
      .w-full.pt-5(v-if="isFinal")
        div Ce document a été signé par les deux parties.
        div Sa modification n'est plus possible.

    //- RDV canceled
    .t-error.t-20.t-bold.m-5(v-if="rdv.canceled") Ce rendez-vous a été annulé.

</template>

<script>
import PDFObject from '@/libs/pdfobject/pdfobject'
import { prettyTime, prettyDate } from '@/libs/drftimestamp'
import Pdf from '../reusables/Pdf.vue'
import MyRendezVousDetailsSignature from './MyRendezVousDetailsSignature.vue'
import * as h from '@/libs/object-helpers/object-helpers'


export default {
  name: 'MyRendezVousDetails',

  components: { Pdf, MyRendezVousDetailsSignature },
  props: { id: String },
  data: () => ({ embedded: false, t: {} }),
  computed: {
    rdv() { return this.$api.obtRDV(this.id); },
    rdvCertificateId() { return this.rdv?.certificate; },
    rdvCertificate() { return this.rdvCertificateId ? this.$api.obtRDVCertificate(this.rdvCertificateId) : null; },
    iAmTheUser() { return this.rdv?.user && this.$api.myUserId() === this.rdv?.user; },
    iAmThePartner() { return this.rdv?.partner && this.$api.partnerId() === this.rdv?.partner; },
    userSigned() { return this.rdvCertificate?.beneficiary_signed; },
    partnerSigned() { return this.rdvCertificate?.partner_signed; },
    iDidSign() { return this.iAmTheUser ? this.userSigned : this.iAmThePartner ? this.partnerSigned : false; },
    isFinal() { return this.partnerSigned && this.userSigned; },
    b64() { return this.rdvCertificate?.pdf ? `data:application/pdf;base64,${this.rdvCertificate.pdf}` : null; },
    // rdv fields
    rdvOkedKioskOr() { return this.rdv.oked_by_kiosk || !this.rdv.kiosk },
    rdvOked() { return this.rdv && this.rdv.oked_by_partner && this.rdv.oked_by_beneficiary && this.rdvOkedKioskOr },
    // Computed temp fields
    partnerLastname() { return this.tempOrSaved('partner_lastname') },
    partnerFirstname() { return this.tempOrSaved('partner_firstname') },
    partnerBirthdate() { return this.tempOrSaved('partner_birthdate') },
    partnerPhoneNumber() { return this.tempOrSaved('partner_phone_number') },
    partnerEmail() { return this.tempOrSaved('partner_email') },
    partnerOrgName() { return this.tempOrSaved('partner_org_name') },
    partnerOrgAddress() { return this.tempOrSaved('partner_org_address') },
    report() { return this.tempOrSaved('report') },
    fieldsModif() { return h.oK(this.t).length !== 0; },
  },
  methods: {
    loadCert() { if(this.rdvCertificateId) this.$api.getRDVCertificate(this.rdvCertificateId);console.log(this.$api.data.rdvCertificates); },
    embedPDF() { if (!this.embedded && this.b64) { PDFObject.embed(this.b64, "#pdf-viewer"); this.embedded = true; } },
    getPDF() {  },
    signatureReceived(b64) { this.saveThenOrJustDo(() => this.$api.signRDVCertificate(this.id, b64)); },
    removeSignature() { this.saveThenOrJustDo(() => this.$api.signRDVCertificate(this.id, null)); },

    tempOrSaved(fieldName) {
      return this.t[fieldName] !== undefined ? this.t[fieldName] : (this.rdvCertificate?.[fieldName] || '');
    },
    updateOrReset(fieldName, value) {
      if (this.rdvCertificate?.[fieldName] === value) { this.$delete(this.t, fieldName); }
      else this.$set(this.t, fieldName, value);
    },
    saveAll() { return this.$api.patchRDVCertificate(this.id, this.t).then(() => this.resetAll()); },
    saveThenOrJustDo(callback) { if(this.fieldsModif) this.saveAll().then(callback); else callback(); },
    resetAll() { this.$set(this, 't', {}); },

    updatePartnerLastname(value) { this.updateOrReset('partner_lastname', value); },
    updatePartnerFirstname(value) { this.updateOrReset('partner_firstname', value); },
    updatePartnerBirthdate(value) { this.updateOrReset('partner_birthdate', value); },
    updatePartnerPhoneNumber(value) { this.updateOrReset('partner_phone_number', value); },
    updatePartnerEmail(value) { this.updateOrReset('partner_email', value); },
    updatePartnerOrgName(value) { this.updateOrReset('partner_org_name', value); },
    updatePartnerOrgAddress(value) { this.updateOrReset('partner_org_address', value); },
    updateReport(value) { this.updateOrReset('report', value); },

    cancelRegisteredRDV(id) { this.$api.cancelRDV(id); },
    confirmRegisteredRDV(id) { this.$api.confirmRDV(id); },
    prettyDate(s) { return prettyDate(s); },
    prettyTime(s) { return prettyTime(s); },
    personName(p) { return p ? `${p.firstname} ${p.lastname}` : ''; },
    getUser(id) { return id ? this.$api.loadUser(id) : null; },
    askCertificate() { return this.$api.askRDVCertificate(this.id); },

    startVisio(e) { this.$api.startVisio(this.$api.Id(e.id), e.url); this.$router.push({name: 'visio'}) },
  },
  mounted() { this.loadCert(); },

}
</script>
