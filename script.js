// ===== Robinhood Faucecat — $FAUCECAT =====
// Fill these in once the token is minted / links exist.
const CONFIG = {
  CA: "NOT MINTED YET",
  CHAIN: "solana",
  CHART_URL: "https://dexscreener.com/",
  BUY_URL: "https://raydium.io/swap/",
  X_URL: "https://x.com/",
  TELEGRAM_URL: "https://t.me/",
};

document.addEventListener("DOMContentLoaded", () => {
  wireLinks();
  copyButtons();
  burgerMenu();
  buildTicker();
  buildHeroDrips();
  buildFaucetLog();
  wireClaimButton();
  statsCountUp();
  liveMarketData();
});

// ---- wire external links from CONFIG ----
function wireLinks() {
  document.querySelectorAll("[data-chart-link]").forEach((el) => (el.href = CONFIG.CHART_URL));
  document.querySelectorAll("[data-buy-link]").forEach((el) => (el.href = CONFIG.BUY_URL));
  document.querySelectorAll("[data-x-link]").forEach((el) => (el.href = CONFIG.X_URL));
  document.querySelectorAll("[data-tg-link]").forEach((el) => (el.href = CONFIG.TELEGRAM_URL));

  document.querySelectorAll(".ca-value").forEach((el) => (el.textContent = CONFIG.CA));
}

// ---- copy to clipboard + toast ----
function copyButtons() {
  document.querySelectorAll("[data-copy]").forEach((plaque) => {
    const btn = plaque.querySelector("[data-copy-btn]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const value = CONFIG.CA;
      if (value === "NOT MINTED YET") {
        showToast("No contract yet — check back after mint 🐈");
        return;
      }
      navigator.clipboard?.writeText(value).then(() => {
        showToast("Contract address copied");
      }).catch(() => showToast("Couldn't copy — copy it manually"));
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---- burger menu ----
function burgerMenu() {
  const btn = document.getElementById("burgerBtn");
  const links = document.getElementById("navLinks");
  if (!btn || !links) return;
  btn.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );
}

// ---- terminal ticker feed (cosmetic) ----
const TICKER_PHRASES = [
  "faucet status: <b>DRIPPING</b>",
  "whale tap #37 located and drained",
  "purple liquidity level: rising",
  "hood inventory: 1 feather, 1 cat, infinite nerve",
  "gas fee: paid in vibes",
  "$FAUCECAT — not minted yet, drip anyway",
  "poor cats fed today: all of them",
  "faucet handle status: will not stop turning",
  "official slogan: \"steal the drip, keep the drip\"",
  "testnet vibes: fully mainnet-coded",
];
function buildTicker() {
  const track = document.getElementById("termTrack");
  if (!track) return;
  const items = [...TICKER_PHRASES, ...TICKER_PHRASES]
    .map((t) => `<span>&gt; ${t}</span>`)
    .join("");
  track.innerHTML = items;
}

// ---- hero drips (staggered CSS animation instances) ----
function buildHeroDrips() {
  const wrap = document.getElementById("heroDrips");
  if (!wrap) return;
  const count = 3;
  for (let i = 0; i < count; i++) {
    const d = document.createElement("div");
    d.className = "drip";
    d.style.animationDelay = `${i * 0.55}s`;
    wrap.appendChild(d);
  }
}

// ---- faucet drip log (cosmetic, client-side only) ----
const FAKE_ADDR_POOL = () => {
  const chars = "abcdef0123456789";
  let s = "0x";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  s += "…";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

function buildFaucetLog() {
  const list = document.getElementById("dripLog");
  if (!list) return;
  for (let i = 0; i < 6; i++) addLogLine(list, randomLogLine(), false);
  setInterval(() => addLogLine(list, randomLogLine(), true), 4200);
}

function randomLogLine() {
  const amt = (Math.random() * 900 + 10).toFixed(0);
  const addr = FAKE_ADDR_POOL();
  const verbs = ["drip sent to", "topped up", "splashed", "hydrated"];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  return { addr, amt, verb };
}

function addLogLine(list, { addr, amt, verb }, prepend) {
  const li = document.createElement("li");
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  li.innerHTML = `<span class="tstamp">${time}</span>${verb} <b>${addr}</b> — ${amt} $FAUCECAT`;
  if (prepend) {
    list.prepend(li);
    while (list.children.length > 30) list.removeChild(list.lastChild);
  } else {
    list.appendChild(li);
  }
}

// ---- claim button (cosmetic only — no wallet, no real funds, ever) ----
function wireClaimButton() {
  const btn = document.getElementById("claimBtn");
  const note = document.getElementById("claimNote");
  const list = document.getElementById("dripLog");
  if (!btn) return;
  let claiming = false;
  btn.addEventListener("click", () => {
    if (claiming) return;
    claiming = true;
    const original = btn.textContent;
    btn.textContent = "Dripping…";
    btn.disabled = true;
    setTimeout(() => {
      const line = randomLogLine();
      line.verb = "drip claimed by you →";
      if (list) addLogLine(list, line, true);
      showToast("Splash! (purely decorative — no real tokens moved)");
      if (note) note.textContent = "Drip #" + Math.floor(Math.random() * 90000 + 1000) + " logged. Nothing actually happened, and that's beautiful.";
      btn.textContent = original;
      btn.disabled = false;
      claiming = false;
    }, 900);
  });
}

// ---- stat count-up on scroll into view ----
function statsCountUp() {
  const nums = document.querySelectorAll(".stat-num[data-count]");
  if (!nums.length) return;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const val = Math.floor(target * easeOutCubic(p));
      el.textContent = val.toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  nums.forEach((n) => io.observe(n));
}

// ---- live market data from DexScreener, only once CA is set ----
async function liveMarketData() {
  const note = document.getElementById("marketNote");
  if (CONFIG.CA === "NOT MINTED YET") return; // stays on placeholder copy

  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONFIG.CA}`);
    const data = await res.json();
    const pair = data?.pairs?.[0];
    if (!pair) return;

    const priceEl = document.getElementById("mPrice");
    const changeEl = document.getElementById("mChange");
    const capEl = document.getElementById("mCap");
    const liqEl = document.getElementById("mLiq");

    if (priceEl) priceEl.textContent = pair.priceUsd ? `$${Number(pair.priceUsd).toPrecision(4)}` : "—";
    if (changeEl) {
      const change = pair.priceChange?.h24;
      changeEl.textContent = change != null ? `${change > 0 ? "+" : ""}${change}%` : "—";
      changeEl.style.color = change > 0 ? "var(--green-bright)" : change < 0 ? "#ff6b6b" : "var(--cream)";
    }
    if (capEl) capEl.textContent = pair.marketCap ? `$${Number(pair.marketCap).toLocaleString("en-US")}` : "—";
    if (liqEl) liqEl.textContent = pair.liquidity?.usd ? `$${Number(pair.liquidity.usd).toLocaleString("en-US")}` : "—";
    if (note) note.textContent = "Live from DexScreener. Updates on page reload.";
  } catch (e) {
    if (note) note.textContent = "Couldn't reach DexScreener right now — try the chart link instead.";
  }
}
