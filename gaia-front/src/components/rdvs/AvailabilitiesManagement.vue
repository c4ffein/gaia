<template lang="pug">
//- Full-power calendar.
div(style="min-width: 800px;")
  //-  MazBtnGroup.w-full.two-choices.mb-3(
      size="sm" outline @input="onRecurrentTab = $event" :value="onRecurrentTab"
      :items="[{label: 'Plages récurrentes', value: true}, {label: 'Plages uniques', value: false}]"
    )
  vue-cal.demo.full-cal.vuecal--full-height-delete.mb-5(
    locale="fr"
    :selected-date="slctdD"
    :split-days="splits" sticky-split-labels
    @cell-focus="slctdD = $event.date || $event"
    style="height: 450px" hide-weekends :disable-views="['years', 'day']" :time-from="8 * 60" :time-to="19 * 60"
    :events="disps" :editable-events="editable" :on-event-create="onDispCreate"
    @event-resizing="onDispResizeTemp" @event-duration-change="onDurCha"
    @event-focus="onDispFocus"
    @view-change="onViewSet" @ready="onViewSet"
  )
    template(v-slot:split-label="{ split, view }")
      div(:color="split.color" size="20") person
      strong(:style="`color: ${split.color}`") {{ split.label }}
  .flex.j-ai-center.w-full(v-if="showAddButton")
    MazBtn.ml-auto.mr-auto(@click="addNewDisp") Ajouter une disponibilité
  div(v-if="showDialog" :persistent="true")
    //-v-select(:items="dispsCssClasses" placeholder="Disp CSS Class" @change="cDisp.class = $event" :value="cDisp.class")
    .mb-3 {{ txtWhatDo }} #[span.t-warning {{ txtWarnPre }}] {{ txtPreDate }}
    .flex.f-jc-center.f-ai-center.mb-3.gap-3
      div
        MazSelect(v-if="this.onRecurrentTab"
          :value="cDisp.start.getDay()" :options="frDaysOfWeek" placeholder="" @input="setDay"
        )
        span(v-else) #[span.t-primary {{ i.frDate(cDisp.start) }}]
      div
        | de
        input.npt.pr-4.ml-3.mr-2.t-15.t-right.w-30px(
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
      button.btn.error.small(v-if="cDispSlctdNnMdfd" @click="askForDispDelete()").w-1-2.mr-3 Supprimer
      button.btn.primary.small(v-else @click="validateBtnClicked()").w-1-2.mr-3 Valider
      button.btn.outline.small(v-if="!cDispSlctdNnMdfd" :class="cDispCnclBtnCls" @click="cancelDispClk()").w-1-2.ml-3
        | Annuler
      button.btn.outline.primary.small(v-else @click="cDispUnslct()").w-1-2.ml-3 Désélectionner
  .t-warning.t-20.t-center.mt-5.mb-3(v-if="unsavedDispsPresent") Les plages en jaune ne sont pas sauvegardées
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/fr.js'
import 'vue-cal/dist/vuecal.css'

import { MazBtn, MazBtnGroup } from 'maz-ui'

import * as h from '@/libs/object-helpers/object-helpers'
import { checkNumberDown } from '@/libs/inputs.js'
import { monthName, frDate, getMonday, copyDMY, copyMHDMY, nDateAddDays } from '@/libs/drftimestamp'



export default {
  name: 'AvailabilitiesManagement',

  components: { VueCal, MazBtn, MazBtnGroup },
  props: { partnerId: Number, kioskId: Number, userId: Number },  // TODO : change all for strings
  data: () => ({
    bla: 'lundis',
    onRecurrentTab: true, makeAvailableD: true,
    reloader: 0, reloaderG: 0, reloaderT: 0,
    slctdD: new Date(),
    curCID: 0,
    // disps used by vue-cal, dispsKey for access by key, mDisps for mods back, cDisp is current selection
    // nDisps/cDisp useless as vue-cal can replace those objs
    // TODO : cDisp should actually be computed, using another obj containing either a cID or oID
    disps: [], dispsKey: {}, mDisps: {}, cDisp: null,
    monday: null,
   }),
  // TODO WHEN CHANGING FRAME SHOULD CHANGE ALL WEEKS
  computed: {
    // Helpers
    i() { return { frDate }; },
    frDaysOfWeek() { return [...Array(5).keys()].map(x => { const d = new Date();
      d.setDate(d.getDate() - d.getDay() + x + 1); return {label: this.frDayOfWeek(d), value: x + 1};
    } ) },
    // Start end timer
    startH() { this.reloader; this.reloaderT; return this.cDisp.start.getHours() || '' },
    startM() { this.reloader; this.reloaderT; return this.cDisp.start.getMinutes() || ''},
    endH() { this.reloader; this.reloaderT; return this.cDisp.end.getHours() || ''},
    endM() { this.reloader; this.reloaderT; return this.cDisp.end.getMinutes() || ''},
    // UI stuff
    showDialog() { return !!this.cDisp; },
    showAddButton() { return !this.showDialog; },
    makeAvailable() { return this.onRecurrentTab || this.makeAvailableD; },
    showDialogAsExisting() { return this.onRecurrentTab || this.makeAvailableD; },
    showDialogAsCreating() { return this.onRecurrentTab || this.makeAvailableD; },
    showDialogAsModifying() { return this.onRecurrentTab || this.makeAvailableD; },
    willUser() { return this.loadUser(this.willUserId); },
    // TODO : background: true for recurrents when on non recurrent
    splits() { return [] },
    // splits() { return [{ label: 'John', class: 'mine' }, { label: 'Kate', class: 'kate' }] },
    editable() { return { title: false, drag: true, resize: true, create: true, delete: false }; },
    // disps
    mySavedDisps() { return h.oFE(h.oE(this.$api.data?.disponibilities || {}).filter(([,d]) => !d.voided && (
                     (this.partnerId && d.partner === this.partnerId) ||
                     (this.userId && d.user === this.userId) || (this.kioskId && d.kiosk === this.kioskId) ))); },
    workedDisps() { return h.oFE(h.oE(this.mySavedDisps).map(([k, d]) => [k, d.recurrent ? this.handleRec(d) : d])); },
    intermediateSavedDisps() {
      this.reloader; this.reloaderG;
      return h.oFE(h.oE(this.workedDisps).filter(([, d]) => !this.onRecurrentTab || !d.disabling).map(([k, d]) => ([k, {
        oID: d.id,
        start: typeof d.start === 'string' ? d.start.replace('T', ' ') : d.start,
        end: typeof d.end === 'string' ? d.end.replace('T', ' ') : d.end,
        data: '' + h.oK(d),
        state: { saved: true },
        title: d.recurrent ? 'Plage récurrente' : 'Plage unique',
        class: 'disp-mine-recurrent-screen-saved',
        // background: true,  // Actually if recurring on non-recurring
        //deletable: true,resizable: false, split: 1,content: '<i class="v-icon material-icons mt-1">local_play</i>',
      }])));
    },
    nDisps() { return this.disps.filter(d => d.cID); },
    unsavedDispsPresent() { return this.nDisps.length > 0 || h.oK(this.mDisps).length > 0; },
    // ?
    partners() { return this.$api.data.partners; },
    iAmPartner() { return this.$api.iAmPartner(); },
    // Texts
    txtWhatDo() { return `${this.makeAvailable ? 'Rendre disponible' : 'Rendre indisponible'}${this.txtRecS}`; },
    txtRecS() { return this.onRecurrentTab ? 's' : '' },
    txtWarnPreV() { return '(sauf exception dans les Plages uniques)' },
    txtWarnPre() { return this.makeAvailable ? this.txtWarnPreV : '' },
    txtPreDate() { return this.onRecurrentTab ? 'tous les' : 'le'; },
    txt() { return this.iAmPartner ? 'Proposer un rendez-vous à' : 'Demander un rendez-vous avec'; },
    cDispSlctdNnMdfd() { this.reloaderT; return this.cDisp?.oID && !this.mDisps[this.cDisp.oID] },
    cDispSlctdMdfdOrCrtd() { this.reloaderT; return !this.cDisp?.oID || !!this.mDisps[this.cDisp.oID]; },
    cDispCnclBtnCls() { this.reloaderT; return this.cDispSlctdMdfdOrCrtd ? 'primary' : 'disabled'; },
  },
  watch: { intermediateSavedDisps: function (v) { this.handleIntermediateDisps(v); }, },  // no immediate need vue-cal
  methods: {
    handleIntermediateDisps(v) {
      this.reloader;
      h.oV(v).forEach(d => {
        const o = this.disps.filter(o => o.oID === d.oID);
        if(o.length === 0) this.disps.push(d);
        else if (o[0].oID && !this.mDisps[o[0].oID]) this.replaceDisp(o[0], d);
      })
      for (let i = this.disps.length - 1; i >= 0; i--) { const d = this.disps[i];
        if (d.oID && !v[d.oID] && !this.mDisps[d.oID]) {
          delete this.mDisps[d.oID]; if(this.cDisp.oID === d.oID) this.cDisp = null; this.disps.splice(i, 1);
        } else if (d.cID || this.mDisps[d.oID]) this.mHandleRec(d);
    } this.disps.push({}); this.disps.pop(); },

    getCID() { this.curCID++; return this.curCID; },

    replaceDisp(d, s) { h.oE(s).forEach(([k, v]) => { this.$set(d, k, v) }); },
    mHandleRec(o) { //o.start = this.handleRecDate(o.start); o.end = this.handleRecDate(o.end);
      o.start.setTime(this.handleRecDate(o.start).getTime()); o.end.setTime(this.handleRecDate(o.end).getTime());
    },
    handleRec(o) { return {...o, start: this.handleRecDate(o.start), end: this.handleRecDate(o.end) } },
    handleRecDate(s) { const n = new Date(this.monday); const d = new Date(s); n.setDate(n.getDate() + (d.getDay() || 7) - 1); n.setHours(d.getHours()); n.setMinutes(d.getMinutes()); return n; },
    frDayOfWeek(date) { return `${date.toLocaleString('fr-FR', {weekday: 'long'})}s`; },
    loadUser(id) { return id ? this.$api.loadUser(id) : null; },
    username(id) { this.loadUser(id); return this.$api.readUserFirstLastName(id); },
    partnername(partner) { return this.partners[partner].name; },
    getParticipantName(e) { return !this.iAmPartner ? this.partnername(e.partner) : this.username(e.user); },
    monthName(date) { return monthName(date); },
    checkNumberDown(e) { return checkNumberDown(e); },
    cDispUnslct() { this.cDisp = null; },
    getACDisp() { return !!this.cDisp.oID && this.disps.filter(d => d.oID === this.cDisp.oID)[0]; },
    addNewDisp() {  // Used by button, not cal
      // if (this.deletedispFunc) this.deletedispFunc();
      this.cDisp = {};
      this.cDisp.class = 'disp-mine-recurrent-screen-created';
      this.cDisp.title = 'Non-confirmée, récurrente';
      const now = new Date;
      const newD = this.cDisp.start = new Date(this.slctdD);
      newD.setHours( now.getHours() < 8 ? 8 : now.getHours() > 17 ? 17 : now.getHours() );
      // Vue cal show both saturday and sunday at the end of the week if enabled
      if(newD.getDay() % 6 === 0) newD.setDate( newD.getDay() === 0 ? newD.getDate() - 2 : newD.getDate() - 1);
      this.cDisp.end = new Date(this.cDisp.start); this.cDisp.end.setMinutes(this.cDisp.start.getMinutes() + 50)
      this.cDisp.recurrent = true;
      this.cDisp.cID = this.getCID();
      this.disps.push(this.cDisp);
      return this.cDisp;
    },
    onDispCreate (disp, deletedispFunc) {
      if (this.deletedispFunc) this.deletedispFunc();
      this.cDisp = disp;
      this.cDisp.class = 'disp-mine-recurrent-screen-created';
      this.cDisp.title = 'Non-confirmée, récurrente';
      this.cDisp.recurrent = true;
      this.cDisp.deletedispFunc = deletedispFunc;
      this.cDisp.cID = this.getCID();
      this.disps.push(disp);
      return disp;
    },
    onDispFocus (d) { this.cDisp = this.disps[d.oID] || d; },
    // TODO : Use event to set temp datetime instead of reloader token which redraws too much
    onDispResizeTemp () { this.reloaderT++; },  // Temp value is already set in data.
    onDurCha(n) { this.bE(n.originalEvent); this.reloaderT++; this.reloaderG++; },
    onViewSet (v) { if (v.view === 'week') this.monday = getMonday(v.startDate); },
    cancelDispClk() { if (this.cDisp?.oID) this.cancelDispEdit(); else this.cancelDispCreat(); },
    cancelDispCreat () { this.cDisp?.deletedispFunc?.(); this.dDisp(this.cDisp); this.cDisp=null; this.reloadSE(); },
    cancelDispEdit () { this.unmodOIDIE(this.cDisp?.oID); this.cDisp=null; this.reloadSE(); },
    // DS deletes
    dDisp(d) { const i = this.disps.findIndex(t => (d.cID && t.cID === d.cID) || (d.oID && t.oID === d.oID));
               if (i >= 0) this.disps.splice(i, 1); },
    // Buttons interactions
    validateBtnClicked() { if (!this.cDisp.oID) this.askForDispCreate(); else this.askForDispMod(); },
    askForDispCreate () { this.$api.postDisponibility({
      partner: this.partnerId, user: this.userId, kiosk: this.kioskId,
      start: this.cDisp.start, end: this.cDisp.end, recurrent: this.onRecurrentTab,
    }).then( () => { this.cancelDispCreat(); } ); },
    askForDispMod () { this.$api.patchDisponibility(this.cDisp.oID, {
      start: this.cDisp.start, end: this.cDisp.end, recurrent: this.onRecurrentTab,
    }).then( () => { this.mDisps[this.cDisp.oID] = null; this.reloadSE(); } ); },
    askForDispDelete () { this.$api.deleteDisponibility(this.cDisp.oID).then( () => { this.reloadSE(); } ); },
    // sets - cDisp and used disp in disps can be different. But times are shared so works for now...
    setDay(v) { this.bC(); const t = nDateAddDays(this.monday, v - 1);
                copyDMY(this.cDisp.start, t); copyDMY(this.cDisp.end, t); this.reloadSE(); },
    setStartH(v) { this.bC(); this.cDisp.start.setHours(v.target.value > 23 ? 23 : v.target.value); this.reloadSE(); },
    setStartM(v) { this.bC(); this.cDisp.start.setMinutes(v.target.value > 59 ? 59 : v.target.value); this.reloadSE(); },
    setEndH(v) { this.bC(); this.cDisp.end.setHours(v.target.value > 23 ? 23 : v.target.value); this.reloadSE(); },
    setEndM(v) { this.bC(); this.cDisp.end.setMinutes(v.target.value > 59 ? 59 : v.target.value); this.reloadSE(); },
    // backups
    bC(){ if (!this.cDisp.oID || this.mDisps[this.cDisp.oID]) return;
          this.$set(this.cDisp, 'class', 'disp-mine-recurrent-screen-modified'); this.bE(this.cDisp); },
    bE(e){ if (!e.oID || this.mDisps[e.oID]) return;
           this.$set(this.disps.filter(d => d.oID === e.oID)[0], 'class', 'disp-mine-recurrent-screen-modified');
           //this.$set(e, 'class', 'disp-mine-recurrent-screen-modified');  // Worked only when targetting actual event
           this.mDisps[e.oID] ||= { start: new Date(e.start), end: new Date(e.end)}; },
    // unbackup
    unmodOIDIE(oID) { if (!oID || !this.mDisps[oID]) return;
                      if (this.mDisps[oID]?.start) copyMHDMY(this.cDisp.start, this.mDisps[oID]?.start) ;
                      if (this.mDisps[oID]?.end) copyMHDMY(this.cDisp.end, this.mDisps[oID]?.end) ;
                      delete this.mDisps[oID]; },
    // reloads
    reloadSE() { this.reloader++; this.reloaderT++; this.reloaderG++; this.disps.push({}); this.disps.pop()},
  },
}
</script>

<style lang="scss">
@import "./styles/calendrier.scss";
</style>
