import { FIREBASE_CONFIG } from './config.js';
import { WEEKS, RAINY_DAY } from './plan.js';
import { THEMES } from './library.js';

/* ───────────── helpers ───────────── */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const first = n => (n || '').split(/[ @]/)[0];
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
const todayISO = () => new Date().toLocaleDateString('en-CA');
const fmtDate = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
const mat = m => Array.isArray(m) ? { e: m[0], t: m[1] } : m; // materials/bingo can be [emoji, text] or {e, t}
const parseWid = v => /^\d+$/.test(String(v)) ? +v : String(v);

const KID = {
  evie: { name: 'Evie', e: '🌸' },
  colbie: { name: 'Colbie', e: '⭐' },
  both: { name: 'Evie & Colbie', e: '🌸⭐' }
};
const SUBJ = {
  Literacy: ['📖', '#D6457F'], Maths: ['🔢', '#2F7DE1'], Science: ['🔬', '#1F9D63'], Creative: ['🎨', '#E8782E'],
  Outdoor: ['🌳', '#1F9D63'], Move: ['🤸', '#8E5BD3'], Story: ['📚', '#C2478F'], PSHE: ['💛', '#B88200'],
  Music: ['🎵', '#2B93B3'], Cooking: ['🍳', '#D9561F'], Geography: ['🗺️', '#2A8C8C'], History: ['⏳', '#8A6D3B'], Out: ['🥾', '#1F7A4D']
};
const REACT = [['😍', 'Loved it'], ['🙂', 'Liked it'], ['😐', 'Meh'], ['😴', 'Tired']];
const SKILLS = [['communication', '🗣️', 'Communication'], ['literacy', '📖', 'Early literacy'], ['numeracy', '🔢', 'Numeracy'],
  ['physical', '🤸', 'Physical'], ['independence', '🧦', 'Independence'], ['creativity', '🎨', 'Creativity']];
const SUB2SKILL = { Literacy: 'literacy', Maths: 'numeracy', Move: 'physical', Outdoor: 'physical', Out: 'physical', Creative: 'creativity', Music: 'creativity',
  PSHE: 'independence', Cooking: 'independence', Story: 'communication', Science: 'communication', Geography: 'communication', History: 'communication' };

/* ───────────── activity library (themes + every built-in activity, for swapping) ───────────── */
const LIB = [], THEME_CHIPS = [];
THEMES.forEach(t => {
  THEME_CHIPS.push({ id: t.id, label: `${t.emoji} ${t.title}` });
  t.activities.forEach((a, i) => LIB.push({ ...a, id: `${t.id}-${i}`, theme: t.id }));
});
WEEKS.forEach(w => {
  THEME_CHIPS.push({ id: 'w' + w.id, label: `${w.emoji} ${w.title}` });
  w.days.forEach((d, di) => d.sessions.forEach((s, si) => { if (s.sub !== 'Out') LIB.push({ ...s, id: `b${w.id}_${di}_${si}`, theme: 'w' + w.id }); }));
});
const LIBID = Object.fromEntries(LIB.map(a => [a.id, a]));

/* ───────────── state ───────────── */
const state = {
  user: null, denied: false, entries: [], checks: {}, settings: {}, customWeeks: [],
  tab: 'today', planWeek: null, filter: 'all', skill: null, openDays: new Set(), menu: null, pendingRender: false
};
const allWeeks = () => [...WEEKS, ...state.customWeeks];
const wk = id => allWeeks().find(w => String(w.id) === String(id)) || WEEKS[0];
const nextWeekOf = id => { const a = allWeeks(); const i = a.findIndex(w => String(w.id) === String(id)); return a[i + 1] || null; };
const curWeekId = () => { const id = state.settings.week || 1; return allWeeks().some(w => String(w.id) === String(id)) ? id : 1; };
const weekLabel = w => typeof w.id === 'number' ? `Week ${w.id}: ${w.title}` : w.title;
const weekShort = w => typeof w.id === 'number' ? `Week ${w.id}` : w.title;

/* ───────────── backends ───────────── */
const configured = FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && !String(FIREBASE_CONFIG.apiKey).startsWith('YOUR_');
let backend;

async function makeFirebaseBackend() {
  const base = 'https://www.gstatic.com/firebasejs/10.14.1/';
  const [appM, authM, fs] = await Promise.all([
    import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')
  ]);
  const app = appM.initializeApp(FIREBASE_CONFIG);
  const auth = authM.getAuth(app);
  const db = fs.initializeFirestore(app, {
    localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() })
  });
  const mapUser = u => u ? { uid: u.uid, name: u.displayName || u.email || 'Parent', email: u.email, photo: u.photoURL, verified: u.emailVerified } : null;
  const authMsg = e => ({
    'auth/invalid-credential': 'Wrong email or password.',
    'auth/wrong-password': 'Wrong email or password.',
    'auth/user-not-found': 'Wrong email or password.',
    'auth/invalid-email': 'That email address doesn’t look right.',
    'auth/email-already-in-use': 'That email already has an account. Use Sign in, or Forgot password.',
    'auth/weak-password': 'Password needs at least 6 characters.',
    'auth/too-many-requests': 'Too many tries. Wait a few minutes and try again.',
    'auth/network-request-failed': 'No signal. Try again when you’re online.'
  }[e.code] || ('Sign-in problem: ' + (e.code || e.message)));
  let userCb = () => {};
  return {
    mode: 'firebase',
    onUser(cb) {
      userCb = cb;
      authM.getRedirectResult(auth).catch(e => toast('Sign-in problem: ' + (e.code || e.message)));
      authM.onAuthStateChanged(auth, u => cb(mapUser(u)));
    },
    async signInEmail(email, pw) { try { await authM.signInWithEmailAndPassword(auth, email, pw); } catch (e) { toast(authMsg(e)); } },
    async signUpEmail(email, pw) {
      try {
        const c = await authM.createUserWithEmailAndPassword(auth, email, pw);
        await authM.sendEmailVerification(c.user);
        toast('Account created. Check your email to verify it.');
      } catch (e) { toast(authMsg(e)); }
    },
    async resetPassword(email) {
      if (!email) { toast('Type your email in the box first'); return; }
      try { await authM.sendPasswordResetEmail(auth, email); toast('Password reset email sent'); } catch (e) { toast(authMsg(e)); }
    },
    async resendVerify() { try { await authM.sendEmailVerification(auth.currentUser); toast('Verification email sent. Check spam too.'); } catch (e) { toast(authMsg(e)); } },
    async recheckVerify() {
      try {
        await auth.currentUser.reload(); await auth.currentUser.getIdToken(true);
        userCb(mapUser(auth.currentUser));
        if (!auth.currentUser.emailVerified) toast('Not verified yet. Tap the link in the email first.');
      } catch (e) { toast(authMsg(e)); }
    },
    async signIn() {
      const p = new authM.GoogleAuthProvider();
      try { await authM.signInWithPopup(auth, p); }
      catch (e) {
        if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/cancelled-popup-request'].includes(e.code)) {
          await authM.signInWithRedirect(auth, p);
        } else if (e.code !== 'auth/popup-closed-by-user') { toast('Sign-in problem: ' + (e.code || e.message)); }
      }
    },
    signOut: () => authM.signOut(auth),
    watchEntries: (cb, err) => fs.onSnapshot(fs.collection(db, 'll_entries'), s => cb(s.docs.map(d => ({ ...d.data(), id: d.id }))), err),
    saveEntry: e => fs.setDoc(fs.doc(db, 'll_entries', e.id), e),
    deleteEntry: id => fs.deleteDoc(fs.doc(db, 'll_entries', id)),
    watchChecks: (cb, err) => fs.onSnapshot(fs.collection(db, 'll_checks'), s => { const o = {}; s.docs.forEach(d => { o[d.id] = d.data(); }); cb(o); }, err),
    saveCheck: (id, data) => fs.setDoc(fs.doc(db, 'll_checks', id), data, { merge: true }),
    watchSettings: (cb, err) => fs.onSnapshot(fs.doc(db, 'll_settings', 'main'), s => cb(s.exists() ? s.data() : {}), err),
    saveSettings: d => fs.setDoc(fs.doc(db, 'll_settings', 'main'), d, { merge: true }),
    watchWeeks: (cb, err) => fs.onSnapshot(fs.collection(db, 'll_weeks'), s => cb(s.docs.map(d => ({ ...d.data(), id: d.id }))), err),
    saveWeek: w => fs.setDoc(fs.doc(db, 'll_weeks', w.id), w),
    deleteWeek: id => fs.deleteDoc(fs.doc(db, 'll_weeks', id))
  };
}

