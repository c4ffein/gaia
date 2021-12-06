import Vue from 'vue';
import Fetcher from '@/libs/fetcher.js';
import ErrorHandler from '@/errors.js';
import * as h from '@/libs/object-helpers/object-helpers'
import { prettyDate } from '@/libs/drftimestamp'
import { makeRest } from '@/libs/rest-maker.js'
import jwtDecode from '@/libs/jwt-decode/jwt-decode'
import { secureOpenNewTab } from '@/libs/inputs.js'


const getKTPG = () => process.env.VUE_APP_DEBUG_KIOSK_TOKEN ? Promise.resolve(process.env.VUE_APP_DEBUG_KIOSK_TOKEN)
  : ((typeof pywebview) !== 'undefined') ? pywebview.api.get_kiosk_token() : null;  // eslint-disable-line no-undef

export default class ApiInterface {
  constructor(data, backendAddress, askRelogCallback) {
    this.data = data || {};
    this.f = new Fetcher(
      backendAddress,
      f => { this.logout(); askRelogCallback(f); },
      () => this.cleanCache(),
      (i) => this.setUserId(i),
      jwtDecode,
    );
    this.errorHandler = new ErrorHandler();
    this.askRelogCallback = askRelogCallback;
    this.loginPromise = null;  // Separate logic from tokenizer in fetcher, we also need the user to be logged
    Vue.set(this.data, 'userId', this.f.getUID());
    Vue.set(this.data, 'visio', false);
    Vue.set(this.data, 'kiosk', null);
    [
      'user', 'kiosks', 'updates', 'rdvs', 'disponibilities', 'rdvCertificates', 'partners', 'solutions', 'users',
      'files', 'forms', 'postals', 'userSettings',
    ].map(dataStructName => Vue.set(this.data, dataStructName, {}));
    this.loadPartners();
    this.listSolutions();
    this.setListeners();
    this.registerlistenerKiosk();  // This one is different as it doesn't fit the design pattern
  }


  //////////////////
  // Constructors //
  //////////////////

