<template lang="pug">
.width-container
  .page.shadow
    .i-cover.w-full.mb-9.b-5-5-0-0.overflow-hidden.relative
      img.i-cover.w-full(:class="isEditable ? 'blur-hover' : ''" style="height: 200px;" :src="bp" alt="m" @click="editBP")
      .editable-p.material-icons(v-if="isEditable")
    MazAvatar.absolute.bg-white(style="left: 5%; top: 120px;" :editable="isEditable" bordered :src="pp" :size="160" @edit="editPP")
    .absolute.t-30.font-again(style="top: 230px; left: calc(10% + 160px)") {{profileName}}
    router-link.absolute.pointer.t-primary.underline-hover(
      v-if="isEditable" style="right: 5%; top: 230px;" :to="{ name: 'form', params: { id: String(profileFormId) } }"
    ) {{'Édition formulaire'}}
    .absolute.t-secondary(v-if="unsaved" style="right: 5%; top: 250px;") Modifications non enregistrées

    .page-body
      .mb-5
        //- .t-30.font-again {{profileName}}
        //- .resumee.font-again(style="font-size: 1.3em;") {{printableDescription}} //- TODO

      //- User stuff
      .personal-data.font-again

        .my-3.t-primary.t-bold.mb-6(style="font-size: 1.5em;" v-if="partnersAsBeneficiary.length !== 0")
          | Bénéficiaire suivi par
          router-link.ml-3.t-black.t-normal.th-primary.underline-hover(
            v-for="partnerId in partnersAsBeneficiary" v-bind:key="partnerId"
            :to="{ name: 'partner', params: {id: String(partnerId)} }"
          ) {{ partnerName(partnerId) }}

        .data-categorie.mb-6(v-for="categoryItems, categoryName in categories" v-bind:key="categoryName")
          .data-categorie-name.t-primary.t-bold.mb-4(style="font-size: 1.5em;") {{ categoryName }}
          .mb-3(v-for="[categoryItemName, categoryItemValue] in categoryItems" v-bind:key="categoryItemName")
            span.t-bold {{ categoryItemName }}
            | : {{ convertValue(categoryItemValue) }}

        .data-categorie.mb-6(v-if="")
          .data-categorie-name.t-primary.t-bold.mb-4(style="font-size: 1.5em;") Tous les formulaires
          router-link.block.mb-3.t-no-decoration.t-black.th-primary.underline-hover(
            v-for="form in userForms" v-bind:key="form.id" :to="{ name: 'form', params: {id: String(form.id)} }"
          )
            div(v-if="!form.warning_needed")
              span.t-bold {{ $api.formTypeName(form.type) }}
              |  - {{ prettyDate(form.updated_at) }}
              span(v-if="isFormEditable(form)")  - modifiable
            .t-warning(v-if="form.warning_needed")
              span.t-bold {{ $api.formTypeName(form.type) }}
              |  - {{ prettyDate(form.updated_at) }} - Non finalisé


</template>

<script>
import { MazAvatar, MazCheckbox, MazInput } from 'maz-ui'
import * as h from '@/libs/object-helpers/object-helpers'
import { prettyDate } from '@/libs/drftimestamp'
import { fileSelect, loadImage } from '@/libs/inputs'
import { whiteImgSrc } from '../../assets/assets.js'

