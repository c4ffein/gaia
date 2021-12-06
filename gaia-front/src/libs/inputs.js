// import 'marked';
import * as marked from 'marked';
import DOMPurify from 'dompurify';

export function checkNumberDown(e) { if (!/^([0-9]|)$/.test(e.key) && e.key.length < 2) e.preventDefault(); }
export function sanMaxSpaceIsZero(v, max) { return v === '' ? 0 :  v > max ? max : v; }
export function dashDateToSlashDate(s) { return s?.split('-').reverse().join('/'); }

export function fileSelect(params) {
  return new Promise(resolve => {
    let input = document.getElementById('hiddenUploadElem');
    if (!input) {
      input = document.createElement('input');
      input.setAttribute('id', 'hiddenUploadElement');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', params.accept);
      input.setAttribute('style', 'display: none;');
      document.body.appendChild(input);
    }
    const callback = evt => { evt.preventDefault(); resolve(evt.target.files); };
    input.addEventListener('change', callback, false)
    input.click();
  });
}

export function loadFile(file, accepted) {
  return new Promise((resolve, reject) => {
    if (
      file.type
      && (accepted.includes('image') && file.type.indexOf('image') === -1)
      && (accepted.includes('pdf') && file.type !== 'application/pdf'))
    {
      reject(
        `File ${accepted.includes('image') ? 'noimage ' : ''} ${accepted.includes('pdf') ? 'nopdf ' : ''}.`,
        file.type, file);
    }
    const reader = new FileReader();
    reader.addEventListener('load', event => resolve(event.target.result) );
    reader.readAsDataURL(file);
  });
}

export function loadImage(file) {
  return loadFile(file, ['image']);
}

export function getMetadataForFileList(fileList) { // TODO : Use
  for (const file of fileList) {
    const name = file.name || 'F'; const type = file.type || 'F'; const size = file.size || 'F';
    console.log({file, name, type, size});
  }
}

export function secureOpenNewTab(url) { const newTab = window.open(); newTab.opener = null; newTab.location = url; }

// TODO : SECURITY : REAL BAD : NOT ENOUGH SEE
// https://itnext.io/why-does-markdown-need-to-be-sanitized-and-how-to-do-it-in-vue-390d70cf9574
// https://github.com/cure53/DOMPurify
// https://www.npmjs.com/package/vue-dompurify-html
// https://github.com/cure53/DOMPurify/issues/32
// https://github.com/markedjs/marked
// https://www.raymondcamden.com/2019/11/26/sanitizing-html-in-vuejs
// Uses DOMPurify since sanitize option is deprecated
// Add solution in awesome
export function sMarked(str) { return DOMPurify.sanitize(marked(String(str))); }
