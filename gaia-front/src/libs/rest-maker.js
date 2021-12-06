import Vue from 'vue';
// import ErrorHandler from '../errors.js';
import * as h from '@/libs/object-helpers/object-helpers'

const deepCopy = (oldData, newData) => {
  Object.keys(oldData).forEach(key => {
    if (key in newData) {
      if(typeof key === 'object' && key !== null) deepCopy(oldData[key], newData[key]);
      else Vue.set(oldData, key, newData[key]);
    }
    Vue.delete(oldData, key);
  });
  Object.keys(newData).forEach(k => { if (!oldData[k]) Vue.set(oldData, k, newData[k]); } );
}


// TODO : check security of object attributes
const makeRest = (cls, rIdName, items) => {
  cls.prototype.listenerS = {};
  cls.prototype.setListeners = function() { h.oE(cls.prototype.listenerS).map(
    ([k, v]) => { if(v) this[`registerlistener${k}s`]() }); }
  cls.prototype[`getRId`] = function() { return this.data?.[rIdName]; }
  cls.prototype[`tRIdChngd`] = function(backId) { if (backId !== this.getRId()) throw Error(
    'Received response for a request after authentication change.'
  ); }
  h.oE(items).forEach(([key, value]) => {
    if(value.listen) cls.prototype.listenerS[key] = true;
    cls.prototype[`list${key}s`] = function() {
      const b = this.getRId();
      return this.f.get(`${value.api}`).then(r => {
        this.tRIdChngd(b);
        r.results.forEach(o => this[`cch${key}`](o.id, o));
        if (r.latest_update) Vue.set(this.data.updates, value.dS, r.latest_update);
      } );
      //   if (params && params.nextOf) return this.f.get(`users`); // TODO
      //   else return this.f.get(`users`);
    }
    cls.prototype[`get${key}`] = function(id) {
      const b = this.getRId();
      return this.f.get(`${value.api}/${id}`).then(r => {
        this.tRIdChngd(b);
        return this[`cch${key}`](id, r)
      });
    }
    cls.prototype[`load${key}`] = function(id) {
      if(!this[`obt${key}`](id)) {
        this[`cch${key}`](id, {});
        this[`get${key}`](id);
      }
      return this[`obt${key}`](id);
    }
    cls.prototype[`cch${key}`] = function(id, obj) {
      if(value.expendablesM) h.oE(value.expendablesM).forEach(([e, nApi]) => {
        if (!!obj[e] && !h.iA(obj[e])) Vue.set(obj, e, h.oE(obj[e]).map(([k, v]) => this[`cch${nApi}`](k, v)));
        else if (h.iA(obj[e]) && h.iO(obj[e][0])) {
          Vue.set(obj, e, h.oE(obj[e].map(([k, v]) => this[`cch${nApi}`](k, v))));
        } else if(obj[e]) return;
        console.log('makeRest cch found expendable');  // TODO Delete once tested correctly
      } );
      if(value.expendablesO) h.oE(value.expendablesO).forEach(([e, nApi]) => {
        if (obj[e] && h.iO(obj[e])) {
          this[`cch${nApi}`](obj[e].id, obj[e]);
          Vue.set(obj, e, obj[e].id);
        }
      } );
      Vue.set(this.data[value.dS], id, obj); return obj;
    }
    cls.prototype[`obt${key}`] = function(id) {
      return this.data[value.dS]?.[id];
    }
    cls.prototype[`patch${key}`] = function(id, data) {
      const b = this.getRId();
      return this.f.patch(`${value.api}/${id}`, data).then(r => {
        this.tRIdChngd(b);
        return h.oE(r).map(([k, v]) => Vue.set(this.data[value.dS][id], k, v));
      });
    }
    cls.prototype[`put${key}`] = function(id, data) {
      const b = this.getRId();
      return this.f.put(`${value.api}/${id}`, data).then(r => {
        this.tRIdChngd(b);
        return h.oE(r).map(([k, v]) => Vue.set(this.data[value.dS][id], k, v));
      });
    }
    cls.prototype[`delete${key}`] = function(id) {
      const b = this.getRId();
      return this.f.delete(`${value.api}/${id}`).then(r => {
        this.tRIdChngd(b);
        return h.oE(r).map(([k, v]) => Vue.set(this.data[value.dS][id], k, v));
      });
    }
    cls.prototype[`post${key}`] = function(data) {
      const b = this.getRId();
      return this.f.post(`${value.api}`, data ).then(r => {
        this.tRIdChngd(b);
        return this[`cch${key}`](r.id, r);
      });
    }
    cls.prototype[`registerlistener${key}s`] = function() {
      setTimeout(() => { this[`registerlistener${key}s`](); this[`check${key}Changes`](); }, 3000);
    }
    cls.prototype[`check${key}Changes`] = function() {
      if (!this.data.updates[value.dS]) this[`load${key}s`]();
      else this.f.get(`watch/${value.api}/${this.data.updates[value.dS]}`).then(res => {
        return res.updated ? this[`load${key}s`]() : {}
      })
    }
    cls.prototype[`load${key}s`] = function() {
      this[`list${key}s`]().catch(e => this.errorHandler.backgroundLoad(e));
    }
  });
}


export { deepCopy, makeRest }
