/* ───────────────────────────────────────────────
    INPUT SYSTEM
    keys object + keyboard event listeners
─────────────────────────────────────────────── */
const keys = { w: false, a: false, s: false, d: false };

window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k in keys) keys[k] = true;
});
window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k in keys) keys[k] = false;
});
// Prevent keys sticking when window loses focus
window.addEventListener('blur', () => {
    keys.w = keys.a = keys.s = keys.d = false;
});