const mergeOneLevel = (cur, d) => {
  const next = { ...cur };
  for (const [k, v] of Object.entries(d)) next[k] = (v && typeof v === 'object' && !Array.isArray(v)) ? { ...(cur[k] || {}), ...v } : v;
  return next;
};

function makeLocalBackend() {
  const KEY = 'little-learners-preview-v1';
  let data = { entries: {}, checks: {}, settings: {}, weeks: {} };
  try { data = { ...data, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { /* fresh */ }
  const subs = new Set();
  const persist = () => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch { toast('Preview storage is full. Connect Firebase for unlimited photos.'); }
    subs.forEach(f => f());
  };
  const watch = fn => { subs.add(fn); setTimeout(fn, 0); return () => subs.delete(fn); };
  return {
    mode: 'local',
    onUser(cb) { cb({ uid: 'preview', name: 'Preview', email: '', photo: '' }); },
    signIn() {}, signOut() {},
    watchEntries: cb => watch(() => cb(Object.values(data.entries))),
    saveEntry(e) { data.entries[e.id] = e; persist(); return Promise.resolve(); },
    deleteEntry(id) { delete data.entries[id]; persist(); return Promise.resolve(); },
    watchChecks: cb => watch(() => cb(JSON.parse(JSON.stringify(data.checks)))),
    saveCheck(id, d) { data.checks[id] = mergeOneLevel(data.checks[id] || {}, d); persist(); return Promise.resolve(); },
    watchSettings: cb => watch(() => cb({ ...data.settings })),
    saveSettings(d) { data.settings = { ...data.settings, ...d }; persist(); return Promise.resolve(); },
    watchWeeks: cb => watch(() => cb(Object.values(data.weeks).map(w => JSON.parse(JSON.stringify(w))))),
    saveWeek(w) { data.weeks[w.id] = w; persist(); return Promise.resolve(); },
    deleteWeek(id) { delete data.weeks[id]; persist(); return Promise.resolve(); }
  };
}

/* ───────────── check-doc helpers ───────────── */
const checkDoc = wid => state.checks['week-' + wid] || {};
const isDone = (wid, key) => !!(checkDoc(wid).done || {})[key];
const extras = wid => checkDoc(wid).extra || [];
function syncErr(e) { console.error(e); toast(e && e.code === 'permission-denied' ? 'Not allowed. Check the Firestore rules.' : 'Could not save, will retry when online.'); }

function patchCheck(wid, d) {
  const id = 'week-' + wid;
  state.checks[id] = mergeOneLevel(state.checks[id] || {}, d);
  render();
  backend.saveCheck(id, d).catch(syncErr);
}
const setDone = (wid, key, val) => patchCheck(wid, { done: { [key]: val } });
const setExtras = (wid, list) => patchCheck(wid, { extra: list });
// status: planned | done | adapted | skipped. Old single ticks (done=true) still read as "done".
const sessStatus = (wid, key) => { const c = checkDoc(wid); return (c.status || {})[key] || ((c.done || {})[key] ? 'done' : 'planned'); };
const setStatus = (wid, key, val, note = '') => patchCheck(wid, { status: { [key]: val }, done: { [key]: false }, adapt: { [key]: note } });

// The activity actually shown in a slot: the planned one, or a swapped-in one from the library.
function getSess(w, di, si) {
  const base = w.days[di].sessions[si];
  const swapId = (checkDoc(w.id).swaps || {})[`s${di}_${si}`];
  const lib = swapId && LIBID[swapId];
  return lib ? { ...lib, core: !!base.core, swapped: true } : { ...base, swapped: false };
}
function splitDay(w, di) {
  const core = [], opt = [];
  w.days[di].sessions.forEach((_, si) => { (getSess(w, di, si).core ? core : opt).push(si); });
  return { core, opt };
}
function enjoyed(w) {
  let n = 0;
  w.days.forEach((d, di) => d.sessions.forEach((_, si) => { const s = sessStatus(w.id, `s${di}_${si}`); if (s === 'done' || s === 'adapted') n++; }));
  return n;
}
function matProgress(w) {
  const ex = extras(w.id);
  let done = 0;
  w.materials.forEach((_, i) => { if (isDone(w.id, 'm' + i)) done++; });
  ex.forEach(x => { if (isDone(w.id, x.id)) done++; });
  return { total: w.materials.length + ex.length, done };
}

/* ───────────── themed weeks ───────────── */
function makeWeek(t, id) {
  const acts = t.activities, norm = a => ({ ...a, core: true });
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((name, d) => ({
    name, focus: acts[d].title,
    sessions: [norm(acts[d]), norm(acts[4 + d]), norm(acts[8 + d])]
  }));
  const o = t.outing;
  days.push({
    name: 'Friday', focus: o.title,
    outing: { emoji: o.emoji, title: o.title, where: o.where, desc: o.desc, bring: [...o.bring], bingo: o.bingo.map(m => ({ e: m[0], t: m[1] })) },
    sessions: [
      { sub: 'Out', title: 'Get ready', desc: 'Pack the bag together and look at the bingo card. What do you think you will spot?', min: 15, mats: ['Bingo cards', 'Bag'], colbie: 'Choose her own snack for the bag.', core: false },
      { sub: 'Out', title: o.title, desc: o.desc, min: 90, mats: o.bring.slice(0, 4), colbie: '', core: true },
      { sub: 'Creative', title: 'Draw your favourite bit', desc: 'Draw the best thing you saw or did today and tell someone at home all about it.', min: 15, mats: ['Paper', 'Pens'], colbie: 'Draw anything she liked.', core: false }
    ]
  });
  return {
    id, custom: true, theme: t.id, created: Date.now(), emoji: t.emoji, title: t.title, color: t.color, tint: t.tint,
    blurb: t.blurb, tip: t.tip, materials: t.materials.map(m => ({ e: m[0], t: m[1] })), days
  };
}
function createThemedWeek(themeId, makeCurrent) {
  const t = THEMES.find(x => x.id === themeId);
  if (!t) return;
  const week = makeWeek(t, 'c_' + Date.now().toString(36));
  state.customWeeks.push(week);
  state.planWeek = week.id;
  backend.saveWeek(week).catch(syncErr);
  if (makeCurrent) { state.settings.week = week.id; backend.saveSettings({ week: week.id }).catch(syncErr); state.tab = 'today'; }
  else state.tab = 'plan';
  closeModal(); render(); window.scrollTo(0, 0);
  toast(makeCurrent ? `${t.title} is now our week 🎉` : `${t.title} added to the plan`);
}

/* ───────────── render ───────────── */
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 3200);
}

