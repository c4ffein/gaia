<template lang="pug">
div
  .modal-header {{ title }}
  .hello
    .card
      MazInput(v-model="searchValue" left-icon-name="search" placeholder="Chercher un nom")
    .card
      .person.py-3.px-5(v-for="person in showedUsers" v-bind:key="person.id"
        v-on:click="updateSelectedUser(person.id)" :class="selectedUser===person.id ? 'selected' :''"
      )
        span.name {{person.firstname}} {{person.lastname}}
        span.birthdate.ml-3 {{prettyDate(person.birthdate)}}
        span.email.ml-5(v-if="person.email") {{person.email}}
        span.phone.ml-5(v-if="person.phone && person.phone !== '0'") {{person.phone}}
    div(v-if="selectedUser && actionEnabled")
      .modal-header(style="margin-bottom: 0") {{willMessage}}
      button.btn.primary.w-full.mt-3(@click="willButtonClicked(selectedUser)")
        | {{willButtonMessage}}

  .error-square(v-if="errorValue") {{ this.errorValue }}
  div(v-if="createEnabled")
    hr.mt-4.mb-4
    .modal-header(style="margin-bottom: 0; margin-top: 13px;") Si je ne trouve pas l'utilisateur
    button.btn.primary.w-full.mt-4(@click="$emit('addUserClicked')") Créer un utilisateur
    hr.mt-4.mb-4
    button.btn.primary.outline.w-full(@click="$emit('close')") Annuler
</template>

<script>
import { MazInput } from 'maz-ui'
import { prettyDate } from '@/libs/drftimestamp'
import * as h from '@/libs/object-helpers/object-helpers'


export default {
  name: 'UserFind',
  props: {
    partnerAsMember: String, partnerAsBeneficiary: String, partnerName: String, initialSelectedUser: String,
    createEnabled: { type: Boolean, default: true }, actionEnabled: { type: Boolean, default: true }, },
  components: { MazInput },
  data() {
    return {
      dselectedUser: '',
      searchValue: '',
      errorValue: '',
      tempPasswordValue: '',
      frozen: false, // TODO?
      registered: false,
    };
  },
  methods: {
    linkUser() {
      this.frozen = false;
      this.$api.linkUser( this.selectedUser, ).then(() => { this.errorValue = ''; }).catch(e => {
        if (e.code == 400){
          if (e.msgPromise) e.msgPromise.then(msg => { this.handleError(msg) });
          else this.handleError(e.msg);
        }
        else {
          this.errorValue = 'Impossible de sélectionner l\'utilisateur pour une raison inconnue. \n'
            + 'Si les informations fournies sont correctes et que le problème persiste, '
            + 'merci de contacter le support technique.';
        }
        this.registered = false;
      });
    },
    handleError(msg) {
      const tra = { // TODO : Put somewhere else
        'username': 'Nom d\'utilisateur',
        'This field is required.': 'Requis',
        'email': 'Email',
        'Enter a valid email address.': 'Adresse invalide.',
        'user with this email address already exists.': 'Un utilisateur possède déjà cette adresse email',
      }
      const tr = s => tra[s];
      let e = 'Impossible d\'ajouter l\'utilisateur pour les raisons suivantes :\n'
      for (const [key, value] of Object.entries(msg)) {
        e += `${tr(key)}:\n`;
        for (const val in value) console.log(val), e += `  - ${tr(value[val])}\n`;
      }
      this.errorValue = e;
    },
    loadList() { return this.$api.listUsers(); },
    willButtonClicked(userId) { this.$emit('nextClicked', this.getLocalUser(userId)); },
    getLocalUser(userId) { return this.users.filter(user => user.id === userId)[0] },
    updateSelectedUser(userId) { this.dselectedUser=userId; this.$emit('selectedUser', userId); },
    prettyDate(date) { return prettyDate(date); },
  },
  computed: {
    users() { return h.oV(this.$api.data.users || {}); },
    title() {
      if (this.addAsBeneficiary) return 'Recherche d\'utilisateur à ajouter aux bénéficiaires';
      if (this.addAsPartner) return 'Recherche d\'utilisateur à ajouter en tant que partenaire';
      return 'Recherche d\'utilisateur';
    },
    showedUsers() { return this.$api.usersInSearch(this.users, this.searchValue).slice(0, 5); },
    willMessage() {
      if (!this.selectedUser) return '';
      const user = this.users.filter(user => user.id === this.selectedUser)[0];
      const partner = this.partnerName;
      if (this.partnerAsMember) return `L'utilisateur ${user.firstname} ${user.lastname} sera partenaire ${partner}.`
      if (this.partnerAsBeneficiary)
        return `L'utilisateur ${user.firstname} ${user.lastname} sera bénéficiaire ${partner}.`
      return `L'utilisateur ${user.firstname} ${user.lastname} a été séléctionné.`
    },
    willButtonMessage() {
      if (!this.selectedUser) return '';
      if (this.partnerAsMember) return 'Rendre l\'utilisateur partenaire';
      if (this.partnerAsBeneficiary) return 'Rendre l\'utilisateur bénéficiaire';
      return 'Continuer';
    },
    selectedUser() { return (this.dselectedUser && this.dselectedUser !== ' ') ?
      this.dselectedUser : Number(this.initialSelectedUser);
    },
  },
  beforeMount() { this.loadList().then(() => {
    const selectedUserObj = this.users.filter?.(u => u.id === this.selectedUser)[0];
    if (this.initialSelectedUser) this.searchValue = `${selectedUserObj.firstname} ${selectedUserObj.lastname}`;
  } ); },
}
</script>
