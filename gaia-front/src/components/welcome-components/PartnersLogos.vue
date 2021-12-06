<template lang="pug">
.flex.f-col
  .flex.f-wrap.f-jc-center.show-big
    .flex.f-col.j-center.mr-5
      .flex.f-wrap
        img.mx-5.mb-2(:style="limitHeight" src="@/assets/partners-logos/PIC-LOGO_squared.jpg")
        img.mx-5.mb-2(:style="limitHeight" src="@/assets/partners-logos/LOGO MINISTERE DU TRAVAIL – HAUT COMMISSAIRE AUX COMPETENCES ET A L’INCLUSION PAR L’EMPLOI.png")
        img.mx-5.mb-2(:style="limitHeight" src="@/assets/partners-logos/caisse_des_depots.jpeg")
      .t-center.t-12.t-grey.mt-2 Projet cofinancé par le Plan d'investissement dans les compétences
    .flex.f-col.j-center.ml-5
      .flex.f-jc-center
        img.mx-5.mb-2(:style="limitHeight" src="@/assets/partners-logos/Logo_Nouvelle-Aquitaine_2019.svg")
      .t-center.t-12.t-grey.mt-2 Projet financé par la Région Nouvelle-Aquitaine
  .flex.f-wrap.f-jc-center.show-medium
    .t-center.t-12.t-grey.mt-2 Projet cofinancé par le
      span.t-primary.t-bold  Plan d'investissement dans les compétences
    .t-center.t-12.t-grey.mt-2 Projet financé par la
      span.t-primary.t-bold  Région Nouvelle-Aquitaine


</template>

<script>
export default {
  name: 'PartnersLogos',
  props: { 'height': Number, },
  computed: { limitHeight() {
    return `min-height: ${this.height}px; max-height: ${this.height}px;`;
  }},
}
</script>

<style scoped lang="scss">
.t-grey { color: rgba(0, 0, 0, 0.7); }
.test { width: 100px; height: 20px; background-color: red;}
@media (max-width: 1123px) { .show-big {display: none;} }
.show-medium { display: block; }
@media (min-width: 1124px) { .show-medium {display: none;} }
</style>