export default {
  name: 'ProfileUser',

  components: { MazAvatar, MazCheckbox, MazInput },
  props: { id: String },
  data: () => ({ tServices: {}, tDescription: null }),
  beforeMount() {
    // TODO : MAKE BOTH at the same time. Make getUserForm use forms list with param? Or just check forms included?
    this.$api.getUser(this.id).then(u => this.$api.getUserForms(u));// TODO SHOWERROR? .catch
    this.$api.getFiles({users_banner: this.id}); this.$api.getFiles({users_pp: this.id});
  },
  computed: {
    // Object
    dS() { return this.$api.data.users[this.id] },
    // States
    selfId() { return this.$api.Id(this.id); },
    userId() { return this.$api.myUserId(); },
    partnerAsMemberId() { return String(this.$api.iAmPartner()); },

    partnersAsBeneficiary() { return this.dS?.partners_as_beneficiary || [] },

    isSelf() { return this.userId === this.selfId; },
    iAmPartner() { return this.$api.iAmPartner(); },
    isEditable() { return this.isSelf || this.partnersAsBeneficiary.includes(this.iAmPartner) || this.$api.iAmGreat(); },
    profileName() { return (this.dS?.firstname || '')+' '+(this.dS?.lastname || ''); },

    // TODO : Fix so array check unneeded
    userFormsId() { return (Array.isArray(this.dS?.forms) && this.dS?.forms) || []; },
    userForms() { return this.userFormsId.map(id => this.$api.data.forms?.[id]).filter(f => !!f); },
    // userForms() { return this.userFormsId; },
    // TODO : Filter instead to not mix with rdv
    profileFormId() { return this.userForms.filter(f => f.type === 1).length === 0 ? undefined : this.userForms.filter(
      f => f.type === 1)[0].id; },

    savedProfile() { return this.dS?.profile || {} },
    showedProfile() { return this.savedProfile },
    ppIcon() { return require('@/assets/material-person-18dp.svg'); },
    ppDefault() { return (this.dS && !this.dS?.profile_picture) ? this.ppIcon : whiteImgSrc; },
    pp() { return this.$api.files(this.dS?.profile_picture)?.b64 || this.ppDefault; },
    bpWp() { return require('@/assets/wall-pictures-s/john-ko-0C6Ep1n77l8-unsplash.jpg'); },
    bpDefault() { return (this.dS && !this.dS.banner_picture) ? this.bpWp : whiteImgSrc; },
    bp() { return this.$api.files(this.dS?.banner_picture)?.b64 || this.bpDefault; },
    personalData() { return this.showedProfile?.forms || []; },
    // Profile description
    savedDescription() { return this.dS?.profile?.description; },
    printableDescription() { return this.tDescription === null ? this.savedDescription : this.tDescription },
    // User stuff
    categories() { return this.dS?.profile?.categories || {}; },
    // Both
    unsaved() { return h.oK(this.tServices).length !== 0 || this.tDescription !== null; }
  },
  methods: {
    updateDescription(value) { this.tDescription = value; },
    enableOrNot(id, value) {
      if(!this.tServices[id]) this.$set(this.tServices, id, { description: this.computedServices[id].description });
      this.$set(this.tServices[id], 'enabled', value);
    },
    updateField(id, value) {
      if(!this.tServices[id]) this.$set(this.tServices, id, { enabled: this.savedServices[id].enabled });
      this.$set(this.tServices[id], 'description', value);
    },
    isChanged(id) { return !!this.tServices[id]; },
    isFormEditable(form) { return this.$api.iAmPartner() ? form.partner_editable : form.user_editable; },
    // Cancels
    cancelService(id) { id ? this.$delete(this.tServices, id) : this.$set(this, 'tServices', {}); },
    cancelDescription() { this.$set(this, 'tDescription', null) },
    cancelAll() { this.cancelService(); this.cancelDescription(); },
    // Filters
    filterName(service) { return { description: service.description, enabled: service.enabled } },
    filterNames(services) { return h.oFE(h.oE(services).map(([k, v]) => [k, this.filterName(v)])); },
    // Picture
    editPP() { fileSelect({accept: '.jpg, .jpeg, .png'}).then(r => loadImage(r[0])).then(b64 => this.uploadPP(b64)); },//
    uploadPP(loadedFile) { this.$api.saveFile(loadedFile, true).then(r => this.$api.patchUserPP(this.id, r.id)); },
    editBP() { fileSelect({accept: '.jpg, .jpeg, .png'}).then(r => loadImage(r[0])).then(b64 => this.uploadBanner(b64)); },//
    uploadBanner(loadedFile) { this.$api.saveFile(loadedFile, true).then(r => this.$api.patchUserBP(this.id, r.id)); },
    partnerName(partnerId) { return this.$api.data?.partners?.[partnerId]?.name; },
    // Saves
    //saveAll() { this.saveServices(); },  // TODO : Update once API is made

    prettyDate(d) { return prettyDate(d) },

    // TODO : REALLY DIRTY
    convertValue(value) { if(value === true) return 'oui'; if(value === false) return 'non'; return value; }
  },
}
</script>