function render() {
  const ae = document.activeElement;
  if (ae && ae.tagName === 'INPUT' && ae.closest('#view')) { state.pendingRender = true; return; }
  const view = $('#view'), nav = $('#nav');
  if (!state.user) { nav.innerHTML = ''; view.innerHTML = viewLogin(); return; }
  if (state.user.verified === false) { nav.innerHTML = ''; view.innerHTML = viewVerify(); return; }
  if (state.denied) { nav.innerHTML = ''; view.innerHTML = viewDenied(); return; }
  if (state.planWeek == null || !allWeeks().some(w => String(w.id) === String(state.planWeek))) state.planWeek = curWeekId();
  const views = { today: viewToday, plan: viewPlan, list: viewList, journal: viewJournal, more: viewMore };
  view.innerHTML = (backend.mode === 'local' ? '<div class="pv">Preview mode: saved on this device only. Connect Firebase to share between phones.</div>' : '') + views[state.tab]();
  const tabs = [['today', '🏠', 'Today'], ['plan', '📅', 'Plan'], ['list', '✅', 'Checklist'], ['journal', '📖', 'Journal'], ['more', '⋯', 'More']];
  nav.innerHTML = tabs.map(([k, ic, l]) => `<button data-a="tab" data-tab="${k}" class="${state.tab === k ? 'on' : ''}"><span class="ic">${ic}</span>${l}</button>`).join('');
}

function viewLogin() {
  return `<div class="login">
    <img src="icons/icon-192.png" alt="">
    <h1 class="fred" style="font-size:1.8rem">Evie &amp; Colbie’s<br>Learning Journal</h1>
    <p class="muted bold">Plan the week, tick things off, and keep every memory.</p>
    <button class="btn evie" data-a="signin" style="padding:14px 26px;font-size:1rem">Sign in with Google</button>
    <p class="tiny muted bold" style="margin:14px 0 8px">or with an email and password</p>
    <form data-form="login" class="loginform">
      <input name="email" type="email" autocomplete="email" placeholder="Email" required>
      <input name="pw" type="password" autocomplete="current-password" placeholder="Password (6+ characters)" required minlength="6">
      <div class="row" style="justify-content:center;gap:8px"><button class="btn soft" type="submit">Sign in</button>
        <button class="btn soft" type="button" data-a="signup">Create account</button></div>
      <button class="linkbtn" type="button" data-a="forgot">Forgot password?</button>
    </form>
    <p class="tiny muted">Only the two family accounts can get in.</p>
  </div>`;
}
function viewVerify() {
  return `<div class="login"><div style="font-size:3rem">✉️</div>
    <h2 class="fred">Please verify your email</h2>
    <p class="muted bold small">We sent a link to ${esc(state.user.email)}. Tap it, then come back here. Check spam if you can’t see it.</p>
    <button class="btn evie" data-a="recheck">I’ve verified it</button>
    <div class="row" style="justify-content:center;gap:8px;margin-top:10px"><button class="btn soft sm" data-a="resend">Send again</button><button class="btn soft sm" data-a="signout">Sign out</button></div></div>`;
}
function viewDenied() {
  return `<div class="login"><div style="font-size:3rem">🔒</div>
    <h2 class="fred">This account isn’t on the family list</h2>
    <p class="muted bold small">You’re signed in as ${esc(state.user.email)}. Add this email to the Firestore rules, or sign in with a different account.</p>
    <button class="btn" data-a="signout">Sign out</button></div>`;
}

function hero(w, extra = '') {
  const n = enjoyed(w);
  return `<div class="hero" style="--wk:${w.color};--wk-t:${w.tint}">
    <div class="row"><div class="big">${w.emoji}</div><div class="grow"><h2>${esc(weekLabel(w))}</h2><div class="small bold" style="opacity:.75">${esc(w.blurb)}</div></div></div>
    <div class="pill">${n ? `${n} ${n === 1 ? 'activity' : 'activities'} enjoyed so far` : 'No ticks needed, just enjoy it'}</div>${extra}</div>`;
}

function sessionRow(w, di, si) {
  const s = getSess(w, di, si), key = `s${di}_${si}`, st = sessStatus(w.id, key);
  const note = (checkDoc(w.id).adapt || {})[key];
  const [ic, col] = SUBJ[s.sub] || ['✨', '#444'];
  const menu = state.menu === `${w.id}:${key}`;
  const sym = { done: '✓', adapted: '✎', skipped: '–', planned: '' }[st];
  const tag = { adapted: ' · did something else', skipped: ' · skipped', done: '', planned: '' }[st];
  const chip = (v, label) => `<button class="chip ${st === v ? 'on' : ''}" data-a="status" data-w="${w.id}" data-k="${key}" data-v="${v}">${label}</button>`;
  return `<div class="sess ${st}">
    <button class="tick ${st}" data-a="quick" data-w="${w.id}" data-k="${key}" aria-label="Mark as done">${sym}</button>
    <div class="grow">
      <div class="s-sub" style="color:${col}">${ic} ${s.sub === 'Out' ? 'Out and about' : s.sub} · ${s.min} min${s.swapped ? ' · swapped in' : ''}${tag}</div>
      <div class="s-title">${esc(s.title)}</div>
      <div class="s-desc">${esc(s.desc)}</div>
      ${s.mats.length ? `<div class="mats">${s.mats.map(m => `<span class="mat">${esc(m)}</span>`).join('')}</div>` : ''}
      ${s.colbie ? `<div class="cnote"><b>⭐ Colbie:</b> ${esc(s.colbie)}</div>` : ''}
      ${st === 'adapted' && note ? `<div class="adnote">Instead: ${esc(note)}</div>` : ''}
      <div class="s-actions">
        <button class="btn soft sm" data-a="compose" data-w="${w.id}" data-d="${di}" data-s="${si}">📸 Log it</button>
        <button class="btn soft sm" data-a="swap" data-w="${w.id}" data-d="${di}" data-s="${si}">🔄 Swap</button>
        <button class="btn soft sm" data-a="menu" data-w="${w.id}" data-k="${key}" aria-expanded="${menu}">⋯</button>
      </div>
      ${menu ? `<div class="statusbar">${chip('done', '✓ Done')}${chip('adapted', '✎ Did something else')}${chip('skipped', '⏭ Skip')}${chip('planned', '↺ Not yet')}</div>` : ''}
    </div></div>`;
}

function daySessionsHtml(w, di) {
  const { core, opt } = splitDay(w, di);
  let h = core.map(si => sessionRow(w, di, si)).join('');
  if (opt.length) {
    const k = `o${w.id}-${di}`;
    h += `<details class="more" data-day="${k}" ${state.openDays.has(k) ? 'open' : ''}><summary>＋ ${opt.length} more idea${opt.length > 1 ? 's' : ''} if you fancy it</summary>${opt.map(si => sessionRow(w, di, si)).join('')}</details>`;
  }
  return h;
}

function outingCard(w) {
  const o = w.days[4].outing;
  return `<div class="card" style="background:${w.tint}">
    <div class="row"><div style="font-size:2rem">${o.emoji}</div><div><div class="fred" style="font-size:1.1rem">${esc(o.title)}</div><div class="small bold muted">${esc(o.where)}</div></div></div>
    <p class="small mt">${esc(o.desc)}</p>
    <div class="small bold mt">Bring:</div>
    <div class="mats">${o.bring.map(b => `<span class="mat" style="background:#fff">${esc(b)}</span>`).join('')}</div>
    <button class="btn soft sm mt" data-a="print" data-p="bingo" data-w="${w.id}">🖨️ Print bingo cards</button></div>`;
}

