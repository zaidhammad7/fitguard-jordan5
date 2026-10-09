// ===== FitGuard Jordan - الحالة المشتركة (تُخزَّن في المتصفح عبر localStorage) =====
const KEY = 'fitguard_v1';
const DEFAULT = { name: 'زيد', points: 120, reps: 0, good: 0, load: {}, redeemed: [] };
const MUSCLES = { quads:'الفخذ الأمامي', glutes:'الأرداف', hams:'الفخذ الخلفي', calves:'السمانة',
  core:'عضلات البطن', chest:'الصدر', shoulders:'الأكتاف', arms:'الذراعان', back:'الظهر' };
const RECOVERY_HOURS = 48; // مدة الاستشفاء الكاملة عند إجهاد 100%

function getState() {
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY)) }; }
  catch { return { ...DEFAULT }; }
}
function saveState(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }

// نسبة الإجهاد الحالية: تقل خطياً مع الوقت حتى تصل لصفر بعد 48 ساعة
function fatigue(m) {
  const e = getState().load[m]; if (!e) return 0;
  const h = (Date.now() - e.t) / 36e5;
  return Math.max(0, Math.round(e.v * (1 - h / RECOVERY_HOURS)));
}
// الساعات المتبقية للراحة
function restHours(m) { return Math.ceil(fatigue(m) * RECOVERY_HOURS / 100); }
function addLoad(m, amount) {
  const s = getState();
  s.load[m] = { v: Math.min(100, fatigue(m) + amount), t: Date.now() };
  saveState(s);
}
function heat(f) { return `hsl(${Math.round(140 - f * 1.4)} 75% 48%)`; } // أخضر → أحمر

function renderNav(active) {
  const links = [['index.html','الرئيسية'],['workout.html','التمرين الذكي'],['recovery.html','الاستشفاء'],['rewards.html','المكافآت']];
  document.getElementById('nav').innerHTML = `
  <header class="sticky top-0 z-10 bg-[#0b1220]/90 backdrop-blur border-b border-slate-800">
    <div class="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4 overflow-x-auto">
      <b class="text-sky-400 whitespace-nowrap">FitGuard Jordan</b>
      ${links.map(([h,t]) => `<a href="${h}" class="whitespace-nowrap text-sm px-3 py-1.5 rounded-lg ${h===active?'bg-sky-500 text-slate-950 font-bold':'text-slate-300 hover:bg-slate-800'}">${t}</a>`).join('')}
    </div></header>`;
}
