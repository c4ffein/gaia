<template lang="pug">
.flex.date-input(style="position: relative")
  .maz-mb-3.login-field.flex.f-col.f-jc-center(style="width: 25%; margin-right: 10px;")
    div(:style="`color: #A7A7A7; margin-left: 45px; ${ltstyle}`") {{msg}}
  MazSelect.maz-mb-3.login-field(
    :options="days" v-model="day" placeholder="Jour"
    @input="inputEmit()" @focus="resetError()"
    style="width: 25%; margin-left: 10px; margin-right: 10px;"
  )
  MazSelect.maz-mb-3.login-field(
    :options="months" v-model="month" placeholder="Mois"
    @input="inputEmit()" @focus="resetError()"
    style="width: 25%; margin-left: 10px; margin-right: 10px;"
  )
  MazSelect.maz-mb-3.login-field(
    :options="years" v-model="year" placeholder="Année"
    @input="inputEmit()" @focus="resetError()"
    style="width: 25%; margin-left: 10px;"
  )
</template>

<script>
import { MazInput, MazSelect } from 'maz-ui'

export default {
  name: 'DateInput',

  components: { MazInput, MazSelect },
  props: { msg: { type: String, default: 'Date' }, value: String, ltstyle: String },
  data: () => ({ day: undefined, month: undefined, year: undefined }),
  computed: {
    // Warning : custom validator check failed for prop "value" : fail seems ok. Maybe should use String but didnt fix
    days: () => [...Array(31).keys()].map((_, i) => ({label: i + 1, value: i + 1})),
    months: () => ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août',
      'Septembre', 'Octobre', 'Novembre', 'Décembre'].map(
      (value, i) => ({label: value, value: i + 1})
    ),
    years: () => [ ...Array(110).keys()].map( i => i+1910).map(value => ({ label: value, value })).slice().reverse(),
    computedDate() { return (this.year && this.month && this.day) ? `${this.year}-${this.month}-${this.day}` : ''; },
  },
  methods: {
    resetError() { return null }, // TODO emit?
    inputEmit() { this.resetError(); this.$emit('input', this.computedDate); },
    setYMD(ymd) { this.$set(this, 'year', ymd[0]); this.$set(this, 'month', ymd[1]); this.$set(this, 'day', ymd[2]); },
  },
  beforeMount() { if (this.value) this.setYMD(this.value.split('-').map(s => Number(s))); },
}
</script>

<style>
.date-input .maz-select__options-list{ min-width: 100%; }
</style>
