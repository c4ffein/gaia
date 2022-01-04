<template lang="pug">
div
  .ppt-bg(style="width: 100%; position: relative; top: -30px; margin-top: 0;")
    .bg(:style="'background-image: url('+imagebg+');'")
    .content.px-5.py-5
      .t-white.t-bold.t-center.mx-8.mb-6(style="font-size: 36px; margin-top: 20px;")
        .nonshlagged {{a.p0.title}}
        .shlagged(style="font-size: 28px;") {{a.p0.titleS}}
      .flex.mb-4.f-screen-col-800(style="gap: calc(40px + 5%);")
        div(style="flex: 1 1 0px;")
          .t-bold.t-18.t-center.mb-5 {{a.p0.title1}}
          ul.mt-3
            li(v-for="s in a.p0.c1") {{s}}
        div(style="flex: 1 1 0px;")
          .whittex
            .t-bold.t-18.t-center.mb-5 {{a.p0.title2}}
            ul
              li.
                #[a(target="_blank" href="https://www.adie.org/") ADIE],
                #[a(target="_blank" href="https://www.amrf.fr/") AMRF],
                #[a(target="_blank" href="https://www.cress-na.org") CRESS],
                #[a(target="_blank" href="https://www.inae-nouvelleaquitaine.org/") INAE],
                #[a(target="_blank" href="http://www.patrickloquet.fr/") Patrick Loquet Consultant],
                #[a(target="_blank" href="https://www.wimoov.org/") Wimoov],
                #[a(target="_blank" href="https://www.achatsresponsables-aquitaine.fr/") 3AR]
              li Chef de file&nbsp;: #[a(target="_blank" href="https://www.soliha.fr") SOLIHA] (bailleur social)
              li Conception et mise en œuvre&nbsp;: cabinet #[a(target="_blank" href="https://www.amnyos.com/") Amnyos]
              li.
                Pilotage régional&nbsp;: #[a(target="_blank" href="https://dreets.gouv.fr/") DREETS]
                et #[a(target="_blank" href="https://www.caissedesdepots.fr/") Caisse des Dépôts]
              li.
                Partenaires&nbsp;:
                #[a(target="_blank" href="https://prosapiens.fr/") Prosapiens] et
                #[a(target="_blank" href="https://www.campusdeformation.fr/") Campus de formation professionnelle compagnonnique]

  .pres-content
    .ppt-0
      .t-curr-title-1.mb-5.t-center
        | L'offre de service GAÏA, c'est accompagner les publics vers l'emploi via&nbsp;:
      .flex.f-jc-center.gap-5.f-screen-col-900
        .card.ppt-card.ppt-1(style="width: calc(200px + 15%);" @click="scrollToSection(1)")
          .bg(:style="'background-image: url('+image1+');'")
          .content.px-6.py-6
            .t-20.t-bold.mb-4 L'accompagnement à la Formation en Situation de Travail
            .t-18 Renforcer les dispositifs d'immersion ou d'insertion existants par des FEST (formation en situation de travail) ou des AFEST (action de formation en situation de travail) pour accroître l'employabilité des publics.

        .card.ppt-card.ppt-2(style="width: calc(200px + 15%);" @click="scrollToSection(2)")
          .bg(:style="'background-image: url('+image2+');'")
          .content.px-6.py-6
            .t-20.t-bold.mb-4 Le développement de la clause sociale dans les marchés publics
            .t-18 Impulser des pratiques innovantes sur les territoires enfaveur des publics éloignés de l'emploi.

        .card.ppt-card.ppt-3(style="width: calc(200px + 15%);" @click="scrollToSection(3)")
          .bg(:style="'background-image: url('+image3+');'")
          .content.px-6.py-6
            .t-20.t-bold.mb-4 L'accompagnement à la création d'entreprise
            .t-18 Innover dans des parcours d'accompagnement à la création d'entreprise (consolidation de fonds
              |  propres) auprès d'EITI (entreprises d’insertion par le travail indépendant).

      .flex.f-jc-center
        router-link.btn.white.outline.block.mt-5.mx-auto(style="width: calc(200px + 20%)" :to="{ name: 'home', params: {} }") Accéder à Gaïa


    //--------------------------------------------------------------------------
    .ppt-1#gaia-about-section-1
      .ppt-head
        .bg(:style="'background-image: url('+image1+');'")
        .content
          .title {{a.p1.title}}
          .subtitle {{a.p1.subtitle}}
          .flexer
            .flexed(v-for="s in a.p1.subsubtitles") {{s}}
      div(style="display: grid; grid-gap: 0px 60px; grid-auto-columns: 1fr;")
        .t1
          .ppt-stand(style="min-height: 50px;")
            .bg(:style="'background-image: url('+image2+');'")
            .content.flex.f-ai-center(style="height: 100%;")
              .t-bold.pre-wrap {{a.p1.c[0][0]}}
        .b1
          .pl-4.pr-4(v-for="i in a.p1.c[0][1]" style="flex: 0 0 50%; box-sizing: border-box;")
            .t-curr.t-bold {{i[0]}}
            ul
              li.mb-3(v-for="i in i[1]") {{i}}
        .t2
          .ppt-stand
            .bg(:style="'background-image: url('+image3+');'")
            .content.flex.f-ai-center(style="height: 100%;")
              .t-bold {{a.p1.c[1][0]}}
        //- div(style="margin-left: 0-10-20-30%; max-width: 70%;")
        .b2
          div(v-for="i in a.p1.c[1][1]")
            .t-curr.t-bold {{i[0]}}
            ul.mt-2
              li(v-for="i in i[1]") {{i}}

    //--------------------------------------------------------------------------
    .ppt-2#gaia-about-section-2
      .ppt-head
        .bg(:style="'background-image: url('+image2+');'")
        .content
          .title {{a.p2.title}}
          .subtitle {{a.p2.subtitle}}
          .flexer
            .flexed(v-for="s in a.p2.subsubtitles") {{s}}
      .ppt-stand
        .bg(:style="'background-image: url('+image1+');'")
        .content
          .t-bold {{a.p2.sh[0]}}
          div {{a.p2.sh[1]}}
      .flex.f-screen-col-900.f-wrap.gap-8(style="max-width: 100%;")
        div(style="flex: 1 1 0px;" v-for="c in a.p2.c")
          .t-curr.t-bold {{c[0]}}
          ul
            li(v-for="i in c[1]") {{ i }}
    //--------------------------------------------------------------------------
    .ppt-3#gaia-about-section-3
      .ppt-head
        .bg(:style="'background-image: url('+image3+');'")
        .content
          .title {{a.p3.title}}
          .subtitle {{a.p3.subtitle}}
          .flexer
            .flexed(v-for="s in a.p3.subsubtitles") {{s}}
      div(style="display: grid; grid-gap: 0px 60px; grid-auto-columns: 1fr;")
        .ppt-stand.t1
          .bg(:style="'background-image: url('+image2+');'")
          .content.t-bold {{a.p3.c1.t}}
        ul.b1
          li(v-for="s in a.p3.c1.c")
            .t-curr.t-bold {{s[0]}}
            ul.s(v-if="Array.isArray(s[1])")
              li(v-for="s in s[1]") {{s}}
            div(v-else) {{s[1]}}
        .ppt-stand.t2
          .bg(:style="'background-image: url('+image1+');'")
          .content.t-bold {{a.p3.c2.t}}
        ul.b2
          li(v-for="s in a.p3.c2.c")
            .t-curr.t-bold {{s[0]}}
            div {{s[1]}}
      //-----------------------------------------------------------------

  .flex.f-ai-center
    router-link.btn.white.outline.block.mt-5.mx-auto(style="width: calc(200px + 20%)" :to="{ name: 'home', params: {} }") Accéder à Gaïa
