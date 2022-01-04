<template lang="pug">
  .cp-duo(:class="(reversed ? 'reversed' : 'false') + (margined ? '' : ' no-margin')")
    .img-container
      img.i-cover.absolute(v-if="!reversed" src="@/assets/unsplash/workers/johan-mouchet.jpg" alt="man working" style="object-position: 50% 13%;")
      img.i-cover.absolute(v-if="reversed" src="@/assets/unsplash/workers/handshake.jpg" alt="handshake" style="object-position: 50% 75%;")
    div
      .pre-wrap
        .t-25.t-primary.t-bold.mb-5(title) {{title}}
        div(v-html="inside")
        router-link.block.btn.primary.outline.mt-5(style="width:250px;"
          :to="{ name: targetName, params: targetParams }"
        ) Prendre rendez-vous


</template>

<script>
import { MazBtn } from 'maz-ui'
import { sMarked } from '@/libs/inputs'

export default {
  name: 'CPDuo',
  components: { MazBtn },
  props: {
    reversed: Boolean,
    texts: { type: String, default: ""},
    title: { type: String, default: ""},
    futureRDVCategoryId: String,
    futureRDVPartnerId: String,
    margined: { type: Boolean, default: true }
  },
  computed: {
    targetName() { return this.$api.iAmLogged() ? 'rdv' : 'login' },
    targetParams() { return {
      futureRDVPartnerId: this.futureRDVPartnerId, futureRDVCategoryId: this.futureRDVCategoryId
    }; },
    inside() { return sMarked(this.texts) },
  },
}
</script>

<style scoped lang="scss">
.cp-duo>.img-container{
  grid-area: a;
  align-self: center;
  width: 100%;
  position: relative;
  display: inline-block;
  padding-top: 50%;
}

.cp-duo>.img-container>img{
  width: 100%; /* Will shrink image to 30% of its original width */
  height: 100%;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

@media only screen and (min-width: 1200px) {
  .cp-duo { margin-bottom: 75px; }
}

@media only screen and (min-width: 1200px) {
  .cp-duo { display: grid; grid-template-areas: "a b c"; grid-template-columns: 50% 45% 5%; }
  .cp-duo.reversed { display: grid; grid-template-areas: "c b a"; grid-template-columns: 5% 45% 50%; }
}
@media only screen and (min-width: 1200px) {
  .no-margin.cp-duo { display: grid; grid-template-areas: "a b c"; grid-template-columns: 50% 50% 0%; }
  .no-margin.cp-duo.reversed { display: grid; grid-template-areas: "c b a"; grid-template-columns: 0% 50% 50%; }
}

.cp-duo>.img-container{ box-sizing: border-box; }
@media only screen and (max-width: 576px) {
  .cp-duo>.img-container{ width: 100%; }
}
@media only screen and (min-width: 576px) and (max-width: 1199px) {
  .cp-duo>.img-container{ width: 100%; padding-left: 20px; padding-right: 20px; margin: auto; }
}
@media only screen and (min-width: 768px) and (max-width: 1199px) {
  .cp-duo>.img-container{ min-width: 307px; padding-left: 130px; padding-right: 130px; }
}

@media only screen and (min-width: 1200px) {
  .cp-duo>.img-container{
    grid-area: a;
    align-self: center;
    width: 100%;
    position: relative;
    display: inline-block;
    padding-top: 50%;
  }
  .cp-duo:not(.reversed)>.img-container{ left: 20%; }
  .cp-duo.reversed>.img-container{ right: 20%; }
}

@media only screen and (min-width: 576px) {
  .cp-duo>div { margin-left: 40px; margin-right: 40px; }
}
@media only screen and (min-width: 768px) {
  .cp-duo>div { margin-left: 150px; margin-right: 150px; }
}

@media only screen and (min-width: 1200px) {
  .cp-duo>div { margin-left: 0; margin-right: 0; display: table; grid-area: b; align-self: center; }
}

.cp-duo>div>div {
  padding: 37px calc(32px + 6%); background-color:white; color: black; }
@media only screen and (min-width: 576px) {
  .cp-duo>div>div{ box-shadow:0 0 20px 0 rgba(0,0,0,.1); }
}
@media only screen and (max-width: 1200px) {
  .cp-duo>div>div{ position: relative; top: -100px; }
}
@media only screen and (min-width: 576px) and (max-width: 1200px) {
  .cp-duo>div>div{ position: relative; top: -100px; }
}

@media only screen and (min-width: 1200px) {
  .cp-duo>div>div{ display: table-cell; vertical-align: middle; z-index: 1; position: relative; right: 5%; }
  .cp-duo.reversed>div>div{ right: 0; left: 5%; }
}

.cp-duo>div>div>.title{ color: $primary-color; padding-bottom: 32px; font-weight: bold; }
</style>