  Id(id) { return id ? Number(id) : null; }
  paramString(param) { return h.oE(param).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}=${v}`).reduce(
    (a, b) => a ? `${a}&${b}` : `?${b}`, ''); }

  // Login / Logout
  logUser(user, partner) {
    Vue.set(this.data.users, user.id, user);
    Vue.set(this.myUser(), 'id', user.id);  // TODO Useless ? Or complex trigger?
    if (partner) Vue.set(this.data.partners, partner.id, partner);
    Vue.set(this.data, 'updates', {});
    // Fire and forget preshots
    this.loadUserSettings(this.myUserId());
    this.getForms();
    // Get again since now we are connected  // TODO: Check race condition not possible
    this.loadPartners();
    this.loadSolutions();
    return user;
  }
  // TODO : Handle error for both in the rest of the code
  login(login, password) {
    this.loginPromise ||= this.f.login({ username: login, password }
    ).then(resp => { this.loginPromise = null; this.logUser(resp.user, resp.partner); }
    ).catch(e => { this.loginPromise = null; throw e; } );
    return this.loginPromise;
  }
  tryRelog() {
    // TODO : What if failed?..
    this.loginPromise ||= this.f.refresh().then(() => this.f.get(`users/${this.f.getUID()}`)
    ).then(resp => { this.loginPromise = null; this.logUser(resp, resp.partner); }
    ).catch(e => { this.loginPromise = null; this.errorHandler.tryRelog(e); } );
    return this.loginPromise;
  }
  iMayLogAfter() { return !!this.loginPromise; }
  waitLogin(){ if (this.loginPromise) { return Promise.race([this.loginPromise]); } }

  cleanCache() {  // TODO : works when logout, also when login as we may have unfit data?..
    // TODO : better implem for empty
    Vue.set(this.data, 'userId', null);
    Vue.set(this.data, 'updates', {});
    Vue.set(this.data, 'rdvs', {});  // TODO OPTI : purge rights
    Vue.set(this.data, 'forms', {});
    Vue.set(this.data, 'users', {});
    // if (nextPage) this.router.push(nextPage);
    // else if this.router.go(nextPage ? nextPage : '/');
  }

  setUserId(userId) { Vue.set(this.data, 'userId', userId); }

  logout() { return this.f.logout().then(() => this.cleanCache()); }

  // resetPassword() { this.f.post(`/users/${this.myUserId()}/reset-password`); }
  changePassword(userId, oldPassword, newPassword) { return this.f.post(
    `users/${userId}/change-password`, {old: oldPassword, new: newPassword}
  ); }
  askResetPassword(login) { return this.f.post(`users/ask-reset-password`, {login}); }
  getTokenLogin(token) { return this.f.post(`users/get-token-login`, {token}); }
  completeResetPassword(token, newPassword) { return this.f.post(
    `users/complete-reset-password`, {token, new_password: newPassword}
  ); }

  myUserId() { return this.data.userId; }
  myUser() { return this.data.users[this.myUserId()]; }
  partnerId() { return this.myUser()?.partner_as_member ? this.Id(this.myUser().partner_as_member) : null; }
  myPartnerAMId() { return this.myUser()?.partner_as_member ? this.Id(this.myUser().partner_as_member) : null; }
  myPartnerAM() { return this.data.partners?.[this.myPartnerAMId()]; }
  myKioskId() { return this.data.kiosk?.id || null; }

  // Usable in computed of component if this this is in the this.$api of the component - TODO Replace by iAmXXX methods
  iAmLogged() { return !!this.data.userId; }
  iAmPartner() { return this.partnerId(); }
  iAmRegular() { return !!this.data.userId && this.isRegular(this.data.userId); }
  iAmJustKioskOverseer() { return !!this.data.userId && this.isJustKioskOverseer(this.data.userId); }
  iAmAdmin() { return this.myUser()?.is_admin; }
  iAmSuper() { return this.myUser()?.is_superuser; }
  iAmGreat() { return this.myUser()?.is_superuser || this.myUser()?.is_admin; }
  //
  isRegular(userId) { const u = this.data.users?.[userId];
    return u && !(!!u.partner_as_member || u.is_just_kiosk_overseer || u.is_admin || u.is_great); }
  isKioskOverseer(userId) { const u = this.data.users?.[userId]; return u && u.kiosks_overseeing; }
  isJustKioskOverseer(userId) { const u = this.data.users?.[userId]; return u && u.is_just_kiosk_overseer; }

  // Register
  register(firstname, lastname, birthdate, email, phone, postalCode, password, additional) {
    return this.registerUser(firstname, lastname, birthdate, email, phone, postalCode, password, additional
    ).then(user => this.login(user.username, password).then(() => user)); // TODO : Error handling for login
  }


  ///////////////////////
  // Users : made REST //
  ///////////////////////

  registerUser(firstname, lastname, birthdate, email, phone, postalCode, password, additional) {
    return this.f.post('users/', { firstname, lastname, birthdate, email: email || null, phone: phone || null,
      'postal_code': postalCode, password, additional } ); }
  makeUserBeneficiary(user, partnerId) {
    return this.f.post(`users/${user.id}/make-beneficiary/`, {partner: partnerId}).then(
      () => { if (!user.partners_as_beneficiary.includes(partnerId)) user.partners_as_beneficiary.push(partnerId); }
    );
  }
  unmakeUserBeneficiary(user, partnerId) {
    return this.f.post(`users/${user.id}/unmake-beneficiary/`, {partner: partnerId}).then(
      () => user.partners_as_beneficiary.splice(user.partners_as_beneficiary.indexOf(partnerId), 1)
    );
  }
  makeUserVisitorOfPartner(user, partnerId) {
    return this.f.post(`users/${user.id}/make-visitor-of/`, {partner: partnerId}).then(
      () => { if (!user.partners_as_beneficiary.includes(partnerId)) user.partners_as_beneficiary.push(partnerId); }
    );
  }
  makeUserKioskOverseer(userId, kioskId) {
    return this.f.post(`users/${userId}/make-kiosk-overseer/`, {kiosk: kioskId}).then( () => {
      const u = this.data.users?.[userId];
      if (u && !u.kiosks_overseeing.includes(kioskId)) u.kiosks_overseeing.push(kioskId);
    } );
  }
  unmakeUserKioskOverseer(userId, kioskId) {
    return this.f.post(`users/${userId}/unmake-kiosk-overseer/`, {kiosk: kioskId}).then( () => {
      const u = this.data.users?.[userId]; u.kiosks_overseeing.splice(u.kiosks_overseeing.indexOf(kioskId), 1); }); }
  userInSearch(user, searchBox) {
    if (searchBox === '') return 0;
    const names = [user.firstname, user.lastname, user.email, user.phone, prettyDate(user.birthdate)];
    const searchStrings = searchBox.split(' ');
    let matchScore = 0;
    for (let i = 0; i < searchStrings.length; i += 1) {
      const searchString = searchStrings[i].toLowerCase();
      for (let j = 0; j < names.length; j += 1) {
        if(names[j] && names[j].toLowerCase().includes(searchString)) matchScore += 1;
      }
    }
    return matchScore;
  }
  usersInSearch(users, searchBox) {
    if (searchBox === '') return users;
    return [...users].sort(
      (a, b) => this.userInSearch(b, searchBox) - this.userInSearch(a, searchBox)
    ).filter(a => this.userInSearch(a, searchBox) > 0);
  }
  getUserForms(user) {
    if (!user.forms) Vue.set(user, 'forms', []);
    this.f.post(`users/${user.id}/forms`).then(
      // s => Vue.set(user, 'forms', s.results.map(f => { Vue.set(this.data.forms, f.id, f); return f.id; }))
      s => Vue.set(user, 'forms', s.results.map(f => { Vue.set(this.data.forms, f.id, f); return f.id; }))
    );
    return user.forms;
  }
  getForms() {
    if (!this.data.forms) Vue.set(this.data, 'forms', {});
    if (this.myUserId()) this.getUserForms(this.myUser());
    return this.data.forms;
  }
  createDiagnosticForm(userId) { this.f.post(`users/${userId}/add-form`).then(s => {
    this.data.users[userId].forms.push(s.results[0].id); Vue.set(this.data.forms, s.results[0].id, s.results[0]) }); }
  setUserProfile(user, profile) {
    return this.f.post(`users/${user.id}/profile`, profile).then(s => { Vue.set(user, 'profile', s.results); });
  }
  // TODO : fix patchUser, use patchUser
  patchUserPP(userId, id) { return this.f.patch(`users/${userId}`, {profile_picture: id}).then(u => this.updateUser(userId, u)); }
  patchUserBP(userId, id) { return this.f.patch(`users/${userId}`, {banner_picture: id}).then(u => this.updateUser(userId, u)); }
  get updateUser() { return (id, u) => { h.oE(u).map(([k, v]) => Vue.set(this.data.users[id], k, v)); return u; } ; }


  //////////////
  // Partners //
  //////////////

  deletePartner(id) { return this.f.delete(`partners/${id}`); }
  getPartnerZone(partnerId) { return this.f.get( `partners/${partnerId}/zone/` ); }
  savePartnerZone(partnerId, data) { return this.f.put( `partners/${partnerId}/zone/`, { epcis: data } ); }
  partnerTypeNames() { return ["Inconnu", "Association", "IAE", "autre structure de l'ESS", "Entreprise",  "Autre"]; }
  getPartnerStats(partnerId) { return this.f.get(`partners/${partnerId}/stats`); }
  readUserFirstLastName(id) { const u = this.data?.users?.[id];
                              return u && `${u?.firstname || ''} ${u?.lastname || ''}`; }


  ///////////////
  // Geozones  //
  ///////////////

  listEpcis(params) {
    // TODO : {count: 25, next: "http://.../?page=2", previous: null, results: Array(10)}
    if (params && params.nextOf) return this.f.get(`epcis`); // TODO
    else return this.f.get(`epcis`);
  }

  /////////////////////////////////////////
  // Partners - Geozones - Solutions mix //
  /////////////////////////////////////////

  filterNonDisabledSolutions() { return h.oFE(h.oE(this.data.solutions || {}).filter(([,v]) => !v.is_deactivated)); }
  solutionCategoryPartners(categoryId, areaCode) {
    return (h.oV(this.data.partners || {}).filter(p => !p.is_deactivated).filter(
      p => (p.solutions && (categoryId in p.solutions) && p.solutions[categoryId].enabled)
        && (!areaCode || this.data.postals[areaCode]?.results?.includes?.(p.id))
    ).map(p => p.id));
  }
  solutionCategoriesPartners(areaCode) { return h.oFE(
    h.oV(this.data.solutions).map(sC => [sC.id, this.solutionCategoryPartners(sC.id, areaCode)])
  ); }
  enbldSltnsCtgrs(areaCode, partnerId) {  // Uses areaCode, partnerId to filter, or both, or none
    const solutionCategoriesPartners = this.solutionCategoriesPartners(areaCode);
    if(areaCode !== undefined) this.updtPstlIfOld(areaCode);
    return h.oV(this.data.solutions).filter(
      s => solutionCategoriesPartners[s.id] ? solutionCategoriesPartners[s.id].length !== 0 : false
    ).filter(s => partnerId ? this.solutionCategoriesPartners()[s.id].includes(partnerId) : true );
  }
  isPostalAvailable(areaCode) { this.updtPstlIfOld(areaCode); return this.data.postals?.[areaCode]?.available; }
  updtPstlIfOld(aC) { const l = this.data.postals[aC]; if(!l || l.l + 10000 < Date.now()) this.updtPstl(aC); }
  updtPstl(areaCode) { this.f.get(`postals/${areaCode}`).then(r => { this.updtPstlDs(areaCode, r)}); }
  updtPstlDs(areaCode, r) { Vue.set(this.data.postals, areaCode, { ...r, l: Date.now() }); }
  getAdminBase() { return this.f.get(`users/export`); }
  getAdminStats() { return this.f.get(`users/stats`); }


  ///////////////
  // Forms     //
  ///////////////

  addForm(params) { Vue.set(this.data.forms, this.data.forms.length, {
    id: Math.random(), validation: params.validation, validationformulaire: params.validationformulaire
  });}
  getForm(id) { return this.f.get(`forms/${id}`); }  // TODO : optional version option don't re-download cached
  saveForm(id, form) { return this.f.put(`forms/${id}`, form); }
  formTypeName(t) { return [
    'Fiche d\'inscription', '', '', 'Diagnostic de situation', 'Suivi de parcours', '', '', 'Préinscription'
  ][t-1]; }
  formTypeAltName(t) { return [
    'Fiche d\'inscription', '', '', 'Diagnostic de situation', 'Formulaire suivi de parcours', '', '',
    'Formulaire préinscription'
  ][t-1]; }


  //////////////
  // Files    //
  //////////////

  files(id) { return this.data.files[id]; }
  getFile(id) { return this.f.get(`files/${id}`).then(this.setFile); }
  getFiles(params) { return this.f.getNT(`files/${this.paramString(params)}`).then(this.setFiles); }
  get setFile() { return f => { Vue.set(this.data.files, f.id, f); return f } ; }
  get setFiles() { return f => f.results.forEach(this.setFile); }
  // TODO checkFile(id) { return this.f.get(`files/${id}`).then(f => { this.files[id] = f; return f; }); }
  saveFile(data, as_public) { return this.f.post(`files`, { b64: data, public: as_public}).then(this.setFile); }

  //////////////
  // Kiosk    //
  //////////////

  kioskModeEnabled() { return this.data.kiosk ? !this.data.kiosk.is_deactivated : false; }
  // Reimplementation of api listener logic, except we dont want a list, but the specific kiosk to save a 2nd request
  registerlistenerKiosk() {  // Should just get id instead?..
    setTimeout(() => { this.registerlistenerKiosk(); this.getKeyAndLoadMyKiosk(); }, 3000); }
  getKeyAndLoadMyKiosk() {
    const p = getKTPG(); if (!p) return; return p.then(k => {this.f.kioskToken = k; this.loadMyKiosk()}); }
  loadMyKiosk() { this.f.get("api/kiosk").then(r => { this.data.kiosk = r; }); }
  tryOpenKioskUrl(url) {
    const pwv = ((typeof pywebview) !== 'undefined') ? pywebview : null;  // eslint-disable-line no-undef
    if (pwv === null) return Promise.resolve().then(() => secureOpenNewTab(url));
    return pwv?.api?.open_modal?.(url) || Promise.reject('no-pywebview-method');
  }


  ////////////////////////////
  // RDVs                   //
  ////////////////////////////

  allRdvs() { return this.data?.rdvs || {}; }
  notOverRdvs() { return h.oFE(h.oE(this.allRdvs()).filter(([, v]) => !v.over)); }
  myRdvs() { return h.oFE(h.oE(this.allRdvs()).filter(
    ([, v]) => (v.user === this.myUserId() || v.partner === this.myPartnerAMId())
    // ([, v]) => ((v.user === this.myUserId() || v.partner === this.myPartnerAMId() )&& console.log(v.start.slice(0, 10) === '2021-06-09') )
  )); }
  // myRdvs() { return []; }
  myNotOverRdvs() { return h.oFE(h.oE(this.allRdvs()).filter(([, v]) => (
    (v.user === this.myUserId() || v.partner === this.partnerId()) && !v.over
  ))); }
  myOverRdvs() { return h.oFE(h.oE(this.allRdvs()).filter(([, v]) => (
    (v.user === this.myUserId() || v.partner === this.partnerId()) && v.over
  ))); }
  filterRDVs(params) { return h.oFE(h.oE(this.allRdvs()).filter(([, v]) => (  // Accepts array or value for each param
    h.oE(params).every(([pK, pV]) => h.iA(pV) ? pV.some(pVV => v[pK] === pVV) : v[pK] === pV)
  ))); }
  updateRDVCache(rdv) { Vue.set(this.data.rdvs, rdv.id, rdv); return rdv; }
  createVisio(partnerId, userId) { return this.f.post('rdvs', {partner: partnerId, user: userId}); }
  createRDV(rdv) { return this.f.post(`rdvs/`, rdv).then(this.updateRDVCache.bind(this)); }
  cancelRDV(id) { return this.f.post(`rdvs/${id}/cancel/`).then(this.updateRDVCache.bind(this)); }
  confirmRDV(id) { return this.f.post(`rdvs/${id}/confirm/`).then(this.updateRDVCache.bind(this)); }


  //////////////////////////////////////
  // RDV Certificates : made REST     //
  //////////////////////////////////////

  askRDVCertificate(rdvId) { return this.f.post(`rdvs/${rdvId}/ask-certificate`).then(
    a => { this.cchRDV(rdvId, a.rdv); this.cchRDVCertificate(rdvId, a.rdv_certificate); }
  ) }
  signRDVCertificate(rdvCId, signature) {
    return this.f.post(`rdv-certificates/${rdvCId}/sign-certificate`, { signature: signature }).then(
      o => this.cchRDVCertificate(rdvCId, o)
    );
  }


  ////////////////////////////
  // Visio                  //
  ////////////////////////////

  startVisio(visioId, visioUrl) { Vue.set(this.data, 'visio', {id: visioId, url: visioUrl}); }
  pauseVisio() { Vue.set(this.data, 'visio', false); }
  stopVisio() { this.f.post(`rdvs/${this.data.visio.id}/terminate`).then(this.updateRDVCache.bind(this)).then(
    () => Vue.set(this.data, 'visio', false));
  }
  // TODO : nextKioskRdv
}

makeRest(ApiInterface, 'userId', {
  RDVCertificate: { api: "rdv-certificates", dS: "rdvCertificates" },
  RDV: { api: "rdvs", dS: "rdvs", listen: true },  // TODO : Rename Rdv everywhere
  Disponibility: { api: "disponibilities", dS: "disponibilities", listen: true },  // TODO : plural: ...
  User: {
    api: "users", dS: "users", // TODO : watch Users
    expendablesM: {'forms': 'Form'}, expendablesO: {'partner_as_member': 'Partner'},
  },
  UserSettings: { api: "user-settings", dS: "userSettings" },
  Partner: { api: "partners", dS: "partners", listen: true },
  Solution: { api: "solutions", dS: "solutions" },
  Kiosk: { api: "kiosks", dS: "kiosks", listen: true },
})
