const KEY = "demo_checkout_v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    // ignore
  }
}

export function clearState() {
  localStorage.removeItem(KEY);
}
