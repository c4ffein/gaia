<template lang="pug">
.width-container
  .hello
    .section-title.t-bold.t-primary {{title}}
    .page(style="background-color=white; min-height=1000px; width=100%")
      .t-20.t-bold.t-primary.ml-10.mb-0.pt-5(v-if="isFinal") Finalisé le {{lastRemoteSave}}
      //- <!-- <MazSelect
        v-model="beneficiaireMinimaSocial"
        placeholder="Bénéficiaire d'un minima social"
        :options="beneficiaireMinimaSocialOptions"
        /><div style="height: 12px;"></div> -->
      div
        MazTabsContent(:active-tab="stepper")
          MazTabsContentItem.maz-p-3.maz-text-center(
            v-for="(formPage, formPageNumber) in form" v-bind:key="formPageNumber"
          )
            div(v-for="item in formPage" v-bind:key="item.id" v-if="isFinal")
              div(v-if="itemAvailable(item)")
                .t-left.t-bold.t-grey.mt-5.mb-2(v-if="isTitle(item)") {{item.title}}

                .t-left.t-primary.mt-2.mb-2(v-if="isSubtext(item)") {{item.title}}

                .t-left.t-darker.ml-3(v-if="isCheckbox(item)") {{item.title}} :
                  span.t-primary.t-bold  {{getValue(item) ? 'Oui' : 'Non'}}

                MazSelect.mb-4(v-if="isSelect(item)" disabled :value="getValue(item)" :placeholder="item.title" :options="item.options" )

                .mb-4(v-if="isSelectBtnGrp(item)")
                  div(style="text-align: left;") {{item.title}}
                  MazBtnGroup(:vertical="item.style === 'vertbtngrp' ? true : false"
                    disabled @input="setValue(item, $event)" :value="getValue(item)" :items="item.options" size="sm" outline
                  )

                DateInput.mb-4.mt-5(ltstyle="color: #000000; text-align: left; margin-left: 0;"
                  disabled v-if="isPicker(item)" :msg="item.title" :value="getValue(item)"
                )

                .t-left.t-darker.ml-3(v-if="isYear(item) || isShortInput(item)") {{item.title}} :
                  span.t-primary.t-bold  {{getValue(item)}}

                .t-left.t-darker.ml-3(v-if="isYear(item) || isLongInput(item)") {{item.title}} :
                  .t-primary.pre-wrap  {{getValue(item)}}

                ScanOrDownload.mb-4(v-if="isScanOrDownload(item)")

                PrintOrSave.mb-4(v-if="isPrintOrSave(item)")

            div(v-for="item in formPage" v-bind:key="item.id" v-if="!isFinal")
              div(v-if="itemAvailable(item)")
                .t-left.t-bold.t-primary.mt-5.mb-2(v-if="isTitle(item)") {{item.title}}

                .t-left.t-primary.mt-2.mb-2(v-if="isSubtext(item)") {{item.title}}

                MazCheckbox.mb-4( v-if="isCheckbox(item)" :value="getValue(item)" @input="setValue(item, $event)" )
                  | {{item.title}}

                .flex.f-ai-center.mb-5(v-if="isYesNo(item)")
                  div(style="text-align: left;") {{item.title}}
                  MazBtnGroup.ml-4( size="mini" outline @input="setValue(item, $event)" :value="getValue(item)"
                     :items="[{label: 'Oui', value: true}, {label: 'Non', value: false}]" style="width: 110px;"
                  )

                MazSelect.mb-4(v-if="isSelect(item)" @input="setValue(item, $event)"
                  :value="getValue(item)" :placeholder="item.title" :options="item.options"
                )

                .mb-4(v-if="isSelectBtnGrp(item)")
                  div(style="text-align: left;") {{item.title}}
                  MazBtnGroup(:vertical="item.style === 'vertbtngrp' ? true : false"
                    @input="setValue(item, $event)" :value="getValue(item)" :items="item.options" size="sm" outline
                  )

                DateInput.mb-4.mt-5(ltstyle="color: #000000; text-align: left; margin-left: 0;"
                  v-if="isPicker(item)" :msg="item.title" :value="getValue(item)" @input="setValue(item, $event)"
                )

                YearInput.mb-4.mt-5(ltstyle="color: #000000; text-align: left; margin-left: 0;"
                  v-if="isYear(item)" :msg="item.title" :value="getValue(item)" @input="setValue(item, $event)"
                )

                //- TODO better
                .flex.f-ai-center.mb-4.float(v-if="isShortInput(item)")
                  span(style="text-align: left;") {{item.title}}
                  input.npt.t-15.ml-5.f-auto(v-if="isShortInput(item)"
                    :value="getValue(item)" @input="setValue(item, $event.target.value)"
                  )

                .flex.f-col.mb-4.float(v-if="isLongInput(item)")
                  div(style="text-align: left;") {{item.title}}
                  textarea.lnpt.t-15.ml-5.px-2.py-2.f-auto(rows="5" v-if="isLongInput(item)"
                    :value="getValue(item)" @input="setValue(item, $event.target.value)"
                  )

                ScanOrDownload.mb-4(v-if="isScanOrDownload(item)")

                PrintOrSave.mb-4(v-if="isPrintOrSave(item)")

        .flex(style="justify-content: space-between; padding-top: 10px;")
          .maz-flex-left.maz-flex.maz-mt-2.ml-5
            MazBtn(:disabled="stepper==1" v-on:click="stepper -= 1")
              | Précédent
          .maz-flex-center.maz-flex.maz-mt-4
            MazStepper(v-model="stepper" :steps="form.length" :size="12" style="width: 100px; padding-bottom: 50px;")
          .maz-flex-right.maz-flex.maz-mt-2.mr-5
            MazBtn(:disabled="stepper == form.length && isFinal"
              v-on:click="stepper != form.length ? stepper += 1 : lastButtonClicked()"
            ) {{ stepper == form.length ? "Enregistrer" : "Suivant"}}
  Modal( v-if="showConfirm || showError || showSaved" @close="showConfirm = false; showError = false" )
    div(v-if="showConfirm && !showError")
      .modal-header(:style="`text-align: {align}; margin-bottom: 0; white-space: pre-wrap;`")
        | Vous pouvez enregistrer le formulaire dans son état actuel, ou le finaliser.
        | Si vous finalisez sa saisie, il ne sera plus modifiable par la suite.
      button.btn.primary.w-full.mt-5.small(@click="finalize") Finaliser
      button.btn.primary.w-full.mt-3.small(@click="save(false)") Enregistrer
      button.btn.primary.w-full.mt-4.small.outline(@click="showConfirm = false") Annuler
    Information(v-if="showSaved" msg="Formulaire enregistré"
      @okClicked="showSaved = false" :align="'left'"
    )
    Information(v-if="showError" msg="Impossible d'enregistrer le formulaire pour une raison inconnue" error
      @okClicked="showError = false" :align="'left'"
    )