</template>

<script>
import { presentationAssets } from '@/assets/amnyos-assets.js'

export default {
  name: 'Presentation',
  data () {
    return {
      imagebg: require("@/assets/unsplash/fields/ales-me-m.jpg"),
      image1: require("@/assets/unsplash/about-s/KdeqA3aTnBY.jpg"),
      image2: require("@/assets/unsplash/about-s/handshake.jpg"),
      image3: require("@/assets/unsplash/about-s/5fNmWej4tAA.jpg"),
      a: presentationAssets,
    }
  },
  methods: { scrollToSection(n) {
      document.getElementById(`gaia-about-section-${n}`)?.scrollIntoView({behavior: "smooth", inline: "nearest"});
  } }
}
</script>

<style scoped lang="scss">
.page.welcome { padding-bottom: 36px; }
.gaia-title-container { top: 123px; z-index: 420; margin: 60px 6% 60px 18%; }
.gaia-title { margin-bottom: 20px; font-size: 34px; text-shadow: 0 0 15px #000000; }
.title { margin-top: 40px; margin-bottom: 20px; font-size: 24px; }

$ppt-color-1: #5599dd;
$ppt-color-2: #33aa88;
$ppt-color-3: #7777bb;

.whittex a { color: white; }

.t-ppt-1 { color: $ppt-color-1; }
.t-ppt-2 { color: $ppt-color-2; }
.t-ppt-3 { color: $ppt-color-3; }

.t-curr { color: $primary-color; }
.ppt-bg .t-curr { color: $primary-color; }
.ppt-1 .t-curr { color: $ppt-color-1; }
.ppt-2 .t-curr { color: $ppt-color-2; }
.ppt-3 .t-curr { color: $ppt-color-3; }

.b-curr { background-color: $primary-color; }
// .b-curr { background-color: #1362aa; }
.ppt-1 .b-curr { background-color: $ppt-color-1; }
.ppt-2 .b-curr { background-color: $ppt-color-2; }
.ppt-3 .b-curr { background-color: $ppt-color-3; }

.t-curr-title-1 {
  @extend .t-curr; font-size: 20px; font-weight: bold; text-align: center;
  margin-bottom: 30px;
}

// See done, description
ul { list-style-type:none; }
li { position: relative; margin-bottom: 14px; }
ul.s { margin-top: 5px}
ul.s > li { margin-bottom: 8px; }
li::before{
  position: absolute; left: -30px;
  content: 'fiber_smart_record'; font-family: 'Material Icons';
  margin-right: 10px; font-size: 16px; top: 1px;  // top: 50%; transform: translate(0, -50%);
}
ul.l > li::before{ left: -30px;
  font-size: 20px; top: -2px;  // top: 50%; transform: translate(0, -50%);
}
ul.s > li::before{
  left: -25px; content: 'remove'; margin-right: 10px; font-size: 18px; top: 0%; transform: translate(0, 0);
}
li::before { color: $primary-color; }
.ppt-bg li::before { color: white; }
.ppt-1 li::before { color: $ppt-color-1; }
.ppt-2 li::before { color: $ppt-color-2; }
.ppt-3 li::before { color: $ppt-color-3; }
ul.w li::before { color: white; }

.pres-content { font-size: 17px; }
.pres-content > * > * { margin-left: calc(50px + 5%); margin-right: calc(50px + 5%); width: calc(90% - 100px); }

.pres-content > * > .ppt-head { margin-left: 0; margin-right: 0; width: 100%; }
.pres-content .ppt-stand .content { margin-left: 60px; margin-right: 60px; }
.ppt-1, .ppt-2, .ppt-3 { scroll-margin: 100px; }
.ppt-bg, .ppt-head, .ppt-stand, .ppt-card {
  position: relative; overflow: hidden; /* Needed for blur */
  color: white;
  margin-top: 50px; margin-bottom: 30px;
}
.ppt-head { padding-bottom: 40px; }
.ppt-stand { padding-top: 25px; padding-bottom: 25px; box-sizing: border-box; height: calc(100% - 80px); }
.ppt-card { cursor: pointer; margin-top: 0; transition: all .25s ease-in-out; box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.4); }
// .ppt-card:hover { transform: translate(0, -4px); box-shadow: 0px 5px 20px 0px rgba(0,0,0,0.5); }
.ppt-card .bg { transition: opacity 0.25s ease-in-out; }

