<template lang="pug">
.flex.date-input(style="position: relative")
  .maz-mb-3.login-field.flex.f-col.f-jc-center(style="margin-right: 10px;")
    div(:style="`color: #A7A7A7; margin-left: 45px; ${ltstyle}`") {{msg}}
  MazSelect.maz-mb-3.login-field(
    :options="years" v-model="year" placeholder="Année"
    @input="inputEmit()" @focus="resetError()"
    style="width: 25%; margin-left: 10px;"
  )
</template>

<script>
import { MazInput, MazSelect } from 'maz-ui'

export default {
  name: 'YearInput',

  components: { MazInput, MazSelect },
  props: { msg: { type: String, default: 'Year' }, value: String, ltstyle: String },
  data: () => ({ year: undefined }),
  computed: {
    years: () => [
      ...Array(110).keys()].map(
        i => i+1910).map(value => ({ label: value, value })).slice().reverse(),
  },
  methods: {
    resetError() { return null }, // TODO emit?
    inputEmit() { this.resetError(); this.$emit('input', String(this.year) || ''); },
  },
  beforeMount() { if (this.value) this.$set(this, 'year', Number(this.value)); },
}
</script>

<style>
.date-input .maz-select__options-list{ min-width: 100%; }
</style>