function viewToday() {
  const w = wk(curWeekId());
  const dow = new Date().getDay();
  const di = dow >= 1 && dow <= 5 ? dow - 1 : -1;
  let h = `<h1 class="h-page">Hi ${esc(first(state.user.name))} 👋</h1><div class="sub">${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>`;
  h += hero(w, `<button class="btn sm mt" data-a="newtheme">✨ Follow a new interest</button>`);
  if (di >= 0) {
    const day = w.days[di];
    h += `<div class="card"><div class="fred" style="font-size:1.15rem">Today: ${day.name}</div>
      <div class="small bold muted mb">${esc(day.focus)}. Do what suits the mood. Skipping, swapping and doing something else are all fine.</div>${daySessionsHtml(w, di)}</div>`;
    if (di === 4) h += outingCard(w);
  } else {
    h += `<div class="card"><div style="font-size:2rem">🧸</div><div class="fred" style="font-size:1.15rem">It’s the weekend</div>
      <p class="small muted bold mt">No lessons today. If something lovely happened, add it to the journal.</p>
      <button class="btn evie mt" data-a="compose">+ Add a memory</button></div>`;
  }
  const mp = matProgress(w), nx = nextWeekOf(w.id);
  h += `<div class="card"><div class="row between"><div><div class="bold">✅ This week’s kit</div><div class="small muted bold">${mp.done} of ${mp.total} ready</div></div><button class="btn soft sm" data-a="tab" data-tab="list">Open checklist</button></div>`;
  if (nx) { const np = matProgress(nx); h += `<div class="small muted bold mt">Next: ${esc(nx.title)}, ${np.done} of ${np.total} ready</div>`; }
  return h + '</div>';
}

function viewPlan() {
  const w = wk(state.planWeek), isCur = String(w.id) === String(curWeekId());
  const dow = new Date().getDay(), todayDi = dow >= 1 && dow <= 5 ? dow - 1 : -1;
  let h = `<h1 class="h-page">Plan</h1><div class="sub">Use it like a menu, not a timetable.</div>`;
  h += `<div class="chips">${allWeeks().map(x => `<button class="chip ${String(x.id) === String(w.id) ? 'on' : ''}" data-a="planweek" data-w="${x.id}">${x.emoji} ${esc(weekShort(x))}</button>`).join('')}<button class="chip" data-a="newtheme" data-mode="add">＋ New week</button></div>`;
  h += hero(w, (isCur ? '<div class="small bold mt">✓ This is our current week</div>' : `<button class="btn sm mt" data-a="setweek" data-w="${w.id}">Make this our current week</button>`)
    + (w.custom ? `<button class="btn soft sm mt" style="margin-left:8px" data-a="delweek" data-w="${w.id}">Delete this week</button>` : ''));
  h += `<div class="note green small"><b>Tip:</b> ${esc(w.tip)}</div>`;
  w.days.forEach((d, di) => {
    const key = `${w.id}-${di}`;
    const open = state.openDays.has(key) || (isCur && di === todayDi && !state.openDays.has('x' + key));
    h += `<details class="day" data-day="${key}" ${open ? 'open' : ''}><summary><span class="fred" style="font-size:1.05rem">${di === 4 ? '🥾 ' : ''}${d.name}</span><span class="small muted bold">${esc(d.focus)}</span><span class="caret">›</span></summary><div class="inner">`;
    if (di === 4) h += outingCard(w);
    h += daySessionsHtml(w, di) + '</div></details>';
  });
  return h;
}

function viewList() {
  const w = wk(curWeekId()), nx = nextWeekOf(w.id);
  let h = `<h1 class="h-page">Checklist</h1><div class="sub">Tick things off as you gather them. Both phones stay in sync.</div>`;
  h += listCard(w, 'This week') + (nx ? listCard(nx, 'Next week') : '<div class="note blue small">That’s the end of the plan. Tap “New week” on the Plan tab to follow a new interest.</div>');
  if (nx) h += `<button class="btn soft block" data-a="nextweek">Move on to ${esc(weekShort(nx))} →</button>`;
  return h;
}
function listCard(w, label) {
  const p = matProgress(w), ex = extras(w.id);
  let h = `<div class="card"><div class="row between"><div><div class="tiny bold muted">${label}</div><div class="fred" style="font-size:1.1rem">${w.emoji} ${esc(w.title)}</div></div><div class="badge both">${p.done}/${p.total}</div></div><div class="mt">`;
  w.materials.forEach((m0, i) => {
    const m = mat(m0), on = isDone(w.id, 'm' + i);
    h += `<div class="chk ${on ? 'on' : ''}" data-a="toggle" data-w="${w.id}" data-k="m${i}" role="checkbox" aria-checked="${on}" tabindex="0"><span class="box">✓</span><span class="e">${m.e}</span><span class="t grow">${esc(m.t)}</span></div>`;
  });
  ex.forEach(x => {
    const on = isDone(w.id, x.id);
    h += `<div class="chk ${on ? 'on' : ''}"><span class="box" data-a="toggle" data-w="${w.id}" data-k="${x.id}">✓</span><span class="e">➕</span><span class="t grow" data-a="toggle" data-w="${w.id}" data-k="${x.id}">${esc(x.text)}</span><button class="x" data-a="delextra" data-w="${w.id}" data-id="${x.id}" aria-label="Remove">✕</button></div>`;
  });
  h += `</div><form class="addrow" data-form="extra" data-w="${w.id}"><input type="text" placeholder="Add your own item…" maxlength="80"><button class="btn sm" type="submit">Add</button></form>
    <button class="btn soft sm mt" data-a="print" data-p="list" data-w="${w.id}">🖨️ Print this list</button></div>`;
  return h;
}

function filtered() {
  const f = state.filter;
  return state.entries.filter(e => {
    if (f === 'evie' || f === 'colbie') {
      if (!(e.who === f || e.who === 'both')) return false;
      if (state.skill && !((e.skills || {})[f] || []).includes(state.skill)) return false;
      return true;
    }
    if (f === 'fav') return e.fav;
    if (f === 'outing') return e.day === 'Friday';
    return true;
  }).sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.updated || 0) - (a.updated || 0));
}

function viewJournal() {
  const all = state.entries, list = filtered();
  const photos = all.reduce((n, e) => n + (e.photos || []).length, 0);
  let h = `<h1 class="h-page">Journal</h1><div class="sub">Everything you’ve done and loved.</div>
    <div class="stats"><div class="stat"><b>${all.length}</b><span>Entries</span></div><div class="stat"><b>${photos}</b><span>Photos</span></div>
    <div class="stat"><b>${all.filter(e => e.day === 'Friday').length}</b><span>Outings</span></div><div class="stat"><b>${all.filter(e => e.fav).length}</b><span>Favourites</span></div></div>
    <div class="chips">${[['all', 'All'], ['evie', '🌸 Evie'], ['colbie', '⭐ Colbie'], ['fav', '❤️ Favourites'], ['outing', '🥾 Outings']].map(([k, l]) => `<button class="chip ${state.filter === k ? 'on' : ''}" data-a="filter" data-f="${k}">${l}</button>`).join('')}</div>`;
  if (state.filter === 'evie' || state.filter === 'colbie') {
    const k = state.filter, mine = all.filter(e => e.who === k || e.who === 'both');
    h += `<div class="card"><div class="fred" style="font-size:1.1rem">${KID[k].e} ${KID[k].name}’s skills</div>
      <div class="small muted bold mb">A gentle picture of what you’ve noticed, not a score. Tap one to see those moments.</div>
      <div class="skills">${SKILLS.map(([id, em, label]) => {
        const n = mine.filter(e => ((e.skills || {})[k] || []).includes(id)).length;
        return `<button class="skill ${state.skill === id ? 'on' : ''}" data-a="skill" data-v="${id}"><span>${em}</span><b>${label}</b><i>${n}</i></button>`;
      }).join('')}</div></div>`;
  }
  if (!list.length) {
    h += `<div class="empty"><span class="em">📖</span>${all.length ? 'Nothing here yet for this filter.' : 'Your first memory goes here.<br>Tap + or “Log it” on any activity.'}</div>`;
  } else h += list.map(entryCard).join('');
  return h + '<button class="fab" data-a="compose" aria-label="Add entry">+</button>';
}

