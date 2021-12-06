<template lang="pug">
//- Full-power calendar.
div
  .t-primary.t-20.mb-3(v-if="(!iAmPartner && !willPartner) || (iAmPartner && !willUser)")
    | Sélectionnez une thématique et un interlocuteur pour prendre un rendez-vous
  div(v-else)
    vue-cal.demo.full-cal.vuecal--full-height-delete(
      ref="vuecal"
      locale="fr"
      :selected-date="selectedDate"
      :split-days="splits" sticky-split-labels
      @cell-focus="selectedDate = $event.date || $event"
      style="height: 450px" hide-weekends :disable-views="['years', 'day']" :time-from="8 * 60" :time-to="19 * 60"
      :events="events" :editable-events="editable"
      :on-event-create="onEventCreate" @event-resizing="onEventResizeTemp"
      @view-change="onViewSet" @ready="onViewSet"
    )
      //-template(v-slot:split-label="{ split, view }")
        div(:color="split.color" size="20") person
        strong(:style="`color: ${split.color}`") {{ split.label }}
      //-.demo.flex.f-jc-space-around.mt-3.mb-2
        .flex
          .disp-partner-unavailable(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Partenaire non disponible
        .flex
          .disp-partner-unavailable(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Partenaire non disponible
        .flex
          .disp-partner-unavailable(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Partenaire non disponible
      .demo.flex.f-jc-space-around.mt-2.mb-2(v-if="kioskModeEnabled")
        .flex
          .disp-kiosk-unavailable(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Kiosque non disponible
        .flex
          .disp-kiosk-unavailable(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Kiosque non disponible
        .flex
          .disp-kiosk-unavailable(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Kiosque non disponible
    //-.flex.f-jc-space-around
    .flex
      .flex.f-col
        .demo.flex.mt-3.mb-2
          .disp-partner-unavailable(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Partenaire indisponible
        .demo.flex.mt-2.mb-2(v-if="kioskModeEnabled")
          .disp-kiosk-unavailable(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Borne indisponible
      //-.flex.f-col
        .demo.flex.mt-3.mb-2
          .rdv-partner-other-not-confirmed(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Un RDV a déjà été demandé au partenaire
        .demo.flex.mt-2.mb-2(v-if="kioskModeEnabled")
          .rdv-kiosk-other-not-confirmed(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Un RDV a déjà été demandé sur cette borne
      //-.flex.f-col
        .demo.flex.mt-3.mb-2
          .rdv-partner-other-confirmed(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Un RDV avec un autre utilisateur est déjà prévu avec ce partenaire
        .demo.flex.mt-2.mb-2(v-if="kioskModeEnabled")
          .rdv-kiosk-other-confirmed(style="height: 20px; width: 50px;")
          .t-grey.ml-3 Un RDV avec un autre utilisateur est déjà prévu sur cette borne


    .mb-5.mt-4(v-if="kioskModeEnabled")
      MazCheckbox(v-model="willKioskCB") Réserver cette borne
      .t-grey.
        Cochez cette case si vous souhaitez utiliser cette borne pour accéder au rendez-vous.
        Merci de vous assurer que le partenaire et la borne soient disponibles.
        Vous devrez autrement avoir à disposition un ordinateur avec micro et caméra, ainsi
        qu'une connexion internet avec un débit suffisant pour les appels visio.
    .flex.j-ai-center.w-full.mt-5(v-if="!showEventCreationDialog")
      MazBtn.ml-auto.mr-auto(@click="addNewRDV") {{txtNewButton}}
  div(v-if="showEventCreationDialog" :persistent="true")
    //-v-select(:items="eventsCssClasses" placeholder="Event CSS Class" @change="cEvent.class = $event" :value="cEvent.class")
    .mb-3 {{ txtPropose }} #[span.t-primary {{ txtInterlocutor }}] le
    .flex.f-jc-center.f-ai-center.mb-3.gap-3
      MazSelect(options-list-full-width placeholder=""
        :value="newRDVDayNumber" :options="frDaysOfMonth" @input="setDay" )
      MazSelect(options-list-full-width placeholder=""
        :value="newRDVMonthNumber" :options="frMonths" @input="setMonth" )
      MazSelect(options-list-full-width placeholder=""
        :value="newRDVYearNumber" :options="frNextYears" @input="setYear" )
      //-#[span.t-primary  {{ txtDate }}] de
      span.t-primary de
    .flex.f-jc-center.f-ai-center.mb-3
      input.npt.pr-4.ml-0.mr-2.t-15.t-right.w-30px(
        :value="startH" @input="setStartH" :maxlength="2" @keydown="checkNumberDown($event)" )
      | H
      input.npt.pr-4.ml-4.mr-4.t-15.t-right.w-30px(
        :value="startM" @input="setStartM" :maxlength="2" @keydown="checkNumberDown($event)" )
      span.ml-3.mr-3 à
      input.npt.pr-4.ml-4.mr-2.t-15.t-right.w-30px(
        :value="endH" @input="setEndH" :maxlength="2" @keydown="checkNumberDown($event)" )
      | H
      input.npt.pr-4.ml-4.t-15.t-right.w-30px(
        :value="endM" @input="setEndM" :maxlength="2" @keydown="checkNumberDown($event)" )
    .flex
      button.btn.primary.small(@click="askForEvent()").w-1-2.mr-3 Valider
      button.btn.primary.outline.small(@click="cancelEventCreation()").w-1-2.ml-3 Annuler

</template>


<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/fr.js'
import 'vue-cal/dist/vuecal.css'

import * as h from '@/libs/object-helpers/object-helpers'
import { checkNumberDown } from '@/libs/inputs.js'
import { monthName, monthNamesFr, frDate, getMonday, copyDMY } from '@/libs/drftimestamp'

import { MazCheckbox } from 'maz-ui'


export default {
  name: 'Calendrier',

  components: { VueCal, MazCheckbox },
  props: { willPartnerId: String, willUserId: String},
  data: () => ({
    selectedDate: new Date(), cEvent: null, showEventCreationDialog: false,
    reloader: 0, reloaderG: 0, reloaderT: 0, willKioskCB: true,
    monday: null,
  }),
  computed: {
    // Page states
    kioskModeEnabled() { return this.$api.kioskModeEnabled(); },
    willUser() { return this.loadUser(this.willUserId); },
    willPartner() { return this.$api.data?.partners?.[this.willPartnerId]; },
    couldKioskId() { return this.$api.myKioskId() || null; },
    willKioskId() { return (this.willKioskCB && this.$api.myKioskId()) || null; },
    // cDisp timing
    startH() { this.reloader; this.reloaderT; return this.cEvent.start.getHours() || '' },
    startM() { this.reloader; this.reloaderT; return this.cEvent.start.getMinutes() || ''},
    endH() { this.reloader; this.reloaderT; return this.cEvent.end.getHours() || ''},
    endM() { this.reloader; this.reloaderT; return this.cEvent.end.getMinutes() || ''},
    newRDVDayNumber() { this.reloader; this.reloaderT; return this.cEvent.start.getDate() || '' },  // 1-31
    newRDVMonthNumber() { this.reloader; this.reloaderT; return this.cEvent.start.getMonth() + 1 || '' },  // 1-12
    newRDVYearNumber() { this.reloader; this.reloaderT; return this.cEvent.start.getFullYear() || '' },  // yyyy
    // cDisp MazSelects options
    frDaysOfMonth() { return [...Array(31).keys()].map(v => ({label: v+1, value: v+1})); },
    frMonths() { return [...Array(12).keys()].map(v => ({label: monthNamesFr[v], value: v+1})); },
    frNextYears() { const now = new Date; return [now.getFullYear(), now.getFullYear() + 1].map(v => ({label: v, value: v})); },
    // disps
    uSavedDisps() { return h.oFE(h.oE(this.$api.data?.disponibilities || {}).filter(([,d]) => !d.voided && (
                    (this.willPartner?.id && d.partner === this.willPartner?.id) ||
                    (this.willUser?.id && d.user === this.willUser?.id) ||
                    (this.willKioskId && d.kiosk === this.willKioskId) ))); },
    workedDisps() { return h.oFE(h.oE(this.uSavedDisps).map(([k, d]) => [k, d.recurrent ? this.handleRec(d) : d])); },
    intermediateSavedDispsRWD() {
      this.reloader; this.reloaderG;
      const l = h.oFE(h.oE(this.workedDisps).map(([k, d]) => ([k, {
        oID: d.id,
        start: Date.parse(d.start),
        end: Date.parse(d.end),
        type: d.kiosk ? 'kiosk' : d.partner ? 'partner' : '?',
      }])));

      const startOrEndOrder = {}
      h.oV(l).forEach(d => {
        startOrEndOrder[d.start] ||= []; startOrEndOrder[d.start].push([d.oID, 1, d.type]);
        startOrEndOrder[d.end] ||= []; startOrEndOrder[d.end].push([d.oID, 0, d.type]);
      })

      const newOrder = [];
      const opened = [];
      const sOEAK = h.oK(startOrEndOrder).sort((a, b) => a-b);
      if (sOEAK.length === 0) {
        const dStart = new Date(this.selectedDate); dStart.setMonth(dStart.getMonth() - 1);
        const dEnd = new Date(this.selectedDate); dEnd.setMonth(dEnd.getMonth() + 1);
        return [{ start: dStart, end: dEnd, kiosk: !this.willKioskId, partner: false }];
      }
      let latest = Number(sOEAK[0]) - 604800000;

      sOEAK.forEach(t => {
        const a = startOrEndOrder[t];
        let kiosk = false; let partner = false;
        opened.forEach(o => { if (l[o].type === 'kiosk') kiosk = true; if (l[o].type === 'partner') partner = true; });

        newOrder.push({ start: latest, end: Number(t), kiosk: kiosk, partner: partner });
        a.forEach(d => {
          if (d[1]) { opened.push(d[0]);}
          if (!d[1]) { opened.splice(opened.indexOf(d[0]), 1); }
        });
        latest = Number(t);
      });
      newOrder.push({ start: latest, end: latest + 604800000, kiosk: false, partner: false });

      return newOrder.filter(d => this.willKioskId ? !d.kiosk || !d.partner : !d.partner).map(d => ({
        start: new Date(d.start), end: new Date(d.end), kiosk: d.kiosk, partner: d.partner
      }));
    },
    savedDispsRWD() {
      return this.intermediateSavedDispsRWD.map(d => ({
        oID: d.id,
        start: typeof d.start === 'string' ? d.start.replace('T', ' ') : d.start,
        end: typeof d.end === 'string' ? d.end.replace('T', ' ') : d.end,
        data: '' + h.oK(d),
        class: !d.kiosk && !d.partner && this.willKioskId ? 'disp-kiosk-partner-unavailable' : !d.kiosk && this.willKioskId ? 'disp-kiosk-unavailable' : !d.partner ? 'disp-partner-unavailable' : 'n-kli',
        background: true, deletable: false, resizable: false,
      }));
    },
    //
    splits() { return [] },
    // splits() { return [{ label: 'John', class: 'mine' }, { label: 'Kate', class: 'kate' }] },
    editable() { return { title: false, drag: true, resize: true, create: this.hasInterlocutor, delete: false }; },
    hasInterlocutor() { return !!(this.willPartner || this.willUser); },
    allRDVs() { return this.$api.allRdvs(); },
    // TODO : get list of event ids from partners, use this list to build objects etc
    savedEvents() { return h.oFE(h.oE(this.allRDVs).filter(([, v]) => (
      (v.partner && v.partner === this.willPartner?.id)
      || (v.user && v.user === this.willUser?.id)
      || (v.kiosk && v.kiosk === this.willKioskId)
    ))); },
    intermediateSavedEvents() {
      this.reloader;
      this.reloaderG;
      return h.oV(this.savedEvents).filter(e => !e.canceled && !e.over).map(e => ({  // !!! Show over just not canceled?
        start: new Date(e.start),
        end: new Date(e.end),
        data: '' + h.oK(e),
        title: this.rdvTitle(e),
        resizable: false,
        class: this.rdvClass(e),
        //     background: true, deletable: false, resizable: false, split: 1,
      }));
    },
    events() { return this.savedDispsRWD.concat(this.intermediateSavedEvents).concat(this.cEvent || []); },

    partners() { return this.$api.data.partners; },
    iAmPartner() { return this.$api.iAmPartner(); },
    // Texts
    txtNewButton() { return this.iAmPartner ? 'Proposer un rendez-vous' : 'Demander un rendez-vous'; },
    txtPropose() { return this.iAmPartner ? 'Proposer un rendez-vous à' : 'Demander un rendez-vous avec'; },
    txtInterlocutor() { return this.iAmPartner ? `${this.username(this.willUserId)}` : this.willPartner.name; },
    txtDate() { return frDate(this.cEvent.start); },
  },
  methods: {
    loadUser(id) { return id ? this.$api.loadUser(id) : null; },
    partnername(id) { return this.partners?.[id]?.name || ''; },
    username(id) { this.loadUser(id); return this.$api.readUserFirstLastName(id); },
    getParticipantName(e) { return !this.iAmPartner ? this.partnername(e.partner) : this.username(e.user); },
    getKioskName(e) { return e.kiosk ? this.$api.data.kiosks?.[e.kiosk]?.name || '' : ''; },
    monthName(date) { return monthName(date); },
    checkNumberDown(e) { return checkNumberDown(e); },
    // Button create event
    addNewRDV() {
      const now = new Date; const newD = new Date(this.selectedDate);
      newD.setHours(now.getHours() < 8 ? 8 : now.getHours() > 17 ? 17 : now.getHours() );
      // Vue cal show both saturday and sunday at the end of the week if enabled
      if(newD.getDay() % 6 === 0) newD.setDate( newD.getDay() === 0 ? newD.getDate() - 2 : newD.getDate() - 1);
      this.$refs.vuecal.createEvent( newD, 30, { class: 'mine-unsaved', title: 'Nouveau RDV' } );
    },
    // vue-call callbacks
    onEventCreate (event, deleteEventFunction) {
      if (this.deleteEventFunction) this.deleteEventFunction();
      this.cEvent = event;
      this.cEvent.class = 'mine-unsaved';
      this.cEvent.title = 'Nouveau RDV';
      this.showEventCreationDialog = true;
      this.deleteEventFunction = deleteEventFunction;
      return event;
    },
    onEventResizeTemp () { this.reloaderT++; },
    onViewSet (v) { if (v.view === 'week') this.monday = getMonday(v.startDate); },
    // Recurrent events
    handleRec(o) { return {...o, start: this.handleRecDate(o.start), end: this.handleRecDate(o.end) } },
    handleRecDate(s) { const n = new Date(this.monday); const d = new Date(s); n.setDate(n.getDate() + (d.getDay() || 7) - 1); n.setHours(d.getHours()); n.setMinutes(d.getMinutes()); return n; },
    // Event data
    rdvTitle(e) {
      if (this.$api.myUserId() && this.$api.myUserId() === e.user || this.$api.partnerId() === e.partner)
        return `Mon RDV ${this.isConfirmed(e) ? '' : 'non confirmé' } avec ${this.getParticipantName(e)}`
      //return `RDV ${e.partner !== this.willPartner.id && e.kiosk ? this.getKioskName(e) : this.getParticipantName(e)}`
      return '';
    },
    rdvClass(e) {
      if (this.$api.myUserId() && this.$api.myUserId() === e.user || this.$api.partnerId() === e.partner)
        return this.isConfirmed(e) ? 'mine' : 'mine-uncomfirmed';
      return `rdv-${
        e.partner === this.willPartner.id ?
          e.kiosk && e.kiosk === this.willKioskId ? 'kiosk-partner' : 'partner'
        : e.kiosk && e.kiosk === this.willKioskId ? 'kiosk' : ''
      }-other-${this.isConfirmed(e) ? '' : 'not-'}confirmed`;
    },
    isConfirmed(e) { return e.oked_by_partner && e.oked_by_beneficiary; },
    // Events bottom UI
    cancelEventCreation () {
      this.showEventCreationDialog = false; this.deleteEventFunction(); this.cEvent = null; this.reloader++; },
    askForEvent () { this.$api.createRDV({ start: this.cEvent.start, end: this.cEvent.end,
      partner: this.willPartner.id, user: this.willUser.id, kiosk: this.willKioskId,
    }).then(
      r => { this.showEventCreationDialog = false; this.cEvent = null; this.reloaderG++; this.emitRdvCreated(r.id); }
    ); },
    emitRdvCreated(id) { this.$emit('rdvCreated', id); },

    // TODO : smarter impossible date, changing month to next for example
    // TODO : selectedDate correct but not working.
    setDay(v) { this.cEvent.start.setDate(v); this.completeSetDate(); },
    setMonth(v) { this.cEvent.start.setMonth(v - 1); this.completeSetDate(); },
    setYear(v) { this.cEvent.start.setFullYear(v); this.completeSetDate(); },
    completeSetDate() {
      copyDMY(this.cEvent.end, this.cEvent.start); copyDMY(this.selectedDate, this.cEvent.start); this.reloader++; },
    setStartH(v) { this.cEvent.start.setHours(v.target.value > 23 ? 23 : v.target.value); this.reloader++; },
    setStartM(v) { this.cEvent.start.setMinutes(v.target.value > 59 ? 59 : v.target.value); this.reloader++; },
    setEndH(v) { this.cEvent.end.setHours(v.target.value > 23 ? 23 : v.target.value); this.reloader++; },
    setEndM(v) { this.cEvent.end.setMinutes(v.target.value > 59 ? 59 : v.target.value); this.reloader++; },
  },
}
</script>


<style lang="scss">
@import "./styles/calendrier.scss";
</style>