</template>

<script>
import {
  MazTabsContent, MazTabsContentItem, MazStepper, MazCheckbox, MazSelect, MazBtn, MazBtnGroup
} from 'maz-ui'
import Modal from './reusables/Modal'
import Confirm from './reusables/Confirm'
import Information from './reusables/Information'
import DateInput from './reusables/DateInput'
import YearInput from './reusables/YearInput'
import PrintOrSave from './PrintOrSave'
import ScanOrDownload from './ScanOrDownload'
import { dashDateToSlashDate } from '@/libs/inputs'
import { prettyDate } from '@/libs/drftimestamp'

import * as h from '@/libs/object-helpers/object-helpers'


export default {
  name: 'Form',
  props: { id: String },
  components: {
    MazTabsContent, MazTabsContentItem, MazStepper, MazCheckbox, MazSelect, MazBtn, MazBtnGroup,
    PrintOrSave, ScanOrDownload, DateInput, YearInput, Confirm, Modal, Information
  },
  data() { return { stepper: 1, dS: {}, m: {}, user: {}, showConfirm: false, showError: false, showSaved: false }; },
  methods: {
    isTitle(item) { return item.type==='title'; },
    isSubtext(item) { return item.type==='subtext'; },
    isCheckbox(item) { return item.type==='checkbox' && item.style!=='yesno'; },
    isYesNo(item) { return item.type==='checkbox' && item.style==='yesno'; },
    isSelect(item) { return item.type==='select' && item.style !== 'btngrp' && item.style !== 'vertbtngrp'; },
    isSelectBtnGrp(item) { return item.type==='select' && (item.style === 'btngrp' || item.style === 'vertbtngrp'); },
    isPicker(item) { return item.type==='date'; },
    isYear(item) { return item.type==='year'; },
    isInput(item) { return item.type==='input'; },
    isShortInput(item) { return item.type==='input' && !(item.style==='long'); },
    isLongInput(item) { return item.type==='input' && item.style==='long'; },
    isScanOrDownload(item) { return item.type==='scanordownload'; },
    isPrintOrSave(item) { return item.type==='printorsave'; },
    itemAvailable(item) { if ('conditions' in item) return this.validateConditions(item.conditions); return true; },
    itemAvlblUsr(item) { return this.itemAvailable(item) && this.notPartnerOnly(item); },
    notPartnerOnly(item) { return !item.conditions || !item.conditions.partner_only; },
    validateConditions(conditions) { return !h.oE(conditions).some(condition => !this.validateCondition(...condition)) },
    validateCondition(conditionType, conditionCheck) {
      if (conditionType === 'if') return this.getValue(this.getItem(conditionCheck));
      if (conditionType === 'ifnot') return !this.getValue(this.getItem(conditionCheck));
      if (conditionType === 'partner_only') return conditionCheck ? this.iAmPartner : true;
      if (conditionType === 'edition_only') return conditionCheck ? !this.isFinal : true;
      return true;
    },
    // TODO : Actually save values that sould be saved as false instead...
    lastButtonClicked() { if (!this.willFinal) this.save(); else this.showConfirm = true; },
    aSave(final) { return this.$api.saveForm(this.dS.id, {json: {...this.dS.json, ...this.m}, validate: final}).then(
      () => { this.showConfirm = false; this.showSaved = true; } ); },
    save(final) { return this.aSave(final).catch(() => { this.showError = true; } ); },
    finalize() { this.aSave(true).then(() => {
      // TODO : profile save from form must be done in backend
      if (this.dS.type === 1) this.$api.setUserProfile(this.user, {categories: {Profil: this.generatedProfile}}).then(() =>
        this.$router.push({name: 'profile', params: { id: String(this.dS.user) } })
      ).catch(() => { this.showError = true; } )
      else this.$router.push({name: 'profile', params: { id: String(this.dS.user) } });
    } ).catch(() => { this.showError = true; } ) },
    toKV(o) {
      const value = this.getValue(o);
      if(o.type === 'select') {
        const arr = o.options.filter(oo => oo.value === value);
        return [o.title, arr.length === 0 ? 'non renseigné' : arr[0].label];
      }
      if(o.type === 'date') return [o.title, dashDateToSlashDate(value)];
      return [o.title, value];
    },
    getItem(itemId) { return this.itemStruct[itemId]; },
    getValue(item) {
      return item.id in this.m ? this.m[item.id] : item.id in this.dS.json ? this.dS.json[item.id] : item.value;
    },
    setValue(item, value) { this.$set(this.m, item.id, value); },
  },
  beforeMount() {
    this.$api.getForm(this.id).then(form => {this.$set(this, 'dS', form);
      this.$api.getUser(this.dS.user).then(user => this.$set(this, 'user', user))
    });
  },
  computed: {
    iAmPartner() { return this.$api.iAmPartner(); },
    form() { return this.dS.form_template || []; },
    username() { return (this.user && this.user.id) ? ` ${this.user.firstname} ${this.user.lastname}` : ''; },
    title() { return `${this.titleType}${this.username}`; },
    itemStruct() { const iS = {}; this.form.forEach(p => p.forEach(item => { iS[item.id] = item; })); return iS; },
    lastRemoteSave() { return this.dS?.updated_at && prettyDate(this.dS?.updated_at) },
    // TODO : real bad, both next
    titleType() { return this.$api.formTypeName(this.dS?.type); },
    finalised() { return !!this.dS.partner_validated || !!this.dS.user_validated; },
    isFinal() { return this.willFinal && this.finalised; },
    willFinal() { return this.dS?.type === 4 || this.dS?.type === 8; },  // TODO : implement back
    generatedProfile() { return this.form.reduce((a, c) => [...a, ...c], []).filter(
      o => this.itemAvlblUsr(o)).map(o => this.toKV(o)); },
  },
}
</script>