function entryCard(e) {
  const k = KID[e.who] || KID.both, r = e.reactions || {};
  const reacts = [r.evie ? `🌸 ${r.evie}` : '', r.colbie ? `⭐ ${r.colbie}` : ''].filter(Boolean).join('   ');
  const sk = ['evie', 'colbie'].map(c => {
    const l = (e.skills || {})[c] || [];
    return l.length ? `${KID[c].e} ${l.map(id => (SKILLS.find(s => s[0] === id) || [])[1] || '').join(' ')}` : '';
  }).filter(Boolean).join('   ');
  return `<div class="card entry">
    <div class="row between wrap"><span class="badge ${esc(e.who)}">${k.e} ${k.name}</span>
      <span class="row"><button class="heart ${e.fav ? 'on' : ''}" data-a="fav" data-id="${e.id}" aria-label="Favourite">❤️</button>
      <button class="x" data-a="editentry" data-id="${e.id}" aria-label="Edit">✏️</button><button class="x" data-a="delentry" data-id="${e.id}" aria-label="Delete">🗑️</button></span></div>
    <div class="fred mt" style="font-size:1.12rem">${esc(e.title)}</div>
    <div class="tiny muted bold">${fmtDate(e.date)}${e.week ? ' · ' + esc(e.week) : ''}${e.day ? ' · ' + esc(e.day) : ''}${e.by ? ' · by ' + esc(e.by) : ''}</div>
    ${reacts ? `<div class="mt" style="font-size:1.1rem">${reacts}</div>` : ''}
    ${sk ? `<div class="sk-line">${sk}</div>` : ''}
    ${e.best ? `<div class="q"><b>BEST BIT</b>${esc(e.best)}</div>` : ''}
    ${e.laugh ? `<div class="q"><b>MADE US LAUGH</b>${esc(e.laugh)}</div>` : ''}
    ${e.notes ? `<div class="q"><b>NOTES</b>${esc(e.notes).replace(/\n/g, '<br>')}</div>` : ''}
    ${(e.photos || []).length ? `<div class="photos">${e.photos.map((p, i) => `<img src="${p}" alt="Photo ${i + 1}" loading="lazy" data-a="img" data-id="${e.id}" data-i="${i}">`).join('')}</div>` : ''}
  </div>`;
}

const GUIDE = () => `
  <div class="note green small"><b>Keep it fun</b><ul style="padding-left:18px;margin-top:4px">
    <li>Three core activities a day is plenty. The rest are bonus.</li>
    <li>Skip, swap or do something completely different. Nobody is behind at four or five.</li>
    <li>Let them pick the order. Praise effort and silliness, not neatness.</li>
    <li>Take photos of the mess. That’s the keepsake.</li></ul></div>
  <div class="card guide"><h3>☔ Rainy or grumpy day swaps</h3><ul>${RAINY_DAY.map(([e, t]) => `<li>${e} ${t}</li>`).join('')}</ul></div>
  <div class="card guide"><h3>🏴󠁧󠁢󠁥󠁮󠁧󠁿 Home education in England</h3>
    <p class="tiny muted bold mb">Checked 3 November 2026. The rules are changing, so confirm on GOV.UK before September 2027.</p>
    <ul>
      <li><b>The duty:</b> parents must make sure a child gets an efficient, full-time education suited to their age, ability and aptitude (Education Act 1996, s.7). No National Curriculum, set hours, tests or teaching qualification is required.</li>
      <li><b>When it applies:</b> compulsory school age begins the term after a child’s 5th birthday. Evie turns 5 in April 2027, so for her that is from September 2027. Colbie has no requirements at all.</li>
      <li><b>Registration:</b> there is currently no need to register. The Children’s Wellbeing and Schools Act 2026 (Royal Assent 29 April 2026) creates a compulsory “Children Not in School” register in England. Reports say that duty is not yet in force and is expected in 2027, around when Evie would start. Check GOV.UK or your council before September.</li>
      <li><b>If she is offered a school place:</b> you can still decide to home educate. If she is enrolled you would withdraw her in writing. New council-consent rules only apply to certain children, such as some in special schools or subject to child-protection enquiries.</li>
      <li><b>Keeping school as an option:</b> the national deadline for Reception applications is normally 15 January 2027. Check your council’s date.</li>
      <li><b>Records:</b> dated entries with photos in this journal are a lovely keepsake, and handy if a council ever asks how you are educating.</li>
    </ul>
    <p class="small mt"><a href="https://www.gov.uk/home-education" target="_blank" rel="noopener">GOV.UK: home education</a> ·
      <a href="https://contact.org.uk/help-for-families/information-advice-services/education-learning/home-education/" target="_blank" rel="noopener">Contact: home education</a> ·
      <a href="https://www.legislation.gov.uk/ukpga/2026/21/section/38/enacted" target="_blank" rel="noopener">Act section 38 (register)</a></p></div>
  <div class="card guide"><h3>📱 Using the app</h3><ul>
    <li>Add it to your home screen: iPhone Share → Add to Home Screen, Android menu → Install app.</li>
    <li>Both parents sign in with their own Google account. Everything syncs.</li>
    <li>It works with no signal (woods, farms). Entries and photos upload when you’re back online.</li>
    <li>Tap ⋯ on an activity to mark it done, “did something else”, or skipped. Tap 🔄 Swap to pick another idea from the library.</li>
    <li>Photos are shrunk automatically. Up to 5 per entry; make another entry for more.</li></ul></div>`;

function viewMore() {
  const pr = (e, t, p, extra = '') => `<button class="tile" data-a="print" data-p="${p}" ${extra}><span class="e">${e}</span>${t}</button>`;
  let h = `<h1 class="h-page">More</h1><div class="sub">Printing, guides and account.</div>`;
  h += `<div class="card"><div class="fred mb" style="font-size:1.1rem">🖨️ Print</div>`;
  allWeeks().forEach(w => {
    h += `<div class="small bold muted mt">${w.emoji} ${esc(weekLabel(w))}</div><div class="grid2 mt">
      ${pr('📅', 'Week plan', 'plan', `data-w="${w.id}"`)}${pr('✅', 'Checklist', 'list', `data-w="${w.id}"`)}${pr('🎲', 'Outing bingo', 'bingo', `data-w="${w.id}"`)}</div>`;
  });
  h += `<div class="small bold muted mt">Anytime sheets</div><div class="grid2 mt">
    ${pr('📚', 'Reading log', 'reading')}${pr('📊', 'Tally chart', 'tally')}
    ${pr('📖', 'Memory book: both', 'book', 'data-who="all"')}${pr('🌸', 'Memory book: Evie', 'book', 'data-who="evie"')}${pr('⭐', 'Memory book: Colbie', 'book', 'data-who="colbie"')}</div></div>`;
  h += GUIDE();
  h += `<div class="card"><div class="fred mb" style="font-size:1.1rem">Account</div>
    <p class="small muted bold mb">${backend.mode === 'local' ? 'Preview mode (this device only)' : 'Signed in as ' + esc(state.user.name) + (state.user.email ? ' (' + esc(state.user.email) + ')' : '')}</p>
    <div class="row wrap"><button class="btn soft sm" data-a="export">⬇️ Download a backup</button>${backend.mode === 'local' ? '' : '<button class="btn soft sm" data-a="signout">Sign out</button>'}</div></div>`;
  return h;
}

/* ───────────── modals ───────────── */
let modal = null, draft = null;
function renderModal() {
  const root = $('#modal-root');
  root.innerHTML = !modal ? '' : modal.type === 'compose' ? composeHtml() : modal.type === 'swap' ? swapHtml() : themeHtml();
}
function closeModal() { modal = null; draft = null; renderModal(); }

/* compose */
function openCompose(opts = {}) {
  const ex = opts.id ? state.entries.find(e => e.id === opts.id) : null;
  if (ex) { draft = JSON.parse(JSON.stringify(ex)); draft.skills = draft.skills || {}; draft.reactions = draft.reactions || {}; }
  else {
    draft = { id: uid(), date: todayISO(), week: '', day: '', title: '', who: 'both', reactions: {}, skills: { evie: [], colbie: [] }, best: '', laugh: '', notes: '', fav: false, photos: [] };
    if (opts.w) {
      const w = wk(opts.w), d = w.days[+opts.d], s = getSess(w, +opts.d, +opts.s);
      draft.week = weekLabel(w); draft.day = d.name; draft.title = s.title;
      const sk = SUB2SKILL[s.sub];
      if (sk) draft.skills = { evie: [sk], colbie: [sk] };
    }
  }
  modal = { type: 'compose' };
  renderModal();
}

