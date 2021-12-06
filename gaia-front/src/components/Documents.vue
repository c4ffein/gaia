<template lang="pug">
.width-container
  .card
    MazInput(v-model="searchValue" left-icon-name="search" placeholder="Chercher un document")
  .shadow.mb-5.flex
    MazBtn.add-document-button(v-on:click="addImage") Ajouter un document
    MazCheckbox.mt-5(v-if="iAmPartner || iAmGreat" v-model="addAsPublic") Ajouter en public
    MazBtn.add-document-button(v-if="iAmPartner" v-on:click="exportBase") Export base beneficiaire
    MazBtn.add-document-button(v-if="iAmGreat" v-on:click="exportStatsAdmin") Export statistiques
    MazBtn.add-document-button(v-if="iAmGreat" v-on:click="exportBaseAdmin") Export base utilisateur
  //- TODO : Fixed column size for screen size, adapt size of cards
  .flex.f-wrap
    .card.mx-5(v-for="file in myReversedFiles" v-bind:key="file.id" v-on:click="openModal(file.id)"
      style="height: 150px; width: 250px;"
    )
      .bg-primary(v-if="fileType(file) === 'data:application/pdf'" style="height: 150px; width: 250px")
        .t-white.t-30.t-bold.t-center.pt-7 Pdf
      img.i-contain(v-if="fileType(file).split('/')[0] === 'data:image'" :src="file.b64" height="150px" width="250px" style="")
  Modal(v-if="showDocModal" @close="closeModal" unlimited)
    img.i-contain(v-if="fileType(modalFile).split('/')[0] === 'data:image'" :src="modalFile ? modalFile.b64 : ''" style="max-width:100%;")
    //-Pdf(v-if="fileType(modalFile) === 'data:application/pdf'" :b64="modalFile.b64" cstyle="width: 600px; height: 100%;")
    Pdf(v-if="fileType(modalFile) === 'data:application/pdf'" :b64="modalFile.b64" cstyle="width: 600px; height: 600px;")
</template>

<script>
import { MazInput, MazBtn, MazCheckbox } from 'maz-ui'
import Modal from './reusables/Modal'
import Pdf from './reusables/Pdf'
import * as h from '@/libs/object-helpers/object-helpers'
import { fileSelect, loadFile } from '@/libs/inputs'
import { saveAs } from '@/libs/file-saver/file-saver'

export default {
  name: 'Documents',
  components: { MazInput, MazBtn, MazCheckbox, Modal, Pdf },
  data () { return { searchValue: '', showDocModal: false, modalFileId: null, addAsPublic: false } },
  beforeMount() {
    this.$api.getFiles({partner: this.$api.iAmPartner() ? this.$api.partnerId() : undefined});
  },
  computed: {
    files() { return this.$api.data.files; },
    myFilesArray() { return h.oV(this.files).filter(v => this.isMine(v)); },
    myReversedFiles() { return this.myFilesArray.slice().reverse(); },
    iAmGreat() { return this.$api.iAmGreat(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    partnerId() { return this.$api.partnerId(); },
    modalFile() { return this.modalFileId ? this.files[this.modalFileId] : {}; },
  },
  methods: {
    openModal(modalFileId) { this.modalFileId = modalFileId; this.showDocModal = true; },
    closeModal() { this.showDocModal = false; },
    addImage() { fileSelect({accept: '.jpg, .jpeg, .png, .pdf'}).then(r => loadFile(r[0], ['image', 'pdf'])).then(b64 => this.$api.saveFile(b64, this.addAsPublic)); },//
    isMineAsPartner(f) { return this.$api.Id(f.partner) === this.$api.partnerId(); },
    isMineAsUser(f) { return this.$api.Id(f.user) === this.$api.myUserId(); },
    isMine(f) { return this.$api.iAmPartner() ? this.isMineAsPartner(f) : this.isMineAsUser(f); },
    // TODO : Make the backend serve `Accept: text/csv` header
    exportBase() { this.$api.getPartnerStats(this.partnerId).then(j => saveAs(new Blob([j.csv]), j.filename)); },
    exportStatsAdmin() { this.$api.getAdminStats().then(j => saveAs(new Blob([j.csv]), j.filename)); },
    exportBaseAdmin() { this.$api.getAdminBase().then(j => saveAs(new Blob([j.csv]), j.filename)); },
    // Files
    fileType(file) { return file.b64.split(';')[0]; },
  },
}
</script>
