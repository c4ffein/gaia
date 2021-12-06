import Vue from 'vue';
import * as h from '@/libs/object-helpers/object-helpers'


const tra = {
  'username': 'Nom d\'utilisateur',
  'This field is required.': 'Requis',
  'firstname': 'Prénom',
  'lastname': 'Nom de famille',
  'email': 'Email',
  'phone': 'Téléphone',
  'birthdate': 'Date de naissance',
  'Enter a valid email address.': 'Adresse invalide.',
  'Enter a valid phone number.': 'Numéro de téléphone invalide.',
  'user with this email already exists.': 'Un utilisateur possède déjà cette adresse email',
  'user with this phone already exists.': 'Un utilisateur possède déjà ce numéro de téléphone',
  'refresh': 'refresh',
  'This field may not be null.': 'Aucune information fournie.',
  'This field may not be blank.': 'Aucune information fournie.',
  'Date has wrong format. Use one of these formats instead: YYYY-MM-DD.' : 'Date non reconnue',
  'postal_code': 'Code postal',
  'A valid integer is required.': 'Un nombre est requis',
  'partner_as_member': 'Partenaire dont l\'utilisateur est gestionnaire',
  'is_admin': 'Statut administrateur',
}


export default class ErrorHandler {
  translateError(str) {
    if (str.includes('Ensure this value has at least 8 characters')) return 'Doit contenir au moins 8 caractères.';
    return str;
  }
  translateErrors(msgs, ret) {
    Vue.set(ret, 'msgs', h.oFE(h.oE(msgs).map(([field, value]) => [field, value.map(m => this.translateError(m))])));
  }

  handleError(msg, ret, recognizedFields) {
    ret ||= {};
    // Sometimes django returns errors directly, sometimes django put them in .errors
    if (msg.errors) { msg = {...msg, ...msg.errors}; delete msg.errors; }
    const tr = s => tra[s] || 'Erreur inconnue';
    const trf = s => tra[s] || 'Champ non reconnu';
    const valErrors = errs => { let e = ''; for (const i in errs) e += `  - ${tr(errs[i])}\n`; return e.slice(0, -1); }
    let e = 'Impossible d\'ajouter l\'utilisateur pour les raisons suivantes :\n'
    for (const [key, value] of Object.entries(msg)) {
      if (recognizedFields?.includes(key)) ret.errors = {...(ret.errors || {}), [key]: valErrors(value)};
      else e += `${trf(key)}:\n${valErrors(value)}\n`;
    }
    ret.msg = e;
    return ret;
    // TODO : Un utilisateur existe déjà avec cette combinaison de nom / prénom. Souhaitez-vous *utiliser son compte*
    // ou *confirmer la création d'un nouveau compte*? -> Create with 2 last digit of year
  }

  login(error, ret) {
    const errorMessages = {
      400: 'Combinaison d\'utilisateur et mot de passe non trouvée. Merci de vérifier les informations et réessayer.',
      401: 'L\'authentification a échouée. \nMerci de vérifier les informations fournies ou '
        + 'de contacter un responsable.',
    }
    ret ||= {};
    const errorCode = Number(error.code); // Unkown number or undefined .code
    if (errorCode in errorMessages) ret.msg = errorMessages[errorCode];
    else ret.msg = 'Impossible de se connecter pour une raison inconnue.';
    return ret;
  }

  register(e, ret) {
    ret ||= {};
    if (e.code == 400){
      if (e.msgPromise) e.msgPromise().then(msg => { return this.handleError(msg, ret) });
      else return this.handleError(e.msg);
    }
    else if (e.code == 401){
      ret.msg = 'Création de compte non autorisée. Merci de contacter un responsable pour plus d\'informations.';
    }
    else {
      ret.msg = 'Impossible d\'ajouter l\'utilisateur pour une raison inconnue. \nSi les informations fournies sont '
        + 'correctes et que le problème persiste, merci de contacter le support technique.';
    }
    return ret;
  }

  changePassword(e, ret) {
    ret ||= {};
    if (e.code == 400){
      if (e.msgPromise) e.msgPromise().then(msg => { this.translateErrors(msg, ret) });
      else this.translateErrors(e.msg, ret);
    }
    if (e.code == 401){
      ret.msg = 'Changement de mot de passe non autorisée. Merci de contacter un responsable pour plus '
        + 'd\'informations.';
    }
    else {
      ret.msg = 'Impossible de changer le mot de passe pour une raison inconnue. \nSi les informations fournies sont '
        + 'correctes et que le problème persiste, merci de contacter le support technique.';
    }
    return ret;
  }

  translate(e, ret) {
    ret ||= {};

    return ret;
  }

  backgroundLoad(e) { if (e.message === 'noToken' || e.message === 'tokening') return; throw e; } // TODO : Better err
  tryRelog(e) { if (e.message === 'noToken' || e.message === 'tokening') return; throw e; } // TODO : Better err handl
}
