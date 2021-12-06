<template lang="pug">
  .mainest.flex.f-col
    TopBar(v-if="showTopBar" :transparent="true")
    .width-container.spacer(v-if="showTopBar")
      Visio(v-if="apiData.visio" @update="$event.visioStatus ? visio = $event.visioStatus :_;")
    .left-right-container(:class="classLeftRight" style="flex-grow: 1;")
      LeftBar.leftbar(v-if="iAmLogged")
      .main-container.flex.f-col
        Warnings
        router-view(:apiData="apiData" style="f-grow: 1")
    Footer.mt-auto(v-if="() => !kioskModeEnabled")
</template>

<script>
import TopBar from './components/TopBar.vue'
import LeftBar from './components/LeftBar.vue'
import Warnings from './components/warnings/Warnings.vue'
import Visio from './components/reusables/Visio.vue'
import Welcome from './components/welcomes/Welcome.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: { TopBar, LeftBar, Warnings, Visio, Welcome, Footer },
  data () { return { visio: false, apiData: this.$api.data } },
  computed: {
    myUser() { return this.$api.myUser(); },
    isHome() { return String(this.$route.name) === 'home'; },
    isLogin() { return String(this.$route.name) === 'login'; },
    isRegister() { return String(this.$route.name) === 'register' || String(this.$route.name) === 'register-as-partner'; },
    classLeftRight() { return `${this.iAmLogged ? '' : ' left-disabled'}`; },
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    kioskModeEnabled() { return this.apiData.kioskModeEnabled(); },
    showTopBar() { return !(this.isHome && !this.iAmLogged) },
  },
}
</script>

<style lang="scss">
@font-face {
  font-family: "Inter"; src: local("Inter"), url(./assets/fonts/Inter-Regular.ttf) format("truetype");
}
@font-face {
  font-family: "Inter"; src: local("Inter"), url(./assets/fonts/Inter-Bold.ttf) format("truetype"); font-weight: bold;
}

html, body, .mainest { height: 100%; }
body { margin: 0; background-color: #ffff; overflow-y: scroll; }
body * {
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.card, .page { background-color:white; border-radius: 5px; box-shadow:0 0 20px 0 rgba(0,0,0,.1); margin-bottom: 20px; }
.page { min-height:200px; }

.left-right-container { display: grid; width: 100%; grid-template-columns: max(166px, calc(100px + 10%)) auto; }
.left-right-container.left-disabled { grid-template-columns: 100%; }
.spacer { padding-top: 123px; }
.spacer.minimal-padding { padding-top: 122px; }

.main-container { padding-bottom: 5%; flex: 1 0 auto; }
.width-container { margin-left: 10%; margin-right: 10%; }

.c4-shadow { box-shadow:0 0 20px 0 rgba(0,0,0,.1); }
.c4-shadow-hover:hover, { position: relative; top: -5px; box-shadow:0 5px 20px 0 rgba(0,0,0,.2); }

.section-title { font-size: 30px; margin-left: 10%; margin-right: 10%; margin-bottom: 20px; }

hr { border-top: 1px solid rgba(0, 0, 0, 0.1); }
a { color: $primary-color; }
.page { position: relative; }  // For all pages where absolute is used
.page-body { margin-left: 5%; margin-right: 5%; padding-bottom: 20px; }

// MazCheckbox disabled
.maz-checkbox[disabled] { color: $grey-color; }
.maz-checkbox .disable-warning { color: rgba(0, 0, 0, 0); transition: color 1s; }
.maz-checkbox[disabled] .disable-warning { color: $grey-color; }
.maz-checkbox--primary[disabled] [type=checkbox]:checked + label::before { border-color: $grey-color; }
.maz-checkbox--primary[disabled] [type=checkbox]:not(:checked) + label::after,
.maz-checkbox--primary[disabled] [type=checkbox]:checked + label::after {
    background-color: $grey-color; color: $grey-color;
}

// MazCheckbox hint
.maz-checkbox .maz-checkbox-hint { margin-left: 10px; opacity: 0; transition: opacity 0.5s; color: $primary-color; }
.maz-checkbox:hover .maz-checkbox-hint { opacity: 1; }

// MazInput/MazSelect no placeholder
.maz-select .maz-input__input[placeholder=""], .maz-input .maz-input__input[placeholder=""] {
  padding-top: 0px!important;
}

// MazSelect options list full width
.maz-select[options-list-full-width] .maz-select__options-list { width: 100%!important; }


// Fix maz-checkbox centerd when more than one line
.maz-checkbox>label { text-align: left!important; }

.maz-btn--primary:focus::before { border: none; }
.maz-btn-group.two-choices > button.maz-btn-group__item {width: 50%;}
.maz-btn--outline:not(:hover):not(:focus):not(.maz-btn-group__item) { background-color: rgba(0, 0, 0, 0)!important; }

.editable-p { font-size: 1.5em; pointer-events: none; position: absolute;
  display: flex; justify-content: center; align-items: center; margin: auto; top: 0; left: 0; bottom: 0; right: 0;
  color: white; visibility: hidden; opacity: 0; transition: visibility 0.15s, opacity 0.15s linear, font-size 0.15s;}
.editable-p:after { content:"edit" }
*:hover>.editable-p { font-size: 2em; visibility: visible; opacity: 1; }
</style>
