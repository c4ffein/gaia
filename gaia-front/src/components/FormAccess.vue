<template lang="pug">
.width-container
  .card
    MazInput(v-model="searchValue" left-icon-name="search" placeholder="Chercher un document")
  .card
    .form-line(v-for="form in forms" v-bind:key="form.id")
      router-link(:to="{ name: 'form', params: {id: form.id} }")
        | {{form.name}}
        span.date {{form.date}}

  MazBtn.shadow.add-document-button(
    v-if="iAmPartner || iAmGreat" v-on:click="showItemAddModal = true"
  )
    | Créer un modèle de formulaire
  MazBtn.shadow.add-document-button(
    v-if="iAmPartner || iAmGreat" v-on:click="showItemAddModal = true"
  )
    | Envoyer un formulaire à un bénéficiaire
  MazBtn.shadow.add-document-button(
    v-if="!iAmPartner" v-on:click="showItemAddModal = true"
  )
    | Remplir un nouveau formulaire

</template>

<script>
import { MazInput, MazBtn } from 'maz-ui'
import ItemAdd from './reusables/Modal'

export default {
  name: 'FormAccess',
  props: { msg: String, id: String },
  components: { MazInput, MazBtn, ItemAdd },
  data() {
    return {
      searchValue: '',
      forms: [
        {id: 1, name: 'Exemple 1', date: '1/1/1984'},
        {id: 2, name: 'Exemple 2', date: '7/7/2011'},
      ]
    };
  },
  methods: {
    inSearch(namesString) {
      if (this.$data.searchBox === '') {
        return true;
      }
      const names = namesString.split();
      const searchStrings = this.$data.searchBox.split(' ');
      for (let i = 0; i < searchStrings.length; i += 1) {
        const searchString = searchStrings[i].toLowerCase();
        for (let j = 0; j < names.length; j += 1) {
          if (names[j].toLowerCase().includes(searchString)) {
            return true;
          }
        }
      }
      return false;
    },
    filteredSearchList(people) {
      const result = {};
      const layersEntries = Object.entries(people);
      for (let i = 0; i < layersEntries.length; i += 1) {
        const layerContent = layersEntries[i][1];
        if (this.inSearch(layerContent)) {
          const layerName = layersEntries[i][0];
          result[layerName] = layerContent;
        }
      }
      return result;
    },
    openModal(person) {
      alert(`WiP infos  ${person.firstname} ${person.lastname}`);
    },
  },
  computed: {
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    iAmGreat() { return this.$api.iAmGreat(); },
  },
}
</script>

<style lang="scss">
.form-line {
  padding: 10px 20px 10px 20px;
}
.form-line>a {
  text-decoration: none;
  color: $primary-color;
}
.date, .city {
  margin-left: 20px;
  color: grey;
}
.more-persons-button {
  width: 100%;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  font-weight: bold;
}
.add-document-button {
  margin: 10px;
}
.maz-btn--primary:focus::before {
  border: none;
}
</style>
