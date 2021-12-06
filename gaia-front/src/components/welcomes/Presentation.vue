<template lang="pug">
div
  .ppt-bg(style="width: 100%; position: relative; top: -30px; margin-top: 0;")
    .bg(:style="'background-image: url('+imagebg+');'")
    .content.px-5.py-5

      .t-white.t-bold.t-center.mx-8.mb-6(style="font-size: 36px; margin-top: 20px;")
        .nonshlagged L'accompagnement innovant en faveur des&nbsp;territoires&nbsp;ruraux
        .shlagged(style="font-size: 28px;") L'accompagnement innovant en faveur des territoires ruraux
      .flex.mb-4.f-screen-col-800(style="gap: calc(40px + 5%);")
        div(style="flex: 1 1 0px;")
          .t-bold.t-18.t-center.mb-5 L'ambition du projet
          ul.mt-3
            li Une expérimentation sur 20 territoires en Nouvelle-Aquitaine jusqu’en juillet 2023
            li Accompagner 600 parcours Gaïa (publics : jeunes -25 ans, demandeurs d'emploi longue durée, publics en situation d’handicap...)
            li Maximiser l'impact social de la commande publique
            li Compléter l’offre d’accompagnement socio-professionnel du territoire (parcours et bornes numériques)

        div(style="flex: 1 1 0px;")
          .whittex
            .t-bold.t-18.t-center.mb-5 Un consortium d’acteurs engagés
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

      flex.f-jc-center
        router-link.btn.white.outline.block.mt-5.mx-auto(style="width: calc(200px + 20%)" :to="{ name: 'home', params: {} }") Accéder à Gaïa


    //--------------------------------------------------------------------------
    .ppt-1#gaia-about-section-1
      .ppt-head
        .bg(:style="'background-image: url('+image1+');'")
        .content
          //----------------------------------------------------------------------
          .title L'accompagnement à la formation en situation de travail
          //----------------------------------------------------------------------
          .subtitle
            | GAÏA propose au Service Public de l’Emploi et aux structures d'insertion  de  maximiser  les  mises  en
            | situation de travail
            | pour favoriser l’orientation professionnelle, l’accès ou le retour à l’emploi de leurs publics
          .flexer
            .flexed
              | Des parcours de formation en situation de travail sur mesure&nbsp;: FEST (formation en situation de travail) et AFEST (action de formation en situation de travail)
            .flexed
              | Une méthode innovante permettant de développer l’employabilité par l’acquisition, en milieu de travail,
              | de compétences transversales et professionnelles
            .flexed
              | Une équipe experte de la formation professionnelle et un animateur GAÏA à chaque étape du parcours
      //---------------------------------------------------------------

      div(style="display: grid; grid-gap: 0px 60px; grid-auto-columns: 1fr;")
        .t1
          .ppt-stand(style="min-height: 50px;")
            .bg(:style="'background-image: url('+image2+');'")
            .content.flex.f-ai-center(style="height: 100%;")
              .t-bold
                | La valeur ajoutée des parcours GAÏA&nbsp;: #[br]
                | muscler les dispositifs existants pour booster l’employabilité des demandeurs d'emploi

        .b1
          .pl-4.pr-4(style="flex: 0 0 50%; box-sizing: border-box;")
            .t-curr.t-bold Pour le demandeur d'emploi
            ul
              li.mb-3 Identifier et attester de compétences transversales
              li.mb-3 Valoriser au maximum son temps d’immersion dans une structure
              li.mb-3 Retrouver confiance et envie pour la suite de son parcours
          .pl-4.pr-4(style="flex: 0 0 50%; box-sizing: border-box;")
            .t-curr.t-bold Pour les entreprises
            ul
              li.mb-3 Recruter autrement&nbsp;: être sensibilisé à la formation ensituation de travail
              li.mb-3 Pour une petite structure ou association&nbsp;: formaliser des activités et se professionnaliser
          .pl-4.pr-4(style="flex: 0 0 50%; box-sizing: border-box;")
            .t-curr.t-bold Pour le prescripteur
            ul
              li.mb-3 Obtenir des éléments complémentaires sur lepositionnement du demandeur d'emploi
              li.mb-3 Renforcer son action sur le volet accompagnement
              li.mb-3 Expérimenter de nouvelles pratiques


        .t2
          .ppt-stand
            .bg(:style="'background-image: url('+image3+');'")
            .content.flex.f-ai-center(style="height: 100%;")
              .t-bold Des parcours coordonnés par GAÏA, crées sur-mesure par nos experts en formation et mis
                |  en œuvre en collaboration avec les prescripteurs
        //-.b2.pr-4
          div(style="margin-left: 0%;")
            .t-curr.t-bold Le prescripteur
            ul.mt-2
             li Repère l'entreprise et le demandeur d'emploi

          div(style="margin-left: 10%; max-width: 70%;")
            .t-curr.t-bold GAÏA
            ul.mt-2
              li Désigne un compagnon référent de parcours
              li Définit le référentiel de formation en situation de travail

          div(style="margin-left: 20%; max-width: 70%;")
            .t-curr.t-bold Le prescripteur
            ul.mt-2
              li Formalise la convention selon son circuit habituel

          div(style="margin-left: 30%; max-width: 70%;")
            .t-curr.t-bold GAÏA
            ul.mt-2
              li Accueille, oriente et suit le parcours du demandeur d'emploi
              li Evalue et atteste les compétences transversales acquises
        .b2
          div(style="margin-left: 0%;")
            .t-curr.t-bold Le prescripteur
            ul.mt-2
             li Repère l'entreprise et le demandeur d'emploi

          div
            .t-curr.t-bold GAÏA
            ul.mt-2
              li Désigne un compagnon référent de parcours
              li Définit le référentiel de formation en situation de travail

          div
            .t-curr.t-bold Le prescripteur
            ul.mt-2
              li Formalise la convention selon son circuit habituel

          div
            .t-curr.t-bold GAÏA
            ul.mt-2
              li Accueille, oriente et suit le parcours du demandeur d'emploi
              li Evalue et atteste les compétences transversales acquises

    //--------------------------------------------------------------------------
    .ppt-2#gaia-about-section-2
      .ppt-head
        .bg(:style="'background-image: url('+image2+');'")
        .content
          //----------------------------------------------------------------------
          .title Le développement de la clause sociale dans les marchés publics
          //----------------------------------------------------------------------
          .subtitle GAÏA accompagne les collectivités dans la mise en oeuvre d'une stratégie d'achat plus responsable
          .flexer
            .flexed
              | Un accompagnement technique et juridique dans la mise en oeuvre de clauses sociales
            .flexed
              | Des approches innovantes qui répondent aux enjeux des territoires ruraux et de leurs publics
            .flexed
              | Mobiliser l'écostystème local pour booster l'impact social sur le territoire
      //-----------------------------------------------------------------

      .ppt-stand
        .bg(:style="'background-image: url('+image1+');'")
        .content
          .t-bold Ambitions territoriales
          div
            | Un des objectif de l'expérimentation GAÏA est de créer une synergie via la
            | clause d'insertion entre les acteurs du territoire et d'expérimenter des actions innovantes.

      .flex.f-screen-col-900.f-wrap.gap-8(style="max-width: 100%;")
        div(style="flex: 1 1 0px;")
          .t-curr.t-bold Pour la collectivité
          ul
            li Développer l’emploi local
            li Renforcer le travail et le partenariat entre les SIAE (structures d’insertion par l’activité économique) et les collectivités
            li Permettre aux demandeurs d’emploi d’accéder à un emploi sur leur territoire
            li Aider les entreprises du territoire à recruter
            li Apporter des réponses spécifiques aux petits marchés des territoires ruraux

        div(style="flex: 1 1 0px;")
          .t-curr.t-bold Pour les entreprises
          ul
            li Recruter localement
            li Echanger avec le SPE (service public de l’emploi) sur ses besoins en main d'œuvre
            li Accéder aux marchés publics
            li Développer sa RSE (responsabilité sociétale des entreprises) et la mettre en avant

        div(style="flex: 1 1 0px;")
          .t-curr.t-bold Pour les demandeurs d'emploi
          ul
            li Confirmer son projet professionnel
            li Evaluer ses compétences sur un métier précis
            li Rencontrer une entreprise locale
            li Accéder à un emploi ou une formation
            li Reprendre confiance en soi
            li Acquérir de nouvelles compétences

    //--------------------------------------------------------------------------
    .ppt-3#gaia-about-section-3
      .ppt-head
        .bg(:style="'background-image: url('+image3+');'")
        .content
          //----------------------------------------------------------------------
          .title L'accompagnement à la création d'entreprise
          //----------------------------------------------------------------------
          .subtitle GAÏA accompagne les parcours des créateurs d'entreprises éloignés de l'emploi et en insertion
          .flexer
            .flexed
              | Dispositifs de consolidation de fonds propres pour les créateurs éloignés de l'emploi
            .flexed
              | Actions innovantes à destination des créateurs d'EITI (Entreprise d’Insertion par le Travail Indépendant)
            .flexed
              | Un partenariat privilégié avec l'ADIE et les collectivités locales
      //-----------------------------------------------------------------

      div(style="display: grid; grid-gap: 0px 60px; grid-auto-columns: 1fr;")
        .ppt-stand.t1
          .bg(:style="'background-image: url('+image2+');'")
          .content.t-bold
            | Accompagnement des travailleurs indépendants via l'Entreprise d’Insertion par le Travail Indépendant (EITI)
        ul.b1
          li
            .t-curr.t-bold  Appui Création EiTI
            div Phase amont&nbsp;: préparation intégration
          li
            .t-curr.t-bold  Accompagnement EiTI
            ul.s
              li Demande de conventionnement
              li Outillage et process administratifs
              li Conseils juridiques...
          li
            .t-curr.t-bold  Aide à la sécurisation des activités
            div Appui sur les marchés publics
        .ppt-stand.t2
          .bg(:style="'background-image: url('+image1+');'")
          .content.t-bold
            | Sécuriser les parcours de création d'entreprise en abondant les fonds propres pour les micro- crédits
        ul.b2
          li
            .t-curr.t-bold Venir en complément de l’offre de service de l’ADIE sur le volet financement
            div GAÏA finance une prime de 1000 euros pour les microcrédits accordés par l'ADIE
          li
            .t-curr.t-bold Soutenir les porteurs de projet n'ayant pas accès au crédit bancaire classique
            div Sécuriser la prise de risque liée à l'emprunt pour les publics éloignés de l'emploi
          li
            .t-curr.t-bold Encourager la création d'entreprise auprès des publics jeunes
            div Disposer de 6 à 8 mois mois (rémunéré pour les -30 ans) pour affiner son projet de création

      //-----------------------------------------------------------------

  .flex.f-ai-center
    router-link.btn.white.outline.block.mt-5.mx-auto(style="width: calc(200px + 20%)" :to="{ name: 'home', params: {} }") Accéder à Gaïa
</template>

<script>
export default {
  name: 'Presentation',
  data () {
    return {
      imagebg: require("@/assets/fields/ales-me-m.jpg"),
      image1: require("@/assets/about-s/KdeqA3aTnBY.jpg"),
      image2: require("@/assets/about-s/handshake.jpg"),
      image3: require("@/assets/about-s/5fNmWej4tAA.jpg"),
      image4: require("@/assets/about-s/6797d8d5f89.jpg"),
      postalResetter: null,
      lstRsttrId: 0,
    }
  },
  computed: {
    partners() { return this.$api.data.partners; },  // TODO : Use with texts as external, "All texts in this json property of... same for gaia logo csv?"
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
