const ID_TOKEN_UK = 'id_token_user';

export const getUT = () => { return window.localStorage.getItem(ID_TOKEN_UK); };
export const saveUT = token => { window.localStorage.setItem(ID_TOKEN_UK, token); };
export const destroyUT = () => { window.localStorage.removeItem(ID_TOKEN_UK); };


class ResponseError extends Error {
  constructor(response, msg) {
    super();
    this.code = response.status;
    this.msg = msg;
    this.response = response;
    if (!msg) this.msgPromise = () => this.response.json();
  }
}

// TODO : Polling check localstorage has changed?.. Keep other code as same, except for refreshing access token?
// Use a callback to show modal?

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//- TODO : Logic in API so that when userId changed, reload data, as we could have downloaded objects with missing fields

export default class Fetcher {
  constructor(backendAddress, relogCallback, cleanApiCache, setUserId, jwtDecode) {
    this.backendAddress = backendAddress.slice(-1) === '/' ? backendAddress.slice(0, -1) : backendAddress;
    this.relogCallback = relogCallback;  // Asks Router to go to Login page if needed
    this.cleanApiCache = cleanApiCache;  // Cleans cache. Prepare for relog with another account. Will be used when token can change outside of login or logout functions
    this.setUserId = setUserId;  // set userId of api
    this.jwtDecode = jwtDecode;
    this.userAccessToken = undefined;
    this.userRefreshToken = getUT();
    this.kioskToken = null;
    // Prevent race conditions
    this.tokenizer = null;
    this.logouting = false;
  }

  getUserToken() { return this.userAccessToken; }
  // TODO : cache id, in exported xxxUT, populate on get, remove on destroy
  getUID() { return getUT() ? this.jwtDecode(getUT()).user_id : null; }

  async _simpleFetch(verb, url, data, noTrail) {
    url = url.slice(-1) === '/' ? noTrail ? url.slice(0, -1) : url : noTrail ? url : `${url}/`;
    return fetch(`${this.backendAddress}/${url}`, {
      method: verb,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ... this.getUserToken() ? { Authorization: `Bearer ${this.getUserToken()}` } : {},
        ... this.kioskToken ? { KioskCustomAuth: `Bearer ${this.kioskToken}` } : {},
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify((this.kioskToken && data) ? { ...data, embedded_kiosk_token: this.kioskToken } : data),
    })
  }

  async _fetchWaitIfTokenizer(verb, url, data, noTrail) {  // TODO : userId before/after check?
    if (this.tokenizer) { return Promise.race([this.tokenizer]).then(() => this._simpleFetch(verb, url, data, noTrail)); }
    return this._simpleFetch(verb, url, data, noTrail);
  }

  async _fetchRaiseIfTokenizer(verb, url, data, noTrail) {
    if (this.tokenizer) { return new Promise(() => { throw new Error('tokening') }); }
    return this._simpleFetch(verb, url, data, noTrail);
  }

  // TODO : retry for else than no auth?
  // Either another method extending simpleFetch as
  // https://medium.com/to-err-is-aaron/detect-network-failures-when-using-fetch-40a53d56e36
  // or use https://github.com/synapsestudios/fetch-client/blob/master/src/client.js
  async fetch(verb, url, data, noRetryIfNoAuth, noTrail) {
    // We should be connected but we aren't
    if (!!getUT() && !this.getUserToken()) {
      if (noRetryIfNoAuth) throw new Promise(() => { throw new Error('failed getting token') });
      return this.refresh().then(() => this.fetch(verb, url, data, true, noTrail));
    }
    const f = this._fetchWaitIfTokenizer(verb, url, data, noTrail).then(response => {
      if (response.ok) return response.status === 204 ? Promise.resolve({}) : response.json();
      else if (response.status === 401) { return response.json().then(json => {
        if (noRetryIfNoAuth) throw new ResponseError(response, json);
        if (json.code === 'token_not_valid' || json.detail === 'Authentication credentials were not provided.'){
          return (this.tokenizer ? Promise.race([this.tokenizer]) : this.refresh()
          ).then(() => this.fetch(verb, url, data, true, noTrail));
        } else throw new ResponseError(response, json);
      }); }
      else throw new ResponseError(response);
    });
    return f;
  }

  async fetchWillToken(verb, url, data, wait) {
    // TODO OOOOOOOOOOOOO JUST OPTIONAL WAIT?
    const f = (wait ? this._fetchWaitIfTokenizer(verb, url, data) : this._fetchRaiseIfTokenizer(verb, url, data)).then(response => {
      if (response.ok) return response.status === 204 ? Promise.resolve({}) : response.json();
      else if (response.status === 401) { return response.json().then(json => {
        throw new ResponseError(response, json);
      }); }
      else throw new ResponseError(response);
    }).then(resp => { this.stopTokening(resp); return resp;
    }).catch(e => { this.stopTokening({}); throw e; });
    this.tokenizer = f;
    return f;
  }

  stopTokening(r) {
    this.tokenizer = null;
    // TODO : save in localstorage of refresh token if present?
    if (!this.logouting) {
      if (r.refresh) this.userRefreshToken = r.refresh;
      // Raises error if can't log token. So both userId and token are not updated.
      if (r.access) { this.setUserId(this.jwtDecode(r.access).user_id); this.userAccessToken = r.access; }
    }
    else this.logouting = false;
  }

  async login(data) {
    return this.fetchWillToken('POST', 'api/token/', data).then(ret => {
      saveUT(this.userRefreshToken);
      delete ret.refresh;
      delete ret.access;
      return ret;
    });
  }

  async refresh() {
    if (!getUT()) throw new Error('noToken');
    // if (this.userRefreshToken !== getUT()) { this.cleanApiCache(); this.userRefreshToken = getUT(); }  // TODO : Enough for future synced token between tabs?
    return this.fetchWillToken('POST', 'api/token/refresh/', { refresh: this.userRefreshToken }, true).then(r => {
      delete r.access;
      return r;
    }).catch(e => {
      if (e.code === 401 && e.msg.code === 'token_not_valid' || e.message === 'noToken') this.relogCallback(true);
      throw e;
    });
  }

  async logout() {  // TODO : Revoke token etc, throw error
    if (this.tokenizer) this.logouting = true;
    this.userRefreshToken = undefined;
    this.userAccessToken = undefined;
    destroyUT();
  }

  async get(url, data, noRetry) { return this.fetch('GET', url, data, noRetry); }
  async post(url, data, noRetry) { return this.fetch('POST', url, data, noRetry); }
  async put(url, data, noRetry) { return this.fetch('PUT', url, data, noRetry); }
  async patch(url, data, noRetry) { return this.fetch('PATCH', url, data, noRetry); }
  async delete(url, data, noRetry) { return this.fetch('DELETE', url, data, noRetry); }
  async getNT(url, data, noRetry) { return this.fetch('GET', url, data, noRetry, true); }
}