function composeHtml() {
  const d = draft;
  const seg = ['evie', 'colbie', 'both'].map(k => `<button type="button" class="${k} ${d.who === k ? 'on' : ''}" data-a="mwho" data-v="${k}">${KID[k].e} ${KID[k].name.split(' ')[0]}${k === 'both' ? ' both' : ''}</button>`).join('');
  const reactRow = k => `<div class="react"><span class="nm">${KID[k].e} ${KID[k].name}</span>${REACT.map(([em, t]) => `<button type="button" title="${t}" class="${(d.reactions || {})[k] === em ? 'on' : ''}" data-a="mreact" data-c="${k}" data-v="${em}">${em}</button>`).join('')}</div>`;
  const skillRow = k => `<div class="react"><span class="nm">${KID[k].e} ${KID[k].name}</span><div class="sk-chips">${SKILLS.map(([id, em, l]) => `<button type="button" title="${l}" class="${((d.skills || {})[k] || []).includes(id) ? 'on' : ''}" data-a="mskill" data-c="${k}" data-v="${id}">${em}</button>`).join('')}</div></div>`;
  const editing = state.entries.some(e => e.id === d.id);
  const showE = d.who !== 'colbie', showC = d.who !== 'evie';
  return `<div class="modal-bg" data-a="mbg"><div class="modal" role="dialog" aria-modal="true">
    <header><h2 class="fred" style="font-size:1.25rem">${editing ? 'Edit entry' : 'New memory'}</h2><button class="x" data-a="mclose" aria-label="Close">✕</button></header>
    <div class="body">
      <div class="f"><div class="lab">Who joined in?</div><div class="seg">${seg}</div></div>
      <div class="f"><label for="m-title">What did you do?</label><input id="m-title" type="text" maxlength="90" value="${esc(d.title)}" placeholder="e.g. Leaf printing, woods walk, baking"></div>
      <div class="f"><label for="m-date">Date</label><input id="m-date" type="date" value="${esc(d.date)}"></div>
      ${d.week ? `<p class="tiny muted bold mb">From the plan: ${esc(d.week)}${d.day ? ' · ' + esc(d.day) : ''}</p>` : ''}
      <div class="f"><div class="lab">How did they find it?</div>${showE ? reactRow('evie') : ''}${showC ? reactRow('colbie') : ''}</div>
      <div class="f"><label for="m-best">Best bit</label><input id="m-best" type="text" maxlength="140" value="${esc(d.best)}" placeholder="The thing they’ll talk about"></div>
      <div class="f"><label for="m-laugh">Made us laugh</label><input id="m-laugh" type="text" maxlength="140" value="${esc(d.laugh)}" placeholder="Funny things they said or did"></div>
      <div class="f"><label for="m-notes">Notes (what clicked, what to try next)</label><textarea id="m-notes" rows="3">${esc(d.notes)}</textarea></div>
      <div class="f"><div class="lab">Skills you noticed (optional)</div>${showE ? skillRow('evie') : ''}${showC ? skillRow('colbie') : ''}
        <p class="tiny muted bold">${SKILLS.map(([, em, l]) => `${em} ${l}`).join(' · ')}</p></div>
      <div class="f"><div class="lab">Photos (${d.photos.length}/5)</div>
        ${d.photos.length < 5 ? '<div class="pick">📸 Tap to add photos<input type="file" accept="image/*" multiple data-change="photos"></div>' : ''}
        <div class="thumbs">${d.photos.map((p, i) => `<div><img src="${p}" alt=""><button type="button" data-a="mrm" data-i="${i}" aria-label="Remove photo">✕</button></div>`).join('')}</div></div>
      <div class="f"><button type="button" class="chip ${d.fav ? 'on' : ''}" data-a="mfav">❤️ Keep as a favourite memory</button></div>
    </div>
    <footer><button class="btn soft" data-a="mclose">Cancel</button><button class="btn evie" data-a="msave">Save</button></footer>
  </div></div>`;
}

function syncDraft() {
  if (!draft || !$('#m-title')) return;
  draft.title = $('#m-title').value.trim();
  draft.date = $('#m-date').value || todayISO();
  draft.best = $('#m-best').value.trim();
  draft.laugh = $('#m-laugh').value.trim();
  draft.notes = $('#m-notes').value.trim();
}

function shrink(file, max = 1000, q = 0.72) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const sc = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * sc); c.height = Math.round(img.naturalHeight * sc);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', q));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read that photo')); };
    img.src = url;
  });
}
async function addPhotos(files) {
  syncDraft();
  for (const f of Array.from(files)) {
    if (draft.photos.length >= 5) { toast('Up to 5 photos per entry'); break; }
    try { draft.photos.push(await shrink(f)); } catch (e) { toast(e.message); }
  }
  renderModal();
}

async function saveDraft() {
  syncDraft();
  if (!draft.title) { toast('Add a short title first'); $('#m-title')?.focus(); return; }
  const prev = state.entries.find(e => e.id === draft.id), s = draft.skills || {};
  const entry = {
    id: draft.id, date: draft.date, week: draft.week || '', day: draft.day || '', title: draft.title, who: draft.who,
    reactions: { ...(draft.who !== 'colbie' && draft.reactions.evie ? { evie: draft.reactions.evie } : {}), ...(draft.who !== 'evie' && draft.reactions.colbie ? { colbie: draft.reactions.colbie } : {}) },
    skills: { ...(draft.who !== 'colbie' ? { evie: s.evie || [] } : {}), ...(draft.who !== 'evie' ? { colbie: s.colbie || [] } : {}) },
    best: draft.best, laugh: draft.laugh, notes: draft.notes, fav: !!draft.fav, photos: draft.photos,
    by: prev?.by || first(state.user.name), byUid: prev?.byUid || state.user.uid, created: prev?.created || Date.now(), updated: Date.now()
  };
  if (JSON.stringify(entry).length > 950000) { toast('Photos are too big for one entry. Remove one or split into two entries.'); return; }
  closeModal();
  const i = state.entries.findIndex(e => e.id === entry.id);
  if (i >= 0) state.entries[i] = entry; else state.entries.push(entry);
  render(); toast('Saved 💛');
  backend.saveEntry(entry).catch(syncErr);
}

/* swap */
function swapHtml() {
  const m = modal, w = wk(m.w), key = `s${m.d}_${m.s}`, cur = getSess(w, m.d, m.s);
  const swapped = !!((checkDoc(w.id).swaps || {})[key]);
  let list = LIB.filter(a => (m.theme === 'all' || a.theme === m.theme) && a.title !== cur.title);
  list.sort((a, b) => (b.sub === cur.sub) - (a.sub === cur.sub));
  const total = list.length; list = list.slice(0, 60);
  const label = id => (THEME_CHIPS.find(t => t.id === id) || {}).label || '';
  const chips = [{ id: 'all', label: 'All' }, ...THEME_CHIPS].map(t => `<button class="chip ${m.theme === t.id ? 'on' : ''}" data-a="swaptheme" data-v="${t.id}">${t.label}</button>`).join('');
  return `<div class="modal-bg" data-a="mbg"><div class="modal" role="dialog" aria-modal="true">
    <header><div><h2 class="fred" style="font-size:1.2rem">Swap this activity</h2><div class="tiny muted bold">Replacing: ${esc(cur.title)}</div></div><button class="x" data-a="mclose" aria-label="Close">✕</button></header>
    <div class="body"><div class="chips">${chips}</div>
      ${list.map(a => {
        const [ic, col] = SUBJ[a.sub] || ['✨', '#444'];
        return `<div class="lib"><div class="s-sub" style="color:${col}">${ic} ${a.sub} · ${a.min} min · ${label(a.theme)}</div><div class="s-title">${esc(a.title)}</div><div class="s-desc">${esc(a.desc)}</div>
          <button class="btn soft sm mt" data-a="swapuse" data-id="${a.id}">Use this one</button></div>`;
      }).join('') || '<div class="empty">No other ideas here yet.</div>'}
      ${total > 60 ? `<p class="tiny muted bold">Showing 60 of ${total}. Pick a theme to narrow it down.</p>` : ''}</div>
    <footer>${swapped ? '<button class="btn soft" data-a="swapundo">↺ Back to original</button>' : ''}<button class="btn soft" data-a="mclose">Close</button></footer>
  </div></div>`;
}