.ppt-card:hover .bg { opacity: 0; }
.ppt-1.ppt-card:hover { color: $ppt-color-1; }
.ppt-2.ppt-card:hover { color: $ppt-color-2; }
.ppt-3.ppt-card:hover { color: $ppt-color-3; }

.ppt-bg .bg {
  position: absolute;
  top: -5px; bottom: -5px; left: -5px; right: -5px;
  //filter: blur(2px) brightness(0%); -webkit-filter: blur(2px) brightness(70%);
  filter: blur(1px) brightness(0%); -webkit-filter: blur(1px) brightness(95%);
  background-position: center; background-repeat: no-repeat; background-size: cover;
}
.ppt-head .bg, .ppt-stand .bg, .ppt-card .bg {  // Use backdrop-filter instead when will be available in Firefox
  position: absolute;
  top: -5px; bottom: -5px; left: -5px; right: -5px;
  filter: blur(2px) brightness(0%); -webkit-filter: blur(2px) brightness(70%);
  background-position: center; background-repeat: no-repeat; background-size: cover;
}
.ppt-bg .bg::after, .ppt-head .bg::after, .ppt-stand .bg::after, .ppt-card .bg::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: 0; right: 0; opacity: 0.7;
}
.ppt-bg, { background-color: $primary-color; } .ppt-bg .bg, .ppt-bg .bg::after { background-color: $primary-color; }
.ppt-bg, { background-color: #1362aa; } .ppt-bg .bg, .ppt-bg .bg::after { background-color: #1362aa; }
.ppt-1 .ppt-head, .ppt-1 .ppt-stand { background-color: $ppt-color-1; }
.ppt-2 .ppt-head, .ppt-2 .ppt-stand { background-color: $ppt-color-2; }
.ppt-3 .ppt-head, .ppt-3 .ppt-stand { background-color: $ppt-color-3; }
.ppt-1 .bg, .ppt-1 .bg::after { background-color: $ppt-color-1; }
.ppt-2 .bg, .ppt-2 .bg::after { background-color: $ppt-color-2; }
.ppt-3 .bg, .ppt-3 .bg::after { background-color: $ppt-color-3; }
.ppt-bg .content, .ppt-head .content, .ppt-stand .content, .ppt-card .content { position: relative; z-index: 1000; }
.ppt-head .title, .ppt-stand .title {
  text-align: center; color: white; font-weight: bold; font-size: 26px;
  padding-top: 20px; padding-bottom: 20px; padding-left: 20px; padding-right: 20px;
}
.ppt-head .subtitle, .ppt-stand .subtitle {
  text-align: center; color: white; font-size: 20px;
  padding-top: 20px; padding-bottom: 20px; padding-left: 20px; padding-right: 20px;
}
.ppt-head .flexer { display: flex; margin-left: 30px; margin-right: 30px; margin-top: 20px; gap: 20px; }
@media (max-width: 650px) { .ppt-head .flexer { flex-direction: column; } }
.ppt-head .flexed {
  padding: 20px;
  font-size: 18px;
  text-align: center; border: 1px solid white; flex: 1 1 0px;
}

// Grid stuff
.t1 { grid-area: 1 / 1 / 2 / 2; } @media only screen and (max-width: 800px) { .t1 { grid-area: 1 / 1 / 2 / 2; } }
.b1 { grid-area: 2 / 1 / 3 / 2; } @media only screen and (max-width: 800px) { .b1 { grid-area: 2 / 1 / 3 / 2; } }
.t2 { grid-area: 1 / 2 / 2 / 3; } @media only screen and (max-width: 800px) { .t2 { grid-area: 3 / 1 / 4 / 2; } }
.b2 { grid-area: 2 / 2 / 3 / 3; } @media only screen and (max-width: 800px) { .b2 { grid-area: 4 / 1 / 5 / 2; } }

// Flex stuff
@media (max-width: 800px) { .f-screen-col-800 { flex-direction: column; gap: 20px; } }
@media (max-width: 900px) { .f-screen-col-900 { flex-direction: column; gap: 20px; } }
@media (max-width: 900px) { .f-screen-col-900 .card { width: 100%!important; } }

// Shlagged stuff
@media (min-width: 600px) { .shlagged { display: none; } }
@media (max-width: 599px) { .nonshlagged { display: none; } }
</style>
