<template lang="pug">
div
  Warning.mx-10(v-if="iAmLogged"
    v-for="warningData in warnings" v-bind:key="warningData.id"
    :obj="warningData.obj" :btn="warningData.btn"
    :type="warningData.type"
    :url="warningData.url" :visioId="warningData.visioId"
    :visioUrl="warningData.visioUrl" :action="warningData.action"
    :hideable="warningData.hideable"
    @hideIt="hideIt"
  ) {{warningData}}
</template>

<script>
import * as h from '@/libs/object-helpers/object-helpers'

import Warning from './Warning.vue'

export default {
  name: 'App',
  components: { Warning },
  data () { return { apiData: this.$api.data, hiddenForms: [] } },
  computed: {
    myUser() { return this.$api.myUser(); },
    myFormsIds() { return h.iA(this.myUser?.forms) ? this.myUser?.forms : []; },
    myForms() { return this.myFormsIds.map(id => this.$api.data?.forms?.[id]).filter(f => !!f); },
    notOverRdvs() { return this.$api.myNotOverRdvs(); },
    warnings() {
      const nextRDVOfList = list => (!list ? undefined : h.oE(list).map(([k, v]) => ({ ...v, id: k }))
        .filter(rdv => !this.apiData.visio || this.apiData.visio.url === rdv.visioUrl)
        .filter(rdv => rdv.oked_by_partner && rdv.oked_by_beneficiary)
        .reduce((rdv0, rdv1) => (rdv0 || rdv1), undefined)); // TODO : Take earlier one,
      const myNextRdv = nextRDVOfList(this.notOverRdvs);
      const myNextWarning = myNextRdv ? { type: 'rdv', visioId: myNextRdv.id, visioUrl: myNextRdv.url } : undefined;
      const formsWarningsMaker = forms => forms?.filter(f => !this.hiddenForms.includes(f.id))?.length > 1 ?
        [{ type: 'allForms', hideable: true }]
        : ((forms || [])
          .filter(() => this.$route.matched.some(({ path }) => path.substring(0, 11) !== '/formulaire'))
          .filter(form => form.warning_needed && !this.hiddenForms.includes(form.id))
          .map(formulaire => ({ type: 'form', id: `form:${formulaire.id}`, obj: formulaire, hideable: true })));// TODO : QUICK POC
      const sanitizeForms = forms => (
        (Array.isArray(forms)
        && !this.iAmPartner && !this.iAmGreat && !this.iAmJustKioskOverseer && String(this.$route.name) !== 'visio'
        ) ? forms : []
      ); // TODO : Fix instead...
      return [
        ...myNextWarning ? [myNextWarning] : [],
        ...formsWarningsMaker(sanitizeForms(this.myForms), true),
      ];// ...nextKioskWarning ? [nextKioskWarning] : [],
    },
    iAmLogged() { return this.$api.iAmLogged(); },
    iAmPartner() { return this.$api.iAmPartner(); },
    iAmGreat() { return this.$api.iAmGreat(); },
    iAmJustKioskOverseer() { return this.$api.iAmJustKioskOverseer(); },
    kioskModeEnabled() { return this.apiData.kioskModeEnabled(); },
  },
  methods: {
    hideIt([type, id]) {
      if(type === 'allForms') this.myForms.forEach(
        f => { if (!this.hiddenForms.includes(f.id)) this.hiddenForms.push(f.id); }
      );
      if(type === 'form') if (!this.hiddenForms.includes(id)) this.hiddenForms.push(id);
    },
  },
}
</script>
