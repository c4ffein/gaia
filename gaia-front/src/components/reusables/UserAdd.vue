<template lang="pug">
div
  .modal-header {{ title }}
  div(v-if="!registered")
    MazInput(v-model="lastnameValue" placeholder="Nom")
    br
    MazInput(v-model="firstnameValue" placeholder="Prénom")
    br
    MazInput(v-model="emailValue" placeholder="E-mail")
    br
    MazInput(v-model="phoneValue" placeholder="Numéro de téléphone")
    br
    MazInput(v-model="postalCodeValue" placeholder="Code Postal")
    br
    DateInput.w-full.mb-0(msg="Date de naissance" v-model="birthdateValue")
  .mt-3.mb-5(v-if="registered")
    | L'utilisateur!{' '}
    router-link(:to="{ name: 'profile', params: {id: userIdValue}}") {{this.usernameValue}}
    |  a été ajouté.
    div Son mot de passe temporaire est
      span.t-primary  {{this.tempPasswordValue}}

  .error-square.mb-3(v-if="errorValue") {{ this.errorValue }}
  MazBtn.w-full.mt-3(v-if="!registered" @click="addUser") Ajouter l'utilisateur
  MazBtn.w-full.mt-3(@click="$emit('close')") Fermer
</template>

<script>
import DateInput from './DateInput'


export default {
  name: 'UserAdd',

  props: { partnerAsMember: String, partnerAsBeneficiary: String, addAsAdmin: Boolean },
  components: { DateInput },
  data() {
    return {
      firstnameValue: '',
      lastnameValue: '',
      birthdateValue: '',
      emailValue: '',
      phoneValue: '',
      postalCodeValue: '',
      userIdValue: '',
      tempPasswordValue: '',
      frozen: false, // TODO?
      registered: false,
      errorDS: { msg: '', errors: {} },
    };
  },
  methods: {
    addUser() {
      this.frozen = false;

      this.$api.postUser({
        firstname: this.firstnameValue,
        lastname: this.lastnameValue,
        birthdate: this.birthdateValue.split(' ')[0], // TODO Dirty
        email: this.emailValue || null,
        phone: this.phoneValue || null,
        postal_code: this.postalCodeValue,
        partner_as_member: this.$api.Id(this.partnerAsMember),
        is_admin: this.addAsAdmin,
      }).then(user => {
        this.registered = true;
        // this.usernameValue = user['username'];
        this.userIdValue = user['id'];
        this.usernameValue = user['firstname']+user['lastname']; // TODO : Bad tempfix, fix back asap
        this.tempPasswordValue = user['temp_password'];
        this.errorDS = { msg: '' };
        this.$emit('userAdded', user);
      }).catch(e => {
        this.$api.errorHandler.register(e, this.errorDS);
        this.registered = false;
      });
    },
  },
  computed: {
    title() {
      if (this.registered) return 'Utilisateur ajouté';
      if (this.partnerAsMember) return 'Invitation de partenaire';
      if (this.partnerAsBeneficiary) return 'Invitation de bénéficiaire';
      return 'Invitation d\'utilisateur';
    },
    listName() { return this.partnerAsBeneficiary ? 'liste des bénéficiaires' : 'liste d\'utilisateurs'; },
    errorValue() { return this.errorDS?.msg || ""; },
  },
}
</script>
