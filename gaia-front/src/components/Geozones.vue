<template lang="pug">
.width-container
  .hello
    //- .card
      MazInput(v-model="searchValue" left-icon-name="search" placeholder="Chercher un nom")
    .card
      .geozone(
        v-for="geozone in geozones" v-bind:key="geozone.id" v-on:click="openModal(geozone)"
      ) {{geozone.name}}
        .f-grow-1
        MazBtn.in-list-button.maz-btn--sm(
          v-if="iAmGreat" v-on:click.stop="deleteGeozone(geozone.id)"
        ) Supprimer
      MazBtn.more-geozones-button(v-on:click="showItemAddModal = true") +
  Modal(v-if="showItemAddModal" @close="closeModal")
    GeozoneAdd(@close="closeModal")
</template>

<script>
import { MazInput, MazBtn } from 'maz-ui'
import Modal from './reusables/Modal'
import GeozoneAdd from './reusables/GeozoneAdd'

export default {
  name: 'Geozones',  // TODO : make one for each partner
  components: { MazInput, MazBtn, Modal, GeozoneAdd },
  data() { return { searchValue: '', showItemAddModal: false, geozones: [] }; },
  computed: {
    iAmGreat() { return this.$api.iAmGreat(); },
  },
  methods: {
    openModal(geozone) { alert(`WiP infos  ${geozone.name}`); },
    deleteGeozone(id) { this.$api.deleteGeozone(id).then(() => this.loadList()); },
    loadList() { this.$api.listGeozones().then(obj => this.geozones=obj.results); },
    closeModal() { this.showItemAddModal = false; this.loadList(); },
  },
  beforeMount() { this.loadList(); },
}
</script>

<style lang="scss">
.geozone { padding: 10px 20px 10px 20px; transition: background-color 0.1s linear; display: flex; }
.geozones { margin-left: 20px; color: grey; }
.more-geozones-button { width: 100%; border-top-left-radius: 0; border-top-right-radius: 0; font-weight: bold; }
.maz-btn--primary:focus::before { border: none; }

.geozone:hover { background-color: rgba(0, 0, 0, 0.08); }
.in-list-button { margin-left: 10px; opacity: 0; transition: opacity 0.1s linear; }
.geozone:hover .in-list-button { opacity: 1; }
.more-persons-button { width: 100%; border-top-left-radius: 0; border-top-right-radius: 0; font-weight: bold; }
.maz-btn--primary:focus::before { border: none; }
</style>
