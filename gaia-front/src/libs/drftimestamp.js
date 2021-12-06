/////////////////////////////////////////
// These functions handle drf strings  //
/////////////////////////////////////////

export function prettyDate(s) {
  const d = new Date(s); return `${d.getDate()}/${d ? d.getMonth()+1 : ''}/${d.getFullYear()}`;
}
export function prettyTime(s) {
  const d = new Date(s); return `${d.getHours()}h${d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes()}`;
}


/////////////////////////////
// Handle js dates         //
/////////////////////////////

// TODO : SEE https://stackoverflow.com/questions/1643320/get-month-name-from-date first answer?
export function monthName(date){
  return (date === undefined || !date.getMonth ) ? '' : [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre',
    'Décembre'
  ][date?.getMonth()];
}

export const monthNamesFr = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre',
  'Décembre'
]

// Get the Monday of the real time current week.
export function getMonday(d) {
  const m = new Date(d.getTime()); m.setDate(m.getDate() - (m.getDay() || 7) + 1);  return m;
}

export function frDate(date) {
  return `${date.getDate()} ${monthName(date)} ${date.getFullYear()}`;
}

export function copyDMY(d, s) {
  d.setFullYear(s.getFullYear()); d.setMonth(s.getMonth()); d.setDate(s.getDate());
}

export function copyMHDMY(d, s) {
  d.setFullYear(s.getFullYear()); d.setMonth(s.getMonth()); d.setDate(s.getDate());
  d.setHours(s.getHours()); d.setMinutes(s.getMinutes());
}

export function nDateAddDays(s, days) {
  const r = new Date(s); r.setDate(r.getDate() + days); return r;
}
