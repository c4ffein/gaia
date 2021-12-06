<template lang="pug">
.width-container
  .hello
    //- .card
      MazInput(v-model="searchValue" left-icon-name="search" placeholder="Chercher un nom")
    .card
      MazBtnGroup.w-full.two-choices( outline v-if="disabledSolutions.length !== 0" v-model="showDisabled"
        :items="[{label:'Solutions actives', value: false}, {label:'Solutions désactivées', value: true}]"
      )
      .solution(
        v-for="solution in showableSolutions" v-bind:key="solution.id" v-on:click="openModal(solution)"
      ) {{solution.name}}
        .f-grow-1
        MazBtn.in-list-button.maz-btn--sm(
          v-if="iAmGreat" v-on:click.stop="selectedSolutionId = solution.id; showSolutionDelete = true;"
        ) {{ solution.is_deactivated ? 'Réactiver' : 'Désactiver'}}
      MazBtn.more-solutions-button(v-on:click="showItemAddModal = true") +
  Modal(v-if="showItemAddModal || showItemModifyModal || showSolutionDelete || informationMessage" @close="closeModal")
    SolutionAdd(v-if="showItemAddModal" @close="closeModal")
    SolutionModify(v-if="showItemModifyModal" :selected="selectedSolution" @close="closeModal")
    div(v-if="showSolutionDelete")
      .t-error.t-20.t-bold
        div(v-if="!selectedSolution.is_deactivated")
          div Êtes vous sur de vouloir désactiver cette solution?
          div Elle ne sera plus accessible jusqu'à son éventuelle réactivation
          button.btn.error.w-full.mt-4( @click="disableSolution()" ) Confirmer
        div(v-else)
          div Êtes vous sur de vouloir réactiver cette solution?
          div Elle sera de nouveau accessible
          button.btn.error.w-full.mt-4( @click="reenableSolution()" ) Confirmer
        button.btn.primary.outline.w-full.mt-4( @click="showSolutionDelete = false;" ) Annuler
    Information( v-if="informationMessage" :msg="informationMessage" @okClicked="informationMessage = ''" )
</template>

<script>
import { MazInput, MazBtn, MazBtnGroup } from 'maz-ui'
import Modal from './reusables/Modal'
import SolutionAdd from './reusables/SolutionAdd'
import SolutionModify from './reusables/SolutionModify'
import Information from './reusables/Information'
import * as h from '@/libs/object-helpers/object-helpers'

export default {
  name: 'Solutions',
  components: { MazInput, MazBtn, MazBtnGroup, Modal, SolutionAdd, SolutionModify, Information },
  data() { return {
    searchValue: '',
    showItemAddModal: false,
    showItemModifyModal: false,
    selectedSolutionId: null,
    showDisabled: false,
    showSolutionDelete: false,
    informationMessage: '',
  }; },
  computed: {
    iAmGreat() { return this.$api.iAmGreat(); },
    selectedSolution() { return this.solutions.filter(s => s.id === this.selectedSolutionId)[0]; },
    solutions() { return h.oV(this.$api.data.solutions || {}); },
    notDisabledSolutions() { return this.solutions.filter(o => !o.is_deactivated); },
    disabledSolutions() { return this.solutions.filter(o => o.is_deactivated); },
    showableSolutions() { return this.showDisabledQF ? this.disabledSolutions : this.notDisabledSolutions; },
    showDisabledQF() { return this.showDisabled && this.disabledSolutions.length !== 0 },
  },
  methods: {
    openModal(solution) { this.selectedSolutionId = solution.id; this.showItemModifyModal = true; },  // TODO : JUST MAKE A COPY to fix props stuff
    deleteSolution(id) { this.$api.deleteSolution(id); },
    closeModal() { this.showItemAddModal = false; this.showItemModifyModal = false; },
    showOnlyDisabledOptions() { return [{ label: 'Actives', value: 0 }, { label: 'Inactives', value: 1 }]; } ,
    listedSolutions() { return this.showOnlyActivated ?
      this.solutions.filter(solution => !solution.is_deactivated) :
      this.solutions.filter(solution => solution.is_deactivated);
    },
    disableSolution() { this.$api.patchSolution(this.selectedSolutionId, { is_deactivated: true }).then(() => {
      this.informationMessage = 'La solution est maintenant désactivée'; this.showSolutionDelete = false; }); },
    reenableSolution() { this.$api.patchSolution(this.selectedSolutionId, { is_deactivated: false }).then(() => {
      this.informationMessage = 'La solution est maintenant réactivée'; this.showSolutionDelete = false; }); },
  },
  beforeMount() { this.$api.listSolutions(); },
}
</script>

<style lang="scss">
.solution { padding: 10px 20px 10px 20px; transition: background-color 0.1s linear; display: flex; }
.solutions { margin-left: 20px; color: grey; }
.more-solutions-button { width: 100%; border-top-left-radius: 0; border-top-right-radius: 0; font-weight: bold; }
.maz-btn--primary:focus::before { border: none; }

.solution:hover { background-color: rgba(0, 0, 0, 0.08); }
.name { font-weight: bold; color: $primary-color; }
.in-list-button { margin-left: 10px; opacity: 0; transition: opacity 0.1s linear; }
.solution:hover .in-list-button { opacity: 1; }
.more-persons-button { width: 100%; border-top-left-radius: 0; border-top-right-radius: 0; font-weight: bold; }
.maz-btn--primary:focus::before { border: none; }
</style>
