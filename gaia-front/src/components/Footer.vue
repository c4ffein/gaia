<template lang="pug">
  .width-container.footer
    .footer-item Gaïa Inclusion
    .footer-item Mentions légales
    .footer-item Politique de confidentialité
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
    }
  },
}
</script>

<style scoped lang="scss">
.footer {
  // border-top: 1px solid grey;
  padding-top: 20px;
  padding-bottom: 20px;
  color: $primary-color;
  flex-wrap: wrap;
  display: flex;
}
.footer::before {
  content: " ";
  background-color: #eeeeee;
  position: relative;
  top: -20px;
  display: block;
  height: 1px;
  width: 100%;
}
.footer-item {
  // display: inline-block;
  flex-grow: 1;
  text-align: center;
}
</style>
