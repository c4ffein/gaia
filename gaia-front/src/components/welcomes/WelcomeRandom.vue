<template lang="pug">
.welcome-container.h-full.relative
  .relative
    .flex.f-ai-center.f-jc-center
      a.btn.primary.ml-5(style="visibility: hidden;") Connexion
      PartnersLogos.f-auto.mt-5.mb-5(:height="70")
      router-link.btn.primary.mr-5(:to="{ name: 'login' }" style="height: 52px;") Connexion

    //- Top left
    .absolute(style="left: 10px; top: 20px;")
      .relative
        //-Dots.absolute(color="#1155AA" style="left: 80px; top: 60px; z-index:-3;" :arr="[24, 21, 18, 15, 4,4,4,4,4,4,4,4,4, 4, 3, 2, 2,1, 1]")
        Dots.absolute.tl1(color="#1155AA" style="left: 80px; top: 60px; z-index:-3;" :arr="[4,4,4,4, 4,4,4,4,4,4,4,4,4, 4, 3, 2, 2,1, 1]")
        Dots.absolute.tl2(color="#1155AA" style="left: 144px; top: 60px; z-index:-3;" :arr="[20, 17, 14, 11]")
        Dots.absolute.tl2b(color="#1155AA" style="left: 144px; top: 60px; z-index:-3;" :arr="[10, 8, 5, 3]")

    //- Top right
    .absolute(style="right: 90px; top: 160px;")
      .relative
        TriangleI.absolute.tr1(:imageBg="imageBg" reversedX style="z-index:-4; right: 0;")
        TriangleC.absolute.tr2(:width=100 :height=100 color="#1155AA" reversedX style="z-index:-3; transform: rotate(45deg);" :ang="225")
        Dots.absolute.tr3(:width=200 :height=200 color="#1155AA" reversed rT rL style="z-index:-3;" :ang="45")

    .relative.gaia-title-container
      .flex.gap-7.f-ai-center
        GaiaLogo(style="height: 180px; max-width: 50%;")
        .t-30.t-primary.t-bold(style="max-width: 700px") {{a.accompagne}}

  //- Bottom left
  .absolute(style="left: 90px; bottom: -56px;")
    .relative
      TriangleI.absolute.bl1(:imageBg="imageBg" reversedX reversedY style=" z-index:-4; bottom: 0; left: 0;")
      TriangleC.absolute.bl2(:width=130 :height=130 color="#1155AA" reversedX reversedY style="z-index:-3;" :ang="45")
      Dots.absolute.bl3(:width=200 :height=200 color="#1155AA" style="z-index:-3;" rL :arr="[1,1,1,2,2,2,3,3,4,4,4,4,3,2,1]")

  //- Bottom right
  .absolute.brm(style="right: 96px; bottom: -6px;")
    .relative
      Dots.absolute.br1(color="#1155AA" style="right: 0px; bottom: 0px; z-index:-3;" rL :arr="[15,18,21,24]")
      Dots.absolute.br1s(color="#1155AA" style="right: 0px; bottom: 0px; z-index:-3;" rL :arr="[7,12,13,16]")

  .subtexts
    .t-center.t-primary.subtext1 {{a.laureat}}
    .mt-4.mb-3.bg-primary.mx-auto(style="height: 2px; width: 66px")
    .t-center.t-primary.subtext2.mx-auto(style="max-width: 800px;") {{a.experimente}}

  .flex.f-jc-center

    .flex.f-wrap.gap-8.mx-8(style="max-width: 900px")
      router-link.main-card.bg-primary(v-for="title_content, route in a.cards" :key="route" :to="{ name: route, params: {} }")
        .title {{title_content[0]}}
        .content {{title_content[1]}}
</template>