/* themed weeks */
function themeHtml() {
  return `<div class="modal-bg" data-a="mbg"><div class="modal" role="dialog" aria-modal="true">
    <header><div><h2 class="fred" style="font-size:1.2rem">Follow a new interest</h2><div class="tiny muted bold">Builds a light week: three activities a day plus an outing.</div></div><button class="x" data-a="mclose" aria-label="Close">✕</button></header>
    <div class="body">${THEMES.map(t => `<div class="themecard" style="background:${t.tint}">
      <div class="row"><div style="font-size:2.2rem">${t.emoji}</div><div class="grow"><div class="fred" style="font-size:1.1rem;color:${t.color}">${esc(t.title)}</div><div class="small bold muted">${esc(t.blurb)}</div></div></div>
      <div class="row mt"><button class="btn sm" data-a="mktheme" data-id="${t.id}" data-now="1">Start now</button><button class="btn soft sm" data-a="mktheme" data-id="${t.id}" data-now="0">Add to plan</button></div></div>`).join('')}</div>
    <footer><button class="btn soft" data-a="mclose">Close</button></footer>
  </div></div>`;
}

/* ───────────── printing ───────────── */
function printOut(html) { $('#print-root').innerHTML = html; setTimeout(() => window.print(), 200); }

function pPlan(w) {
  let h = `<div class="pg"><h1>${w.emoji} ${esc(weekLabel(w))}</h1><div class="pm">${esc(w.blurb)}</div>`;
  w.days.forEach((d, di) => {
    h += `<h2>${d.name}: ${esc(d.focus)}</h2>`;
    if (d.outing) h += `<div class="ps"><b>${d.outing.emoji} ${esc(d.outing.title)}</b>, ${esc(d.outing.where)}. Bring: ${esc(d.outing.bring.join(', '))}.</div>`;
    d.sessions.forEach((_, si) => {
      const s = getSess(w, di, si);
      h += `<div class="ps"><span class="bx"></span><b>${esc(s.title)}</b> (${s.min} min${s.core ? '' : ', optional'}) <span class="pm">${esc(s.desc)}</span>${s.mats.length ? `<div class="pm">Needs: ${esc(s.mats.join(', '))}</div>` : ''}${s.colbie ? `<div class="pm">Colbie: ${esc(s.colbie)}</div>` : ''}</div>`;
    });
  });
  return h + '</div>';
}
function pList(w) {
  return `<div class="pg"><h1>✅ ${esc(weekShort(w))} kit list</h1><div class="pm">${esc(w.title)}</div><h2>Things to gather</h2>` +
    w.materials.map(m0 => { const m = mat(m0); return `<div class="ps" style="font-size:13pt"><span class="bx"></span>${m.e} ${esc(m.t)}</div>`; }).join('') +
    extras(w.id).map(x => `<div class="ps" style="font-size:13pt"><span class="bx"></span>➕ ${esc(x.text)}</div>`).join('') + '</div>';
}
function pBingo(w) {
  const o = w.days[4].outing;
  return ['evie', 'colbie'].map(k => `<div class="pg"><h1>${o.emoji} ${KID[k].e} ${KID[k].name}’s ${esc(o.title)} bingo</h1><div class="pm">Tick each one when you spot it!</div>
    <div class="bingo">${o.bingo.map(m0 => { const m = mat(m0); return `<div><span>${m.e}</span>${esc(m.t)}</div>`; }).join('')}</div></div>`).join('');
}
function pReading() {
  return `<div class="pg"><h1>📚 Reading log</h1><div class="pm">Name: ____________________</div><table><tr><th>Date</th><th>Book</th><th>Loved it? 😍 🙂 😐</th></tr>${'<tr><td>&nbsp;<br>&nbsp;</td><td></td><td></td></tr>'.repeat(10)}</table></div>`;
}
function pTally() {
  return `<div class="pg"><h1>📊 Tally chart</h1><div class="pm">What are we counting? ____________________  Date: __________</div><table><tr><th style="width:35%">Thing</th><th>Tally</th><th style="width:15%">Total</th></tr>${'<tr><td>&nbsp;<br>&nbsp;</td><td></td><td></td></tr>'.repeat(8)}</table></div>`;
}
function pBook(who) {
  const list = state.entries.filter(e => who === 'all' || e.who === who || e.who === 'both').sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const title = who === 'all' ? 'Evie &amp; Colbie’s Learning Journal' : `${KID[who].name}’s Learning Journal`;
  if (!list.length) return `<div class="pg"><h1>${title}</h1><p class="ps">No entries yet.</p></div>`;
  return `<div class="pg"><h1>${title}</h1><div class="pm">${list.length} memories · ${fmtDate(list[0].date)} to ${fmtDate(list[list.length - 1].date)}</div>` +
    list.map(e => `<div class="mem"><h2>${KID[e.who]?.e || ''} ${esc(e.title)}</h2><div class="pm">${fmtDate(e.date)}${e.week ? ' · ' + esc(e.week) : ''}</div>
      ${e.best ? `<div class="ps"><b>Best bit:</b> ${esc(e.best)}</div>` : ''}${e.laugh ? `<div class="ps"><b>Made us laugh:</b> ${esc(e.laugh)}</div>` : ''}${e.notes ? `<div class="ps">${esc(e.notes)}</div>` : ''}
      ${(e.photos || []).map(p => `<img src="${p}" alt="">`).join('')}</div>`).join('') + '</div>';
}