<style lang="scss">
// .maz-select__options-list__item.selected {
// maz-select__options-list__items-container maz-flex maz-direction-column
.maz-select__options-list__items-container { z-index: 1000; }

.maz-tabs-content { overflow-y: auto; }

.maz-btn-group[vertical] { display: block; }
.maz-btn-group[vertical] > button { display: block; width: 100%; }

// Make top round
// button.maz-base-component.maz-btn.maz-inline-flex.maz-btn-group__item.maz-btn--primary.maz-btn--outline:first-child{
//   border-top-left-radius: 8px; border-top-right-radius: 8px; border-bottom-left-radius: 0px;
// }
.maz-btn-group[vertical] > .maz-btn-group__item.maz-btn--outline:first-child::after {
  border-top-left-radius: 8px; border-top-right-radius: 8px; border-bottom-left-radius: 0px;
}
.maz-btn-group[vertical] > .maz-btn-group__item.maz-btn--outline:first-child::after {
  border-top-left-radius: 8px; border-top-right-radius: 8px; border-bottom-left-radius: 0px;
}

// Make bottom round
// button.maz-base-component.maz-btn.maz-inline-flex.maz-btn-group__item.maz-btn--primary.maz-btn--outline:last-child{
//   border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-left-radius: 8px;
// }
.maz-btn-group[vertical] > .maz-btn-group__item.maz-btn--outline:last-child::after {
  border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border-top-right-radius: 0px;
}
.maz-btn-group[vertical] > .maz-btn-group__item.maz-btn--outline:last-child::after {
  border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border-top-right-radius: 0px;
}

// Bottom outline
.maz-btn-group[vertical] > .maz-btn-group__item.maz-btn--outline:not(:last-child)::after {
  border-bottom: 0px; bottom: 0px;
}
.maz-btn-group[vertical] > button.maz-base-component.maz-btn.maz-inline-flex.maz-btn-group__item.maz-btn--primary.maz-btn--outline:not(:last-child) {
  height: 40px; padding-top: 0; padding-bottom: 0;
  // bottom: -2!important;
}
// button.maz-base-component.maz-btn.maz-inline-flex.maz-btn-group__item.maz-btn--primary.maz-btn--outline:not(:last-child) span{
//   height: 20px; bottom: -2;
// }

</style>
