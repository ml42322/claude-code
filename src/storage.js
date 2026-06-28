/* Drop-in replacement for the chat-app's window.storage, backed by IndexedDB.
   Same async shape the app expects: get/set/delete/list with (key, shared).
   IndexedDB (not localStorage) so recipe photos don't hit the ~5MB cap. */
const DB = "mimis-recipe-box", STORE = "kv", VERSION = 1;
let dbp;
function openDB() {
  if (!dbp) {
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB, VERSION);
      req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE); };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbp;
}
function store(mode) { return openDB().then((d) => d.transaction(STORE, mode).objectStore(STORE)); }
const nk = (key, shared) => (shared ? "s:" : "u:") + key; // namespace shared vs user

window.storage = {
  async get(key, shared = false) {
    const s = await store("readonly");
    return new Promise((res, rej) => { const r = s.get(nk(key, shared)); r.onsuccess = () => res(r.result == null ? null : { key, value: r.result, shared }); r.onerror = () => rej(r.error); });
  },
  async set(key, value, shared = false) {
    const s = await store("readwrite");
    return new Promise((res, rej) => { const r = s.put(value, nk(key, shared)); r.onsuccess = () => res({ key, value, shared }); r.onerror = () => rej(r.error); });
  },
  async delete(key, shared = false) {
    const s = await store("readwrite");
    return new Promise((res, rej) => { const r = s.delete(nk(key, shared)); r.onsuccess = () => res({ key, deleted: true, shared }); r.onerror = () => rej(r.error); });
  },
  async list(prefix = "", shared = false) {
    const s = await store("readonly");
    const full = nk(prefix, shared);
    const range = IDBKeyRange.bound(full, full + "\uffff");
    return new Promise((res, rej) => {
      const keys = [];
      const r = s.openCursor(range);
      r.onsuccess = () => { const c = r.result; if (c) { keys.push(String(c.key).slice(2)); c.continue(); } else res({ keys }); };
      r.onerror = () => rej(r.error);
    });
  },
};
