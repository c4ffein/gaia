<template lang="pug">
.width-container
  .page.shadow(v-if="!isDeactivated")
    .i-cover.w-full.mb-9.b-5-5-0-0.overflow-hidden.relative
      img.i-cover.w-full(
        :class="isInEdition ? 'blur-hover' : ''" style="height: 200px;" :src="bp" alt="m" @click="editBP"
      )
      .editable-p.material-icons(v-if="isInEdition")
    MazAvatar.absolute.bg-white(style="left: 5%; top: 120px;" :editable="isInEdition" bordered :src="pp" :size="160" square @edit="editPP")
    .absolute.t-30.font-again(style="top: 230px; left: calc(10% + 160px)") {{profileName}}
    .absolute.pointer.t-primary.underline-hover(v-if="isEditable" style="right: 5%; top: 230px;" v-on:click="viewAsStandard = !viewAsStandard") {{viewAsStandard ? 'Mode édition' : 'Voir comme un utilisateur standard'}}
    .absolute.t-secondary(v-if="unsaved" style="right: 5%; top: 250px;") Modifications non enregistrées

    .page-body

      //- Editable profile
      div(v-if="isInEdition").personal-data.font-again

        .mb-5
          MazSelect.maz-mb-3.login-field(
            :options="structureTypeOptions" :value="printableStructureType" placeholder="Nature de la structure"
            @input="updateStructureType"
          )
          .flex.mt-4(v-if="tStructureType !== null")
            button.btn.primary.w-1-2.mr-2.small(@click="saveStructureType()") Enregistrer
            button.btn.primary.w-1-2.ml-2.small.outline(@click="cancelStructureType()") Annuler

        .mb-5
          MazInput(:value="printableStreetAddress"
            @input="updateStreetAddress($event)" placeholder="Adresse de la structure"
          )
          .flex.mt-4(v-if="tStreetAddress !== null")
            button.btn.primary.w-1-2.mr-2.small(@click="saveStreetAddress()") Enregistrer
            button.btn.primary.w-1-2.ml-2.small.outline(@click="cancelStreetAddress()") Annuler


        MazInput(:value="description" textarea
          @input="updateDescription($event)" placeholder="Description de la structure"
        )
        .t-grey.mt-3.underline-hover.th-primary(v-if="tDescription !== null" @click="showModalFormat = true")
          | Aide formattage
        div(v-if="tDescription !== null" v-html="sMarked(description)")
        .flex.mt-4(v-if="tDescription !== null")
          button.btn.primary.w-1-2.mr-2.small(@click="saveDescription()") Enregistrer
          button.btn.primary.w-1-2.ml-2.small.outline(@click="cancelDescription()") Annuler

        .mt-5
          .t-grey.t-bold.mb-3 Je fournis mes services sur les territoires suivants
          MazCheckbox(v-for="territory, territoryId in computedZones"
            :value="territory.enabled" @input="enableOrNotZone(territoryId, $event)" v-bind:key="territoryId"
          ) {{territory.name}}
          .flex.mt-4(v-if="zonesNeedSave")
            button.btn.primary.w-1-2.mr-2.small(@click="saveZone()") Enregistrer
            button.btn.primary.w-1-2.ml-2.small.outline(@click="cancelZones()") Annuler

        div(v-for="(service, id) in printableServices" v-bind:key="id")
          .t-bold.mt-7.mb-3.t-20.t-primary {{service.name}}
            span.t-bold.mb-3.t-15.t-secondary(v-if="isChanged(id)")  - Modifications non enregistrées
          MazCheckbox.mb-3(:value="service.enabled" @input="enableOrNot(id, $event)")
            | {{ isSelf ? 'Je réponds à cette problématique' : 'Le partenaire répond à cette problématique'}}
          MazCheckbox.mb-3(
            v-if="service.enabled" :value="service.iframe_enabled" @input="useIframeOrNot(id, $event)"
          ) {{ isSelf ? 'Remplacer la prise de rendez-vous par une page de mon site' : 'Remplacer la prise de rendez-vous par une page du site partenaire'}}
          div(v-if="service.iframe_enabled")
            MazCheckbox(:value="service.iframe_as_alt" @input="useIframeAsAlt(id, $event)")
              | Ne pas intégrer le lien à la page mais l'ouvrir dans un nouvel onglet
            .mb-4.t-grey(style="margin-left: 27px;")
              | (ou une nouvelle fenêtre sur la borne, dans le cas où la page choisie ne permet pas l'affichage en IFrame par gaia-inclusion.fr)
          //- TODO : check url is valid
          MazInput.mb-4(
            v-if="service.enabled && service.iframe_enabled"
            :value="service.iframe_url" @input="updateIframeField(id, $event)"
            placeholder="Url" :disabled="!service.iframe_enabled"
          )
          MazInput(v-if="service.enabled" :value="service.description" @input="updateField(id, $event)" textarea
            placeholder="Comment répondez-vous à cette problématique" :disabled="!service.enabled"
          )
          .t-grey.mt-3.underline-hover.th-primary(v-if="isChanged(id)" @click="showModalFormat = true")
            | Aide formattage
          div(v-if="service.enabled && isChanged(id)" v-html="sMarked(service.description)")
          //- TODO : Include imgs
          .flex.mt-4(v-if="tServices[id]")
            button.btn.primary.w-1-2.mr-2.small(@click="saveService(id)") Enregistrer
            button.btn.primary.w-1-2.ml-2.small.outline(@click="cancelService(id)") Annuler
        div(v-if="unsaved")
          hr.mt-5.mb-5
          .flex
            button.btn.primary.w-1-2.mr-2(@click="saveAll()") Tout enregistrer
            button.btn.primary.w-1-2.ml-2.outline(@click="cancelAll()") Tout annuler

      //- Viewable profile
      div(v-if="!isInEdition").personal-data.font-again
        .div(v-html="sMarked(description)")
        //-div(v-for="(service, id) in printableServices" v-bind:key="id")
          div(v-if="service.enabled")
            .t-bold.mt-5.mb-3.t-20.t-primary {{service.name}}
            .div(v-html="sMarked(service.description)")

  // Is deactivated
  .page.shadow.py-7.px-7(v-if="isDeactivated")
    .t-20.t-bold Ce partenaire n'est plus disponible.
    .mt-5.t-20(v-if="isSelf") Vous pouvez contacter l'administrateur du site pour de plus amples informations.

  //- Viewable solutions
  .mt-9(v-if="!isInEdition && !isDeactivated")
    div(v-for="(service, id, index) in printableServices")
      CPDuo(
        v-if="service.enabled"
        :title="service.name"
        :texts="service.description"
        :reversed="Boolean(index % 2)"
        :futureRDVCategoryId="String(service.id)",
        :futureRDVPartnerId="String(id)",
        :margined="false",
      )
  ModalFormat(:show="showModalFormat" @close="showModalFormat = false" )

</template>

<script>
import { MazAvatar, MazCheckbox, MazInput, MazSelect } from 'maz-ui'
import ModalFormat from '../reusables/ModalFormat'
import CPDuo from '../welcome-components/CPDuo.vue'
import * as h from '@/libs/object-helpers/object-helpers'
import { fileSelect, loadImage, sMarked } from '@/libs/inputs'
import { whiteImgSrc } from '../../assets/assets.js'

export default {
  name: 'ProfilePartner',

  components: { MazAvatar, MazCheckbox, MazInput, MazSelect, ModalFormat, CPDuo },
  props: { id: String },
  data: () => ({
    tServices: {},
    tStructureType: null,
    tStreetAddress: null,
    tDescription: null,
    allZones: [],
    loadedZones: {},
    tempZones: {},
    viewAsStandard: false,
    showModalFormat: false,
  }),
  beforeMount() {
    this.$api.getPartner(this.id);
    this.$api.getFiles({partners_banner: this.id}); this.$api.getFiles({partners_pp: this.id});
    this.$api.getPartnerZone(this.id).then(r => this.loadedZones = r);
    this.$api.listSolutions();
    this.$api.listEpcis().then(geozones => this.allZones = geozones.results); // TODO ?..
  },
  computed: {
    // Object
    dS() { return this.$api.data.partners[this.id] },
    allServices() { return this.$api.filterNonDisabledSolutions(); },
    // States
    selfId() { return this.$api.Id(this.id); },
    userId() { return this.myUserId(); },
    partnerId() { return this.$api.iAmPartner(); },
    isSelf() { return this.partnerId === this.selfId; },
    isEditable() { return this.isSelf || this.$api.iAmGreat(); },
    isInEdition() { return this.isEditable && !this.viewAsStandard; },
    profileName() { return this.dS?.name; },
    isDeactivated() { return this.dS?.is_deactivated; },
    // TODO : Use <img src="data:," alt> instead
    pp() { return this.$api.files(this.dS?.profile_picture)?.b64 || whiteImgSrc; },
    bpDefault() { return require('@/assets/wall-pictures-s/john-ko-0C6Ep1n77l8-unsplash.jpg'); },
    bp() { return this.dS ? this.$api.files(this.dS?.banner_picture)?.b64 || this.bpDefault : whiteImgSrc; },
    // Profile type
    structureTypeOptions() { return this.$api.partnerTypeNames().map((e, i) => ({ label: e, value: i })); },
    printableStructureType() {
      return this.tStructureType === null ? (this.dS?.structure_type || 0) : this.tStructureType; },
    // Street Adress
    savedStreetAddress() { return this.dS?.street_address || ""; },
    printableStreetAddress() { return this.tStreetAddress === null ? this.savedStreetAddress : this.tStreetAddress; },
    // Profile description
    savedDescription() { return this.dS?.description || ''; },
    description() { return this.tDescription === null ? this.savedDescription : this.tDescription },
    // Partner categories
    shownServices() { return this.isSelf ? this.allServices : this.dS.services; },
    savedServices() { return this.dS?.solutions || {}; },
    computedServices() { return { ...this.allServices, ...this.savedServices, ...this.tServices }; },
    notDeactivatedComputedServices() { return h.oFE(h.oE(this.computedServices).filter(([k,]) => h.oK(this.allServices).includes(k))); },
    printableServices() { return h.oFE(h.oE(this.notDeactivatedComputedServices).map(([k, v]) => [k, {
      name: this.allServices[k]?.name || '',
      description: v?.description || '',
      enabled: !!v.enabled,
      iframe_enabled: !!v.iframe_enabled,
      iframe_as_alt: !!v.iframe_as_alt,
      iframe_url: v?.iframe_url || '',
    }])); },
    // Partner zones
    savedZones() {
      return h.oFE(h.oE(this.allZones).map(z => [z[0], { ...z[1], enabled: !!this?.loadedZones?.[z[0]] }]));
    },
    computedZones() { return h.oFE(h.oE(this.savedZones).map(z =>
      [z[0], {...z[1], enabled: !!(this.tempZones[z[0]] !== undefined ? this.tempZones[z[0]] : this.savedZones[z[0]]?.enabled)}]
    )); },
    zonesNeedSave() { return !!h.oE(this.tempZones).length },
    savableZones() { return h.oFE(h.oE(this.computedZones).filter(e => e[1].enabled).map(e => [e[0], true])); },
    // Both
    unsaved() { return (h.oK(this.tServices).length !== 0
      || this.tDescription !== null || this.tStructureType !== null || this.tStreetAddress !== null); },
  },
  methods: {
    updateDescription(value) { this.tDescription = value; },
    updateStreetAddress(value) { this.tStreetAddress = value; },
    enableOrNot(id, value) {
      if(!this.tServices[id]) this.$set(this.tServices, id, { description: this.computedServices[id].description });
      this.$set(this.tServices[id], 'enabled', value);
    },
    enableOrNotZone(id, value) {
      if(this.savedZones[id]?.enabled === value) this.$delete(this.tempZones, id);
      else this.$set(this.tempZones, id, value);
    },
    makeEmptyT(id) { this.$set(this.tServices, id, {
      enabled: this.savedServices[id].enabled,
      description: this.savedServices[id].description,
      iframe_url: this.savedServices[id].iframe_url,
      iframe_enabled: this.savedServices[id].iframe_enabled,
      iframe_as_alt: this.savedServices[id].iframe_as_alt,
    } ) },
    isTServiceUseless(id) {
      return this.tServices[id] && !h.oE(this.tServices[id]).some(([k, v]) => this.savedServices[id][k] !== v);
    },
    updateField(id, value) { this.setTProp(id, 'description', value); },
    updateIframeField(id, value) { this.setTProp(id, 'iframe_url', value); },
    useIframeOrNot(id, value) { this.setTProp(id, 'iframe_enabled', value); },
    useIframeAsAlt(id, value) { this.setTProp(id, 'iframe_as_alt', value); },
    setTProp(id, propName, value) {
      if(!this.tServices[id]) this.makeEmptyT(id);
      this.$set(this.tServices[id], propName, value);
      if (this.isTServiceUseless(id)) { this.$delete(this.tServices, id); return; }
    },
    isChanged(id) { return !!this.tServices[id]; },
    updateStructureType(s) { this.tStructureType = this.dS?.structure_type === s ? null : s; },
    // Cancels
    cancelService(id) { id ? this.$delete(this.tServices, id) : this.$set(this, 'tServices', {}); },
    cancelDescription() { this.$set(this, 'tDescription', null) },
    cancelStructureType() { this.$set(this, 'tStructureType', null) },
    cancelStreetAddress() { this.$set(this, 'tStreetAddress', null); },
    cancelAll() { this.cancelService(); this.cancelDescription(); },
    // Filters
    filterName(service) { return {
      description: service.description, enabled: service.enabled,
      iframe_url: service.iframe_url, iframe_enabled: service.iframe_enabled, iframe_as_alt: service.iframe_as_alt
    } },
    filterNames(services) { return h.oFE(h.oE(services).map(([k, v]) => [k, this.filterName(v)])); },
    // Picture
    editPP() { fileSelect({accept: '.jpg, .jpeg, .png'}).then(r => loadImage(r[0])).then(b64 => this.uploadPP(b64)); },//
    uploadPP(loadedFile) { this.$api.saveFile(loadedFile, true).then(
      r => this.$api.patchPartner(this.id, {profile_picture: r.id})); },
    editBP() { if(!this.isInEdition) return; fileSelect({accept: '.jpg, .jpeg, .png'}).then(r => loadImage(r[0])).then(b64 => this.uploadBanner(b64)); },//
    uploadBanner(loadedFile) { this.$api.saveFile(loadedFile, true).then(
      r => this.$api.patchPartner(this.id, {banner_picture: r.id})); },
    // Saves
    saveService(id) { this.$api.patchPartner(this.selfId, {solutions:
      {[id]: this.filterName(this.printableServices[id])}}).then(() => this.$delete(this.tServices, id)); },
    saveServices() { return this.$api.patchPartner(
      this.selfId, {solutions: h.oFE(h.oK(this.tServices).map(k => [k, this.filterName(this.printableServices[k])]))}
    ).then(() => this.$set(this, 'tServices', {})); },
    saveDescription() { return this.$api.patchPartner(this.selfId, {description: this.description}).then(
      () => { this.$set(this, 'tDescription', null); } ); },
    saveStreetAddress() { return this.$api.patchPartner(this.selfId, {
      street_address: this.printableStreetAddress}).then(() => { this.$set(this, 'tStreetAddress', null); } ); },
    saveStructureType() { return this.$api.patchPartner(this.selfId, {
      structure_type: this.printableStructureType}).then(() => { this.$set(this, 'tStructureType', null); } ); },
    saveZone() { this.$api.savePartnerZone(this.selfId, this.savableZones).then(r => {
      this.loadedZones = r.epcis; this.tempZones = {}; }); },
    cancelZones() { this.$set(this, "tempZones", {}); },
    saveAll() { this.$api.patchPartner(this.selfId, {
      solutions: h.oFE(h.oK(this.tServices).map(k => [k, this.filterName(this.printableServices[k])])),
      description: this.description, street_address: this.printableStreetAddress,
      structure_type: this.printableStructureType}).then(this.saveZone).then(() => {
        this.$set(this, 'tServices', {}); this.$set(this, 'tDescription', null);
        this.$set(this, 'tStreetAddress', null); this.$set(this, 'tStructureType', null); }); },
    sMarked(str) { return sMarked(str); },
  },
}
</script>
