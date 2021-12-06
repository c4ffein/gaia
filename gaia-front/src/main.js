import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import ApiInterface from '@/api.js'

import { MazTabsContent, MazTabsContentItem, MazStepper, MazSelect, MazBtn, MazInput } from 'maz-ui'

import Login from './components/login/Login.vue'
import AskResetPassword from './components/login/AskResetPassword.vue'
import CompleteResetPassword from './components/login/CompleteResetPassword.vue'
import ProfileUser from './components/profiles/ProfileUser.vue'
import ProfilePartner from './components/profiles/ProfilePartner.vue'
import Settings from './components/settings/Settings.vue'
import Documents from './components/Documents.vue'
import Form from './components/Form.vue'
import FormAccess from './components/FormAccess.vue'
import UserList from './components/UserList.vue'
import Partners from './components/partners/Partners.vue'
import Kiosks from './components/kiosks/Kiosks.vue'
import Geozones from './components/Geozones.vue'
import Solutions from './components/Solutions.vue'
import RendezVous from './components/rdvs/RendezVous.vue'
import Welcome from './components/welcomes/Welcome.vue'
import Presentation from './components/welcomes/Presentation.vue'
import News from './components/welcomes/News.vue'
import OffersGetLinkToRdv from './components/welcome-components/OffersGetLinkToRdv.vue'
import VisioPage from './components/VisioPage.vue'
import NotFound from './components/NotFound.vue'


Vue.use(VueRouter)

Vue.config.productionTip = false

// TODO : optional authLevelCheck method in metas?
const routes = [
  { name: 'home', path: '/', component: Welcome },
  { name: 'about', path: '/about', component: Presentation },
  { name: 'news', path: '/news/:path(.*)?', props: true, component: News },
  { name: 'offers', path: '/offers', component: OffersGetLinkToRdv },
  { name: 'login', path: '/login', component: Login, props: (route) => (
    { isRegister: false, asPartner: false, ...route.params }
  )  },
  { name: 'ask-reset-password', path: '/ask-reset-password', component: AskResetPassword },
  { name: 'complete-reset-password', path: '/complete-reset-password/:token', component: CompleteResetPassword,
    props: true },
  { name: 'register', path: '/register', component: Login, props: (route) => ( {
    isRegister: true, asPartner: false, ...route.params } ) },
  { name: 'register-as-partner', path: '/register-as-partner', component: Login,
    props: (route) => ( { isRegister: true, asPartner: true, ...route.params } ) },
  { name: 'settings', path: '/settings', component: Settings, meta: { requiresAuth: true }},
  { name: 'documents', path: '/documents', component: Documents, meta: { requiresAuth: true } },
  // { name: 'documents', path: '/documents', component: Documents, meta: { requiresAuth: false } },
  { name: 'form', path: '/formulaire/:id', component: Form, props: true, meta: { requiresAuth: true } },
  { name: 'form-access', path: '/acces-formulaire', component: FormAccess, meta: { requiresAuth: true } },
  { name: 'user-list', path: '/user-list/', component: UserList, props: true, meta: { requiresAuth: true } },
  { name: 'user-list-user', path: '/user-list/:id', component: UserList, props: true, meta: { requiresAuth: true } },
  // TODO : Reuse list component for partners, geozones...
  { name: 'partners', path: '/partners', component: Partners, meta: { requiresAuth: true } },
  { name: 'kiosks', path: '/kiosks', component: Kiosks, meta: { requiresAuth: true } },
  { name: 'kiosk', path: '/kiosks/:id', component: Kiosks, props: true, meta: { requiresAuth: true } },
  { name: 'geozones', path: '/geozones', component: Geozones, meta: { requiresAuth: true } },
  { name: 'solutions', path: '/solutions', component: Solutions, meta: { requiresAuth: true } },
  { name: 'profile', path: '/profile/:id', component: ProfileUser, props: true, meta: { requiresAuth: true } },
  { name: 'partner', path: '/partner/:id', component: ProfilePartner, props: true, meta: { requiresAuth: true } },
  { name: 'rdvs', path: '/rdv', component: RendezVous,
    props: (route) => ( { ...route.params } ), meta: { requiresAuth: true } },
  { name: 'rdv', path: '/rdv/:id', component: RendezVous,
    props: (route) => ( { ...route.params } ), meta: { requiresAuth: true } },
  { name: 'visio', path: '/visio', component: VisioPage, props: true },
  { path: '/:catchAll(.*)', component: NotFound, name: 'NotFound' },
]


const router = new VueRouter({ mode: 'history', routes })
router.beforeEach(async (transition, _, next) => {  // Safe as api tryRelog call before Vue app instanciation
  if (transition.meta.requiresAuth){
    if(Vue.prototype.$api.iMayLogAfter()) return next();  // We don't want to block regular handling, relog will do
    if(!Vue.prototype.$api.iAmLogged()) {  // Handle case where we don't have a userId
      next({ name: 'login', params: { futureRoute: { name: transition.name, params: transition.params } } });
      return;
    }
  } next();
})


// Good mechanism but should provide UI for loading... but should double check with old mechanism.
// But make old mechanism work ok when token present but login info request not sent or processing
const noLoginRoutes = ['login', 'home', 'register', 'ask-reset-password', 'complete-reset-password', 'about'];
Vue.prototype.$api = new ApiInterface(null, process.env.VUE_APP_BACKEND_ADDRESS || 'http://localhost:8000', force => {
  if(!noLoginRoutes.includes(router.currentRoute.name) || (force && router.currentRoute.name === 'home')) {
    router.push({
      name: 'login', params: { futureRoute: { name: router.currentRoute.name, params: router.currentRoute.params } }
    });
    return true;
  } else return false;
} );
Vue.prototype.$api.tryRelog();


new Vue({ render: h => h(App), router, }).$mount('#app')

Vue.use(MazTabsContent)
Vue.use(MazTabsContentItem)
Vue.use(MazStepper)
Vue.use(MazSelect)
Vue.use(MazBtn)
Vue.use(MazInput)