/* ───────────── events ───────────── */
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-a]');
  if (!el) return;
  const a = el.dataset.a, D = el.dataset;
  if (a === 'mbg') { if (ev.target === el) { if (modal?.type === 'compose') syncDraft(); closeModal(); } return; }
  switch (a) {
    case 'tab': state.tab = D.tab; state.menu = null; render(); window.scrollTo(0, 0); break;
    case 'signin': backend.signIn(); break;
    case 'signup': case 'forgot': {
      const f = el.closest('form'), email = f.email.value.trim(), pw = f.pw.value;
      document.activeElement?.blur(); state.pendingRender = false;
      if (a === 'forgot') backend.resetPassword(email);
      else if (!email || pw.length < 6) toast('Enter your email and a password of 6+ characters');
      else backend.signUpEmail(email, pw);
      break;
    }
    case 'recheck': backend.recheckVerify(); break;
    case 'resend': backend.resendVerify(); break;
    case 'signout': state.denied = false; backend.signOut(); break;
    case 'planweek': state.planWeek = parseWid(D.w); render(); break;
    case 'setweek': { const id = parseWid(D.w); state.settings.week = id; render(); backend.saveSettings({ week: id }).catch(syncErr); toast('This is now our current week'); break; }
    case 'nextweek': { const nx = nextWeekOf(curWeekId()); if (nx && confirm('Move on to ' + weekShort(nx) + '?')) { state.settings.week = nx.id; state.planWeek = nx.id; render(); backend.saveSettings({ week: nx.id }).catch(syncErr); } break; }
    case 'delweek': {
      const w = wk(D.w);
      if (w.custom && confirm('Delete "' + w.title + '"? Journal entries stay.')) {
        state.customWeeks = state.customWeeks.filter(x => x.id !== w.id);
        if (String(state.settings.week) === String(w.id)) { state.settings.week = 1; backend.saveSettings({ week: 1 }).catch(syncErr); }
        state.planWeek = null; render(); backend.deleteWeek(w.id).catch(syncErr);
      }
      break;
    }
    case 'toggle': setDone(parseWid(D.w), D.k, !isDone(parseWid(D.w), D.k)); break;
    case 'quick': { const w = parseWid(D.w); setStatus(w, D.k, sessStatus(w, D.k) === 'planned' ? 'done' : 'planned'); break; }
    case 'menu': { const k = `${D.w}:${D.k}`; state.menu = state.menu === k ? null : k; render(); break; }
    case 'status': {
      const w = parseWid(D.w);
      if (D.v === 'adapted') { const note = prompt('What did you do instead? (optional)'); if (note === null) break; setStatus(w, D.k, 'adapted', note.trim()); }
      else setStatus(w, D.k, D.v);
      break;
    }
    case 'swap': modal = { type: 'swap', w: D.w, d: +D.d, s: +D.s, theme: 'all' }; renderModal(); break;
    case 'swaptheme': modal.theme = D.v; renderModal(); break;
    case 'swapuse': { const w = parseWid(modal.w), key = `s${modal.d}_${modal.s}`; patchCheck(w, { swaps: { [key]: D.id }, status: { [key]: 'planned' }, done: { [key]: false } }); closeModal(); toast('Swapped 🔄'); break; }
    case 'swapundo': { const w = parseWid(modal.w), key = `s${modal.d}_${modal.s}`; patchCheck(w, { swaps: { [key]: '' } }); closeModal(); toast('Back to the original'); break; }
    case 'newtheme': modal = { type: 'theme' }; renderModal(); break;
    case 'mktheme': createThemedWeek(D.id, D.now === '1'); break;
    case 'delextra': setExtras(parseWid(D.w), extras(parseWid(D.w)).filter(x => x.id !== D.id)); break;
    case 'compose': openCompose(D); break;
    case 'editentry': openCompose({ id: D.id }); break;
    case 'delentry': if (confirm('Delete this entry and its photos?')) { state.entries = state.entries.filter(e => e.id !== D.id); render(); backend.deleteEntry(D.id).catch(syncErr); } break;
    case 'fav': { const e = state.entries.find(x => x.id === D.id); if (e) { e.fav = !e.fav; render(); backend.saveEntry({ ...e }).catch(syncErr); } break; }
    case 'filter': state.filter = D.f; state.skill = null; render(); break;
    case 'skill': state.skill = state.skill === D.v ? null : D.v; render(); break;
    case 'img': { const e = state.entries.find(x => x.id === D.id); if (e) { const lb = document.createElement('div'); lb.className = 'lightbox'; lb.innerHTML = `<img src="${e.photos[+D.i]}" alt="">`; lb.onclick = () => lb.remove(); document.body.appendChild(lb); } break; }
    case 'print': {
      const w = D.w ? wk(D.w) : null;
      const map = { plan: () => pPlan(w), list: () => pList(w), bingo: () => pBingo(w), reading: pReading, tally: pTally, book: () => pBook(D.who) };
      printOut(map[D.p]()); break;
    }
    case 'export': {
      const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), entries: state.entries, checks: state.checks, settings: state.settings, weeks: state.customWeeks }, null, 1)], { type: 'application/json' });
      const l = document.createElement('a'); l.href = URL.createObjectURL(blob); l.download = 'little-learners-backup-' + todayISO() + '.json'; l.click(); break;
    }
    /* compose modal */
    case 'mclose': if (modal?.type === 'compose') syncDraft(); closeModal(); break;
    case 'mwho': syncDraft(); draft.who = D.v; renderModal(); break;
    case 'mreact': syncDraft(); draft.reactions = draft.reactions || {}; draft.reactions[D.c] = draft.reactions[D.c] === D.v ? '' : D.v; renderModal(); break;
    case 'mskill': {
      syncDraft(); draft.skills = draft.skills || {}; const l = draft.skills[D.c] || [];
      draft.skills[D.c] = l.includes(D.v) ? l.filter(x => x !== D.v) : [...l, D.v]; renderModal(); break;
    }
    case 'mrm': syncDraft(); draft.photos.splice(+D.i, 1); renderModal(); break;
    case 'mfav': syncDraft(); draft.fav = !draft.fav; renderModal(); break;
    case 'msave': saveDraft(); break;
  }
});

document.addEventListener('change', ev => {
  if (ev.target.dataset.change === 'photos') { addPhotos(ev.target.files); ev.target.value = ''; }
});
document.addEventListener('submit', ev => {
  const lf = ev.target.closest('[data-form="login"]');
  if (lf) {
    ev.preventDefault();
    const email = lf.email.value.trim(), pw = lf.pw.value;
    document.activeElement?.blur(); state.pendingRender = false;
    backend.signInEmail(email, pw);
    return;
  }
  const f = ev.target.closest('[data-form="extra"]');
  if (!f) return;
  ev.preventDefault();
  const input = f.querySelector('input'), text = input.value.trim();
  if (!text) return;
  const wid = parseWid(f.dataset.w);
  input.value = ''; input.blur();
  state.pendingRender = false;
  setExtras(wid, [...extras(wid), { id: 'x' + Date.now().toString(36), text }]);
});
document.addEventListener('keydown', ev => {
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('.chk[data-a]')) { ev.preventDefault(); ev.target.click(); }
});
document.addEventListener('focusout', ev => {
  if (state.pendingRender && ev.target.closest && ev.target.closest('#view')) { state.pendingRender = false; setTimeout(render, 60); }
});
document.addEventListener('toggle', ev => {
  const d = ev.target;
  if (d.tagName === 'DETAILS' && d.dataset.day) {
    const k = d.dataset.day;
    if (d.open) { state.openDays.add(k); state.openDays.delete('x' + k); } else { state.openDays.delete(k); state.openDays.add('x' + k); }
  }
}, true);
window.addEventListener('afterprint', () => { $('#print-root').innerHTML = ''; });

/* ───────────── boot ───────────── */
let unsubs = [];
function stopWatching() { unsubs.forEach(u => { try { u(); } catch { /* ignore */ } }); unsubs = []; }
function startWatching() {
  stopWatching();
  const onErr = e => {
    console.error(e);
    if (e && e.code === 'permission-denied') { state.denied = true; render(); }
    else toast('Sync problem: ' + (e.code || e.message));
  };
  unsubs = [
    backend.watchEntries(list => { state.entries = list; render(); }, onErr),
    backend.watchChecks(o => { state.checks = o; render(); }, onErr),
    backend.watchSettings(s => { state.settings = s || {}; render(); }, onErr),
    backend.watchWeeks(list => { state.customWeeks = list.sort((a, b) => (a.created || 0) - (b.created || 0)); render(); }, onErr)
  ];
}

(async function boot() {
  $('#view').innerHTML = '<div class="login"><div style="font-size:3rem">🌱</div><p class="muted bold">Loading…</p></div>';
  try {
    backend = configured ? await makeFirebaseBackend() : makeLocalBackend();
  } catch (e) {
    console.error(e);
    $('#view').innerHTML = `<div class="login"><div style="font-size:3rem">📡</div><h2 class="fred">Can’t load right now</h2><p class="muted bold small">The first load needs an internet connection. Try again with signal.</p><button class="btn" onclick="location.reload()">Try again</button></div>`;
    return;
  }
  backend.onUser(u => {
    state.user = u; state.denied = false;
    if (u && u.verified !== false) startWatching(); else stopWatching();
    render();
  });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
})();
