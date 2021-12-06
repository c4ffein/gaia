<template lang="pug">
.solution-cards
  .card.solution-card(
    v-for="solution in solutionCategories" v-bind:key="solution.id"
    :class="`${selectedClass(solution.id)}${smallClass}`"
    v-on:click="$emit('selectedSolutionCategory',solution.id)"
  )
    i.material-icons {{solution.icon}}
    .solution-card-name {{solution.name}}
</template>

<script>
export default {
  name: 'NeedAdvice',
  props: {
    solutionCategories: Array,
    selectedSolutionCategory: Number,
    small: { type: Boolean, default: false },
  },
  methods: {
    selectedClass(solutionID) {
      return solutionID === this.selectedSolutionCategory ? ' selected' : ''
    },
  },
  computed: {
    smallClass() { return this.small ? ' small' : '' },
  }
}
</script>

<style scoped lang="scss">
.solution-cards {
  display: flex;
  justify-content: center;
  margin: 30px;
  margin-top: 20px;
  flex-wrap: wrap;
}
.solution-card {
  height: 150px;
  width: 200px;
  margin: 20px;
  color: $primary-color;
  text-align: center;
  font-weight: bold;
}
.solution-card.small {
  height: 130px;
  width: 170px;
  margin: 15px;
  font-size: 16px;
}
.solution-card.selected {
  background-color: $primary-color;
  color: white;
}
.solution-card:hover {
  background-color: darken(white, 10%);
}
.solution-card.selected:hover {
  background-color: $primary-color;
}
.solution-card>i {
  font-size: 50px;
  margin-top: 25px;
}
.solution-card.small>i {
  font-size: 30px;
  margin-top: 15px;
}
</style>