<script>
import PartnersLogos from '../welcome-components/PartnersLogos.vue'
import GaiaLogo from '../reusables/GaiaLogo.vue'
import CPDuo from '../welcome-components/CPDuo.vue'
import NeedAdvice from '../welcome-components/NeedAdvice.vue'
import TriangleI from '../welcome-components/TriangleI.vue'
import TriangleC from '../welcome-components/TriangleC.vue'
import Dots from '../welcome-components/Dots.vue'
import { welcomeAssets } from '@/assets/amnyos-assets';

export default {
  name: 'Welcome',
  components: { CPDuo, NeedAdvice, GaiaLogo, PartnersLogos, TriangleI, TriangleC, Dots },
  data () { return { imageBg: require('@/assets/unsplash/fields/ales-me-m.jpg'), a: welcomeAssets } },
}
</script>

<style scoped lang="scss">
.page.welcome { padding-bottom: 36px; }
.gaia-title-container { width: calc(76% - 40px); margin: max(calc(18vh - 140px), -10px) calc(20px + 12%) max(calc(18vh - 120px), 10px) max(calc(25% - 100px), 20px); box-sizing: border-box; }
.gaia-title { margin-bottom: 20px; font-size: 40px; }
.gaia-subtitle { margin-bottom: 20px; font-size: 20px; color: #ffffff; }
//.title { margin-top: 40px; margin-bottom: 20px; font-size: 24px; }
.subtexts { margin-bottom: max(calc(18vh - 120px), 40px); font-size: 26px; }
.subtext1 { font-size: 26px; }
.subtext2 { font-size: 24px; }

.main-card { padding: 30px; flex: 1 1 0px; color: white; text-decoration: none; border-radius: 15px; }
.main-card { transition: all .5s ease-in-out; }
.main-card:hover { box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.4); background-color: white; color: $primary-color; }
// .main-card .title { font-size: 20px; margin-bottom: 20px; text-align: center; height: 50%; font-weight: bold; }
.main-card .title { font-size: 20px; margin-bottom: 20px; text-align: center; font-weight: bold; }
.main-card .content { font-size: 18px; text-align: center; font-weight: bold; }

.tempbg { background-color: #1362aa; }

@media screen and (max-width: 1100px) { .tl1 { display: none } }
@media screen and (max-width: 1599px) { .tl2 { display: none } }
@media screen and (max-width: 1270px) { .tl2b { display: none } }

.tr1 { height: min(calc(35vw - 200px), 70vh); width: min(calc(35vw - 200px), 70vh); }
.tr2 { top: calc(min(calc(35vw - 200px), 70vh) / 2 - 40px); right: calc(min(calc(35vw - 200px), 70vh) / 2 - 40px); }
.tr3 { top: calc(min(calc(35vw - 200px), 70vh) / 2 + 50px); right: calc(min(calc(35vw - 200px), 70vh) / 2 - 170px); }
@media screen and (max-width: 1299px) { .tr1 { display: none } }
@media screen and (max-width: 1581px) { .tr2 { display: none } }
@media screen and (max-width: 1859px) { .tr3 { display: none } }

.bl1 { height: calc(min(calc(35vw - 200px), 58vh) - 140px); width: calc(min(calc(35vw - 200px), 58vh) - 140px); }
.bl2 { bottom: calc((min(calc(35vw - 200px), 58vh) - 140px) / 2 - 40px); left: calc((min(calc(35vw - 200px), 58vh) - 140px) / 2 - 40px); }
.bl3 { bottom: calc((min(calc(35vw - 200px), 58vh) + 24px) / 2 - 40px); left: calc((min(calc(35vw - 200px), 58vh) - 140px) / 2 + 52px); }
@media screen and (max-width: 1299px) { .bl1 { display: none } }
@media screen and (max-width: 1579px) { .bl2 { display: none } }
@media screen and (max-width: 1579px) { .bl3 { display: none } }

@media screen and (max-width: 1581px) { .br1 { display: none } }
@media screen and (max-width: 1300px) { .br1s { display: none } }
@media screen and (min-width: 1580px) { .br1s { display: none } }
</style>
