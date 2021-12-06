<template lang="pug">
div
  .modal-header(:style="`text-align: {align}; margin-bottom: 0; white-space: pre-wrap;`") {{ msg }}
  button.btn.primary.w-full.mt-5.small(@click="$emit('finaliseClicked')") Finaliser
  button.btn.primary.w-full.mt-4.small.outline(@click="$emit('cancelClicked')") Annuler
</template>

<script>
export default {
  name: 'Confirm',

  props: { title: String, msg: String },
  data() {
    return {
    };
  },
  methods: {
    confirm() { this.$emit('userAdded'); },
  },
  computed: {
    listName() {
      return this.partnerAsBeneficiary ? 'liste des bénéficiaires' : 'liste d\'utilisateurs';
    },
  },
}
</script>
