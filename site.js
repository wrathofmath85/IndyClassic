/* ════════════════════════════════════════════════════════════════
   INDY CLASSIC — shared site script
   Builds the header, mobile tab bar, footer and the data-driven
   pages from config.js. You shouldn't need to edit this file for
   a normal yearly update — edit config.js instead.
   ════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  const C = window.IC;
  if (!C) { console.error("config.js missing"); return; }

  /* ── tiny helpers ─────────────────────────────────────────────── */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content; };
  const pageFile = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* ── time (with ?now= preview override) ───────────────────────── */
  let delta = 0;
  (function () {
    const q = new URLSearchParams(location.search).get("now");
    if (q === "off" || q === "") { sessionStorage.removeItem("icNow"); return; }
    const v = q || sessionStorage.getItem("icNow");
    if (!v) return;
    const d = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(v) ? v : (v.length <= 16 ? v + ":00" : v) + C.utcOffset);
    if (!isNaN(d)) { delta = d - Date.now(); sessionStorage.setItem("icNow", v); }
  })();
  const now = () => new Date(Date.now() + delta);
  const at = (date, time = "00:00") => new Date(`${date}T${time}:00${C.utcOffset}`);
  const fmtT = (hhmm) => { let [H, M] = hhmm.split(":").map(Number); const ap = H >= 12 ? "PM" : "AM"; H = H % 12 || 12; return M ? `${H}:${String(M).padStart(2, "0")} ${ap}` : `${H} ${ap}`; };
  const fmtRange = (a, b) => {
    if (!b) return fmtT(a);
    const A = fmtT(a), B = fmtT(b), apA = A.slice(-2), apB = B.slice(-2);
    return apA === apB ? `${A.slice(0, -3)}–${B}` : `${A} – ${B}`;
  };
  const dObj = (date) => new Date(`${date}T12:00:00${C.utcOffset}`);
  const fmtDay = (date, o = { weekday: "long", month: "long", day: "numeric" }) => dObj(date).toLocaleDateString("en-US", { ...o, timeZone: "America/New_York" });
  const daysUntil = (d) => Math.ceil((d - now()) / 864e5);
  const todayStr = () => now().toLocaleDateString("en-CA", { timeZone: "America/New_York" });

  /* ── links ────────────────────────────────────────────────────── */
  const soon = (p) => C.comingSoon.map((x) => x.toLowerCase()).includes(String(p).toLowerCase());
  const href = (p) => (soon(p) ? `holdhorse.html?p=${encodeURIComponent(p)}` : p);
  const venue = (k) => C.venues[k] || null;
  const mapUrl = (addr) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
  const isExt = (u) => /^https?:/i.test(u);
  const tgt = (u) => (isExt(u) ? ' target="_blank" rel="noopener noreferrer"' : "");

  /* ── timeline of all events ───────────────────────────────────── */
  const timeline = C.schedule.flatMap((d) => d.items.map((it) => {
    const s = at(d.date, it.start);
    const e = it.end ? at(d.date, it.end) : new Date(s.getTime() + 36e5);
    return { ...it, date: d.date, s, e };
  }));
  const tStart = at(C.startDate);
  const tEnd = new Date(Math.max(...timeline.map((x) => x.e)) + 2 * 36e5);
  const firstServe = timeline.find((x) => x.play)?.s || tStart;
  const phase = () => { const n = now(); return n < tStart ? "before" : n <= tEnd ? "live" : "after"; };

  /* ── calendar export ──────────────────────────────────────────── */
  const icsDate = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const evLoc = (it) => { const v = venue(it.venue); return v ? (v.address ? `${v.name}, ${v.address}` : `${v.name} (${C.venues.club.name})`) : ""; };
  function icsHref(items) {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Indy Classic//EN", "CALSCALE:GREGORIAN"];
    items.forEach((it, i) => lines.push("BEGIN:VEVENT", `UID:ic${C.year}-${icsDate(it.s)}-${i}@indyclassic`, `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(it.s)}`, `DTEND:${icsDate(it.e)}`, `SUMMARY:${C.year} ${C.name}: ${it.title}`.replace(/,/g, "\\,"),
      `LOCATION:${evLoc(it)}`.replace(/,/g, "\\,"), "END:VEVENT"));
    lines.push("END:VCALENDAR");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(lines.join("\r\n"));
  }
  const gcalHref = (it) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${C.year} ${C.name}: ${it.title}`)}&dates=${icsDate(it.s)}/${icsDate(it.e)}&location=${encodeURIComponent(evLoc(it))}`;
  function calSheet(items, label) {
    const one = items.length === 1;
    openSheet(`<h3>${esc(label || "Add to calendar")}</h3>
      <div class="grid" style="gap:8px">
        <a class="btn block" href="${icsHref(items)}" download="indy-classic-${one ? items[0].title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "weekend"}.ics">📅 Apple / Outlook calendar</a>
        ${one ? `<a class="btn block" href="${gcalHref(items[0])}" target="_blank" rel="noopener">🗓️ Google Calendar</a>` : `<p class="small faint center">Google Calendar users: open the downloaded file, or add events one at a time from the schedule.</p>`}
      </div>`);
  }

  /* ── sheet + toast + lightbox ─────────────────────────────────── */
  function openSheet(inner) {
    let bg = $(".sheet-bg"), sh = $(".sheet");
    if (!sh) {
      document.body.append(h(`<div class="sheet-bg"></div><div class="sheet" role="dialog" aria-modal="true"><div class="sheet-grab"></div><div class="sheet-body"></div></div>`));
      bg = $(".sheet-bg"); sh = $(".sheet");
      bg.addEventListener("click", closeSheet);
      sh.addEventListener("click", (e) => { if (e.target.closest("a")) setTimeout(closeSheet, 150); });
      document.addEventListener("keydown", (e) => e.key === "Escape" && closeSheet());
    }
    $(".sheet-body", sh).innerHTML = inner;
    requestAnimationFrame(() => document.body.classList.add("sheet-open"));
  }
  function closeSheet() { document.body.classList.remove("sheet-open"); }
  function toast(msg) {
    let t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.append(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 2200);
  }
  function lightbox(src, alt) {
    let lb = $(".lightbox");
    if (!lb) {
      document.body.append(h(`<div class="lightbox" role="dialog"><img alt=""><button aria-label="Close">×</button></div>`));
      lb = $(".lightbox"); lb.addEventListener("click", () => lb.classList.remove("show"));
    }
    $("img", lb).src = src; $("img", lb).alt = alt || ""; lb.classList.add("show");
  }

  /* ── icons ────────────────────────────────────────────────────── */
  const BALL = `<svg class="brand-ball" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#d4f53c"/><path d="M5 6.5c5.2 4.6 5.2 14.4 0 19M27 6.5c-5.2 4.6-5.2 14.4 0 19" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;
  const I = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    court: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 12h16M7 3v18M17 3v18M7 7.5h10M7 16.5h10M12 7.5v9"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
    more: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;

  /* ── site map (used by nav + More sheet) ──────────────────────── */
  const MAP = [
    { group: "Tournament", items: [
      ["🗓️", "Schedule", "Schedule.html"], ["🎾", "Court Assignments", C.links.courts], ["🏆", "Consolation", C.links.consolation], ["👕", "T-Shirts", "tshirts.html"]] },
    { group: "Events", items: [["🥂", "Welcome Party", "Welcome.html"], ["🎉", "Banquet", "Banquet.html"]] },
    { group: "Travel & Stay", items: [["🏨", "Host Hotel", "hotel.html"], ["🏙️", "Around Indy", "visitindy.html"]] },
    { group: "More", items: [["💬", "Contact Us", "ContactUs.html"], ["📊", "Financials", "Financials.html"], ["🏟️", "Racquet Club ↗", C.links.club], ["💚", `${C.links.charityName} ↗`, C.links.charity], ["🔒", "Text Privacy", "Privacy.html"]] },
  ];
  function openMore() {
    openSheet(`
      <div class="btn-row two">${regBtn("block")}${payBtn("block")}</div>
      ${MAP.map((g) => `<h3>${g.group}</h3><div class="sheet-grid">${g.items.map(([e, t, u]) =>
        `<a href="${href(u)}"${tgt(u)}><span class="i">${e}</span>${esc(t)}${soon(u) ? '<span class="soon">Soon</span>' : ""}</a>`).join("")}</div>`).join("")}`);
  }
  const regBtn = (cls = "") => `<a class="btn primary ${cls}" href="${C.links.register}" target="_blank" rel="noopener noreferrer">Register ↗</a>`;
  const payBtn = (cls = "") => C.links.payment
    ? `<a class="btn ${cls}" href="${C.links.payment}" target="_blank" rel="noopener noreferrer">Payment ↗</a>`
    : `<span class="btn ${cls}" aria-disabled="true">Payment · opens soon</span>`;

  /* ── chrome: background, top bar, tab bar, footer ─────────────── */
  function chrome() {
    document.body.prepend(h(`<div class="bg-court" aria-hidden="true"><svg viewBox="0 0 1000 1400" preserveAspectRatio="xMidYMid slice">
      <line x1="120" y1="120" x2="880" y2="120"/><line x1="120" y1="1280" x2="880" y2="1280"/><line x1="200" y1="120" x2="200" y2="1280"/><line x1="800" y1="120" x2="800" y2="1280"/>
      <line x1="200" y1="440" x2="800" y2="440"/><line x1="200" y1="960" x2="800" y2="960"/><line x1="500" y1="440" x2="500" y2="960"/><line class="net" x1="120" y1="700" x2="880" y2="700"/></svg></div>`));

    const live = phase() === "live";
    const on = (f) => (pageFile === f.toLowerCase() ? "on" : "");
    const navLinks = [["Home", "index.html"], ["Schedule", "Schedule.html"], ["Courts", C.links.courts], ["Consolation", C.links.consolation],
      ["Events", "Welcome.html"], ["Hotel", "hotel.html"], ["Around Indy", "visitindy.html"], ["Contact", "ContactUs.html"]];
    const cta = live
      ? `<a class="btn primary sm top-cta" href="${C.links.courts}"><span class="dot-live"></span>&nbsp;Live Courts</a>`
      : `<a class="btn primary sm top-cta" href="${C.links.register}" target="_blank" rel="noopener noreferrer">Register</a>`;

    document.body.prepend(h(`<header class="topbar"><div class="topbar-in">
      <a class="brand" href="index.html" aria-label="Indy Classic home">${BALL}<span class="brand-txt">Indy Classic<small>${C.year} · Indianapolis</small></span></a>
      <nav class="topnav" aria-label="Main">${navLinks.map(([t, u]) => `<a class="${on(u)}" href="${href(u)}">${t}</a>`).join("")}</nav>
      ${cta}
    </div></header>`));

    const tab = (k, label, u) => `<a href="${href(u)}" class="${on(u)}">${svg(k)}${label}</a>`;
    document.body.append(h(`<nav class="tabbar" aria-label="Quick">
      ${tab("home", "Home", "index.html")}${tab("cal", "Schedule", "Schedule.html")}
      <a href="${C.links.courts}" class="${on(C.links.courts)}">${svg("court")}Courts${live ? '<span class="live-dot"></span>' : ""}</a>
      ${tab("trophy", "Consolation", C.links.consolation)}
      <button type="button" class="more-btn">${svg("more")}More</button></nav>`));
    $(".more-btn").addEventListener("click", openMore);

    if (!document.body.hasAttribute("data-no-footer")) {
      document.body.append(h(`<footer class="footer"><div class="footer-links">
        <a href="${href("ContactUs.html")}">Contact</a><a href="Financials.html">${esc(C.financials.label)}</a>
        <a href="${C.links.club}" target="_blank" rel="noopener">Indianapolis Racquet Club ↗</a>
        <a href="${C.links.charity}" target="_blank" rel="noopener">${esc(C.links.charityName)} ↗</a><a href="Privacy.html">Texting Privacy &amp; Terms</a></div>
        © ${C.year} ${C.name} · ${C.city}</footer>`));
    }
    if (delta) {
      document.body.append(h(`<div style="position:fixed;top:calc(var(--top-h) + 8px);right:8px;z-index:70" class="pill gold">Preview: ${esc(now().toLocaleString("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "2-digit" }))} · <a href="?now=off" style="color:inherit">exit</a></div>`));
    }
  }

  /* ── reusable bits ────────────────────────────────────────────── */
  const venuePill = (k) => { const v = venue(k); if (!v) return ""; return v.address
    ? `<a class="pill sky" href="${mapUrl(v.address)}" target="_blank" rel="noopener">📍 ${esc(v.name)}</a>`
    : `<span class="pill">📍 ${esc(v.name)}${v.note ? " " + esc(v.note) : ""}</span>`; };

  function countdownHTML(target, label) {
    return `<div class="countdown" data-cd="${target.toISOString()}"><div><b>0</b><span>Days</span></div><div><b>0</b><span>Hrs</span></div><div><b>0</b><span>Min</span></div><div><b>0</b><span>Sec</span></div></div>
      <div class="cd-label">${label}</div>`;
  }
  function tickCountdowns() {
    $$("[data-cd]").forEach((el) => {
      let ms = Math.max(0, new Date(el.dataset.cd) - now());
      const v = [864e5, 36e5, 6e4, 1e3].map((u) => { const q = Math.floor(ms / u); ms -= q * u; return q; });
      $$("b", el).forEach((b, i) => (b.textContent = i ? String(v[i]).padStart(2, "0") : v[i]));
    });
  }

  function eventStatus(start, end) {
    const n = now(), d = daysUntil(start);
    if (n > end) return `<span class="pill">Wrapped — thanks for coming!</span>`;
    if (n >= start) return `<span class="pill live">Happening now</span>`;
    if (start.toDateString() === n.toDateString() || d <= 0) return `<span class="pill ball">Tonight!</span>`;
    if (d === 1) return `<span class="pill ball">Tomorrow</span>`;
    return `<span class="pill">In ${d} days</span>`;
  }

  function photo(src, alt) {
    return src ? `<div class="photo"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.parentElement.remove()"></div>` : "";
  }

  /* ════════════════════════════════════════════════════════════════
     PAGES
     ════════════════════════════════════════════════════════════════ */
  const P = {};

  /* ── HOME ─────────────────────────────────────────────────────── */
  P.home = (root) => {
    const ph = phase();
    const welcome = timeline.find((x) => x.link === "Welcome.html");
    const banquet = timeline.find((x) => x.link === "Banquet.html");
    const hotelOpen = !soon("hotel.html") && now() < at(C.hotel.bookBy, "23:59");

    let heroExtra = "";
    if (ph === "before") heroExtra = countdownHTML(firstServe, `until first serve · ${fmtDay(firstServe.toLocaleDateString("en-CA", { timeZone: "America/New_York" }), { weekday: "short", month: "short", day: "numeric" })}, ${fmtT(timeline.find((x) => x.play).start)}`);
    else if (ph === "after") heroExtra = `<p class="lead" style="margin:16px auto 0">That's a wrap on ${C.year}! Thank you to every player, volunteer and sponsor. 💚</p>`;

    const tiles = [
      ph === "live"
        ? { f: true, e: "🎾", t: "Live Court Assignments", s: "Who's playing where — updated all day", u: C.links.courts }
        : { f: true, e: "🗓️", t: "Weekend Schedule", s: "Every match day, meal and party in one place", u: "Schedule.html" },
      ph === "live" ? { e: "🗓️", t: "Schedule", s: "Today & the rest of the weekend", u: "Schedule.html" } : { e: "🎾", t: "Court Assignments", s: "Who's on which court", u: C.links.courts },
      { e: "🏆", t: "Consolation", s: "Sign up & live draws", u: C.links.consolation },
      { e: "🥂", t: "Welcome Party", s: welcome ? `${fmtDay(welcome.date, { weekday: "short" })} ${fmtT(welcome.start)} · ${venue(welcome.venue).name}` : "", u: "Welcome.html" },
      { e: "🎉", t: "Player's Banquet", s: banquet ? `${fmtDay(banquet.date, { weekday: "short" })} ${fmtT(banquet.start)} · ${venue(banquet.venue).name}` : "", u: "Banquet.html" },
      { e: "🏨", t: "Host Hotel", s: `${C.hotel.rate}/night · book by ${fmtDay(C.hotel.bookBy, { month: "short", day: "numeric" })}`, u: "hotel.html" },
      { e: "👕", t: "T-Shirts", s: C.shirts.colors.map((c) => c.name).join(" · "), u: "tshirts.html" },
      { e: "🏙️", t: "Around Indy", s: "Food, bars, sights & more", u: "visitindy.html" },
      { e: "💬", t: "Contact", s: "Text or email the committee", u: "ContactUs.html" },
    ];

    const glance = soon("Schedule.html") ? "" : `<section class="section"><div class="sec-title">Weekend at a glance <a class="r" href="Schedule.html">Full schedule →</a></div>
      <div class="grid g2" style="gap:8px">${C.schedule.map((d) => `<a class="stat" href="Schedule.html#d${d.date}" style="text-decoration:none;color:inherit${d.date === todayStr() ? ";border-color:rgba(212,245,60,.5)" : ""}">
        <div class="k">${fmtDay(d.date, { weekday: "long" })} · ${fmtDay(d.date, { month: "short", day: "numeric" })}</div>
        ${d.items.filter((i) => !i.quiet && !/coffee|lunch/i.test(i.title)).map((i) => `<div class="small" style="margin-top:3px"><span>${i.icon}</span> ${esc(i.title)} <span class="faint">${i.timeLabel && !/gone/i.test(i.timeLabel) ? esc(i.timeLabel) : fmtT(i.start)}</span></div>`).join("")}
      </a>`).join("")}</div></section>`;

    const spons = Object.entries(C.sponsors.counts).map(([tier, n]) => `<div class="sp-tier t${tier}">${Array.from({ length: n }, (_, i) => {
      const f = `tier${tier}sponsor${String(i + 1).padStart(2, "0")}`; const link = C.sponsors.links[f];
      const img = `<img src="${f}.jpg" alt="Sponsor" onload="this.closest('.sp').classList.add('ok')" onerror="this.closest('.sp').remove()">`;
      return link ? `<a class="sp" href="${link}" target="_blank" rel="noopener">${img}</a>` : `<div class="sp">${img}</div>`;
    }).join("")}</div>`).join("");

    root.innerHTML = `
      <section class="card hero hl fade-in">
        <div class="logo-plate"><img src="${C.logo}" alt="${C.year} ${C.name} presented by our title sponsor"></div>
        <div class="datebar"><span>${fmtDay(C.startDate, { month: "long", day: "numeric" })}–${dObj(C.endDate).getDate()}, ${C.year}</span><i></i><span>${C.city}</span></div>
        ${heroExtra}
        ${ph === "live" ? "" : `<div class="btn-row two mt20" style="max-width:420px;margin-left:auto;margin-right:auto">${regBtn()}${payBtn()}</div>`}
      </section>
      ${ph === "live" ? `<section class="card live-panel mt12 fade-in" id="livePanel"></section>` : ""}
      ${hotelOpen && daysUntil(at(C.hotel.bookBy, "23:59")) <= 45 ? `<a class="callout warn mt12" href="hotel.html"><div class="ic">⏰</div><div><div class="t">${daysUntil(at(C.hotel.bookBy, "23:59"))} days left for the ${C.hotel.rate} hotel rate</div><div class="s">Group rate ends ${fmtDay(C.hotel.bookBy, { month: "long", day: "numeric" })} or when the block sells out. Tap to book →</div></div></a>` : ""}
      <section class="section"><div class="sec-title">Everything you need</div>
        <div class="tiles">${tiles.map((t) => `<a class="tile${t.f ? " feature" : ""}" href="${href(t.u)}"><div class="ti">${t.e}</div><div><div class="tt">${esc(t.t)}</div>${t.f ? `<div class="ts">${esc(t.s)}</div>` : ""}</div>${t.f ? "" : `<div class="ts">${esc(t.s)}</div>`}${soon(t.u) ? '<span class="soon">Soon</span>' : ""}${t.f && !soon(t.u) ? '<span class="arrow">→</span>' : ""}</a>`).join("")}</div>
      </section>
      ${glance}
      <section class="section"><div class="sec-title">Player FAQ</div>
        <div class="faq">${C.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div class="a">${a}</div></details>`).join("")}</div>
      </section>
      <section class="section sp-sec"><div class="sec-title">Thank you, sponsors</div><div class="sponsors">${spons}</div></section>`;

    // Fix links in FAQ that point to coming-soon pages
    $$(".faq a[href]", root).forEach((a) => { const u = a.getAttribute("href"); if (!/^(https?|mailto|sms|tel):/.test(u)) a.href = href(u); });

    if (ph === "live") {
      const draw = () => {
        const n = now();
        const live = timeline.filter((x) => !x.quiet && x.s <= n && x.e > n);
        const next = timeline.filter((x) => !x.quiet && x.s > n).slice(0, 2);
        const row = (x, tag) => `<a class="live-row" href="${x.link ? href(x.link) : href("Schedule.html")}" style="text-decoration:none;color:inherit"><div class="e">${x.icon}</div><div style="flex:1;min-width:0">
          <div class="tag">${tag}</div><div class="tt">${esc(x.title)}</div><div class="mt">${x.timeLabel ? esc(x.timeLabel) : fmtRange(x.start, x.end)}${x.date !== todayStr() ? " · " + fmtDay(x.date, { weekday: "short" }) : ""}${venue(x.venue) ? " · " + esc(venue(x.venue).name) : ""}</div></div><span class="faint">›</span></a>`;
        $("#livePanel").innerHTML = `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><span class="pill live">Tournament live</span><span class="small faint">${n.toLocaleString("en-US", { timeZone: "America/New_York", weekday: "long", hour: "numeric", minute: "2-digit" })}</span></div>
          ${live.map((x) => row(x, "Happening now")).join("")}${next.map((x) => row(x, "Up next")).join("")}
          ${!live.length && !next.length ? `<p class="muted mt8">That's all for this year. See you next June! 🎾</p>` : ""}
          <div class="btn-row two mt12"><a class="btn primary" href="${C.links.courts}">🎾 Court Assignments</a><a class="btn" href="${C.links.consolation}">🏆 Consolation</a></div>`;
      };
      draw(); setInterval(draw, 30000);
    }
  };

  /* ── SCHEDULE ─────────────────────────────────────────────────── */
  P.schedule = (root) => {
    const td = todayStr();
    root.innerHTML = `
      <div class="page-head"><div class="eyebrow">${C.year} ${C.name}</div><h1 class="h1">Schedule</h1>
        <p class="lead">Everything happening Thursday through Sunday. Times are Eastern and may shift — check back during the weekend.</p>
        <div class="btn-row mt16"><button class="btn sm" id="calAll">📅 Add whole weekend to my calendar</button><a class="btn sm sky" href="${C.links.courts}">🎾 Court Assignments</a></div></div>
      <div class="daytabs" role="tablist">${C.schedule.map((d) => `<button class="daytab${d.date === td ? " today" : ""}" data-d="${d.date}"><small>${fmtDay(d.date, { weekday: "short" })}</small><b>${dObj(d.date).getDate()}</b></button>`).join("")}</div>
      <div id="days"></div>`;
    const days = $("#days", root);
    const draw = () => {
      const n = now();
      days.innerHTML = C.schedule.map((d, di) => {
        const its = timeline.filter((x) => x.date === d.date);
        return `<section class="day${d.items.some((i) => i.gold) ? " gold" : ""}" id="d${d.date}">
          <div class="day-h"><h2>${fmtDay(d.date, { weekday: "long" })}</h2><span>${fmtDay(d.date, { month: "long", day: "numeric" })}</span>${d.date === td ? '<span class="pill ball" style="margin-left:auto">Today</span>' : ""}</div>
          <div class="tl">${its.map((x, ii) => {
            const st = x.e <= n ? " past" : x.s <= n ? " now" : "";
            const [a, b] = x.timeLabel ? (x.timeLabel.includes("–") ? x.timeLabel.split(/\s*–\s*/) : [x.timeLabel, ""]) : [fmtT(x.start), x.end ? fmtT(x.end) : ""];
            return `<article class="ev${x.featured ? " featured" : ""}${x.gold ? " gold" : ""}${x.quiet ? " quiet" : ""}${st}">
              <div class="tm">${esc(a)}${b ? `<small>to ${esc(b)}</small>` : ""}</div>
              <div><div class="ti"><span>${x.icon}</span>${esc(x.title)}${st === " now" ? '<span class="pill live">Now</span>' : ""}${x.featured ? '<span class="pill ball">Featured</span>' : ""}${x.gold ? '<span class="pill gold">Finals</span>' : ""}</div>
                ${x.note ? `<div class="note">${esc(x.note)}</div>` : ""}
                ${x.quiet ? "" : `<div class="meta">${venuePill(x.venue)}${x.link ? `<a class="pill ball" href="${href(x.link)}">${x.play ? "Courts" : "Details"} →</a>` : ""}<button class="pill" data-cal="${di}-${ii}" style="cursor:pointer">＋ Calendar</button></div>`}
              </div></article>`;
          }).join("")}</div></section>`;
      }).join("");
      $$("[data-cal]", days).forEach((b) => b.addEventListener("click", () => {
        const [di, ii] = b.dataset.cal.split("-").map(Number);
        calSheet([timeline.filter((x) => x.date === C.schedule[di].date)[ii]]);
      }));
    };
    draw(); setInterval(draw, 60000);
    $("#calAll").addEventListener("click", () => calSheet(timeline.filter((x) => !x.quiet), "Add the whole weekend"));
    $$(".daytab", root).forEach((b) => b.addEventListener("click", () => {
      document.getElementById("d" + b.dataset.d).scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    const tabs = $$(".daytab", root);
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) tabs.forEach((t) => t.classList.toggle("on", "d" + t.dataset.d === en.target.id));
    }), { rootMargin: "-40% 0px -55% 0px" });
    $$(".day", root).forEach((d) => io.observe(d));
    tabs[0].classList.add("on");
    const target = location.hash ? location.hash.slice(1) : (C.schedule.some((d) => d.date === td) ? "d" + td : "");
    if (target && document.getElementById(target)) setTimeout(() => document.getElementById(target).scrollIntoView({ block: "start" }), 50);
  };

  /* ── EVENT PAGES (Welcome / Banquet) ──────────────────────────── */
  function eventPage(root, E, extraStats, body) {
    const v = venue(E.venue);
    const item = { title: E.title, s: at(E.date, E.start), e: at(E.date, E.end), venue: E.venue };
    root.innerHTML = `
      <div class="page-head"><div class="eyebrow">${C.year} ${C.name} · ${fmtDay(E.date, { weekday: "long" })}</div>
        <h1 class="h1">${esc(E.title)}</h1>${E.tagline ? `<p class="lead">${esc(E.tagline)}</p>` : ""}
        <div class="mt12">${eventStatus(item.s, item.e)}</div></div>
      <div class="grid g2">
        <div class="stat"><div class="k">📅 Date</div><div class="v">${fmtDay(E.date)}</div></div>
        <div class="stat"><div class="k">⏰ Time</div><div class="v">${fmtRange(E.start, E.end)}</div>${extraStats.time || ""}</div>
        <div class="stat span"><div class="k">📍 Location</div><div class="v">${esc(v.name)}</div><div class="s">${esc(v.address)}</div></div>
        ${extraStats.more || ""}
      </div>
      <div class="btn-row two mt12"><a class="btn primary" href="${mapUrl(v.address)}" target="_blank" rel="noopener">🧭 Directions</a><button class="btn" id="cal">📅 Add to calendar</button></div>
      ${body}`;
    $("#cal", root).addEventListener("click", () => calSheet([item]));
  }

  P.welcome = (root) => {
    const W = C.welcome;
    eventPage(root, W, {}, `
      <div class="callout mt16"><div class="ic">${W.perk.icon}</div><div><div class="t">${esc(W.perk.title)}</div><div class="s">${esc(W.perk.sub)}</div></div></div>
      <section class="section"><div class="sec-title">What to know</div><div class="card"><ul class="checklist">${W.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div></section>
      ${photo(W.photo, "Welcome Party at " + venue(W.venue).name)}`);
  };

  P.banquet = (root) => {
    const B = C.banquet;
    eventPage(root, B, { time: `<div class="s">Dinner served at ${esc(B.dinner)}</div>`, more: `<div class="stat span"><div class="k">🍽️ Catering</div><div class="v">${esc(B.caterer)}</div></div>` }, `
      <div class="callout sky mt16"><div class="ic">🌱</div><div><div class="t">Dietary needs?</div><div class="s">${esc(B.dietary)} <a href="${href("ContactUs.html")}">Contact us</a></div></div></div>
      <section class="section"><div class="sec-title">Signature cocktails</div>
        <div class="grid g2 stack">${B.cocktails.map((c) => `<div class="card"><div style="font-size:24px">🍹</div><div style="font-weight:800;margin-top:6px">${esc(c.name)}</div><div class="small muted mt8">${esc(c.recipe)}</div></div>`).join("")}</div>
        <p class="small muted mt12 center">${esc(B.cocktailTip)}</p></section>
      <section class="section"><div class="sec-title">Raffle prizes <span class="r faint">${B.raffle.length} items</span></div>
        <div class="card"><div class="rows">${B.raffle.map(([e, t]) => `<div><span class="e">${e}</span><span>${esc(t)}</span></div>`).join("")}</div>
        ${B.raffleMore ? `<p class="small faint mt12" style="font-style:italic">${esc(B.raffleMore)}</p>` : ""}</div></section>
      ${photo(B.photo, "Player's Banquet at " + venue(B.venue).name)}`);
  };

  /* ── HOTEL ────────────────────────────────────────────────────── */
  P.hotel = (root) => {
    const H = C.hotel, dl = at(H.bookBy, "23:59"), left = daysUntil(dl);
    root.innerHTML = `
      <div class="page-head"><div class="eyebrow">${C.year} ${C.name}</div><h1 class="h1">Host Hotel</h1>
        <p class="lead">${H.name ? esc(H.name) + " — b" : "B"}ook early to lock in the tournament rate.</p>
        <div class="mt12">${left > 0 ? `<span class="pill ${left <= 14 ? "live" : "ball"}">${left} day${left === 1 ? "" : "s"} left at the group rate</span>` : `<span class="pill">Group-rate deadline has passed</span>`}</div></div>
      <div class="grid g2">
        <div class="stat"><div class="k">💳 Tournament rate</div><div class="v big">${esc(H.rate)}<span class="small muted"> / night</span></div></div>
        <div class="stat"><div class="k">⏰ Book by</div><div class="v">${fmtDay(H.bookBy, { month: "long", day: "numeric", year: "numeric" })}</div></div>
        <div class="stat"><div class="k">✅ Check in</div><div class="v">${fmtDay(H.checkIn, { weekday: "short", month: "short", day: "numeric" })}</div></div>
        <div class="stat"><div class="k">🏁 Check out</div><div class="v">${fmtDay(H.checkOut, { weekday: "short", month: "short", day: "numeric" })}</div></div>
        ${H.address ? `<div class="stat span"><div class="k">📍 Address</div><div class="v">${esc(H.name)}</div><div class="s"><a href="${mapUrl(H.address)}" target="_blank" rel="noopener">${esc(H.address)} ↗</a></div></div>` : ""}
      </div>
      <a class="btn primary block mt16" href="${H.bookingUrl}" target="_blank" rel="noopener noreferrer">Book the host hotel ↗</a>
      <div class="callout warn mt12"><div class="ic">⚠️</div><div><div class="t">Book before ${fmtDay(H.bookBy, { month: "long", day: "numeric" })}</div>
        <div class="s">After that — or if the room block sells out early — only standard rates are available. Book early to lock in your spot.</div></div></div>
      ${photo(H.photo, "Host hotel")}`;
  };

  /* ── CONTACT ──────────────────────────────────────────────────── */
  P.contact = (root) => {
    const K = C.contact;
    root.innerHTML = `
      <div class="page-head"><div class="eyebrow">${C.year} ${C.name}</div><h1 class="h1">Contact Us</h1><p class="lead">Questions about registration, the schedule, or anything else? We'd love to hear from you.</p></div>
      <div class="grid g2 stack">
        <a class="card" href="sms:+${K.phone}" style="text-decoration:none;color:inherit"><div style="font-size:26px">💬</div><div class="eyebrow mt8">Text us</div><div style="font-weight:800;font-size:18px;margin-top:4px">${esc(K.phoneDisplay)}</div><div class="small muted">${esc(K.phoneNote)}</div></a>
        <a class="card" href="mailto:${K.email}" style="text-decoration:none;color:inherit"><div style="font-size:26px">📧</div><div class="eyebrow mt8">Email</div><div style="font-weight:800;font-size:15.5px;margin-top:4px;word-break:break-all">${esc(K.email)}</div><div class="small muted">We usually reply within a day</div></a>
      </div>
      <div class="btn-row mt12"><button class="btn sm" data-copy="${esc(K.email)}">Copy email</button><button class="btn sm" data-copy="${esc(K.phoneDisplay)}">Copy number</button></div>
      <section class="section"><div class="sec-title">Tournament committee</div>
        <div class="grid g2 stack">${C.committee.map(([r, n]) => `<div class="stat"><div class="k">${esc(r)}</div><div class="v">${esc(n)}</div></div>`).join("")}</div>
        <div class="callout mt12" style="justify-content:center;align-items:center"><div class="ic">🎾</div><div class="t">And many more — thank you all!</div></div></section>`;
    $$("[data-copy]", root).forEach((b) => b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); toast("Copied!"); } catch { toast(b.dataset.copy); }
    }));
  };

  /* ── T-SHIRTS ─────────────────────────────────────────────────── */
  P.shirts = (root) => {
    root.innerHTML = `
      <div class="page-head"><div class="eyebrow">${C.year} ${C.name}</div><h1 class="h1">T-Shirts</h1><p class="lead">${esc(C.shirts.note)}.</p></div>
      <div class="shirts">${C.shirts.colors.map((c) => `<button class="card shirt" data-src="${esc(c.img)}" data-alt="${esc(c.name)} t-shirt">
          <div class="shirt-img"><img src="${esc(c.img)}" alt="${esc(c.name)} t-shirt" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'shirt-ph',textContent:'👕'}))"></div>
          <div class="shirt-lbl"><span class="sw" style="background:${c.hex}"></span>${esc(c.name)}<span class="faint small" style="margin-left:auto">Tap to zoom</span></div></button>`).join("")}</div>
      <div class="btn-row two mt16">${regBtn()}<a class="btn" href="index.html">Back home</a></div>
      <style>.shirts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .shirt{padding:12px;cursor:pointer;text-align:left;border:1px solid var(--line)}
        .shirt-img{aspect-ratio:1;border-radius:12px;overflow:hidden;background:var(--bg-2);display:grid;place-items:center}
        .shirt-img img{width:100%;height:100%;object-fit:contain}.shirt-ph{font-size:64px;opacity:.5}
        .shirt-lbl{display:flex;align-items:center;gap:8px;margin-top:10px;font-weight:700}
        .sw{width:14px;height:14px;border-radius:50%;border:1px solid rgba(255,255,255,.3)}
        @media(max-width:640px){.shirts{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:78%;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -16px;padding:0 16px 6px;scrollbar-width:none}
        .shirts::-webkit-scrollbar{display:none}.shirt{scroll-snap-align:center}}</style>`;
    $$(".shirt", root).forEach((b) => b.addEventListener("click", () => { if ($("img", b)) lightbox(b.dataset.src, b.dataset.alt); }));
  };

  /* ── COMING SOON (holdhorse) ──────────────────────────────────── */
  P.soon = (root) => {
    const p = new URLSearchParams(location.search).get("p") || "";
    const name = MAP.flatMap((g) => g.items).find(([, , u]) => u.toLowerCase() === p.toLowerCase())?.[1] || "This page";
    root.innerHTML = `<section class="card hero hl fade-in" style="padding-top:34px">
        <img src="horse.jpg.png" alt="Hold your horses" style="width:min(240px,70%);margin:0 auto;border-radius:16px" onerror="this.replaceWith(Object.assign(document.createElement('div'),{textContent:'🐎',style:'font-size:56px;line-height:1'}))">
        <h1 class="h1" style="margin-top:12px">Hold your horses!</h1>
        <p class="lead" style="margin:0 auto"><b style="color:var(--text)">${esc(name)}</b> for ${C.year} is still being put together. Check back soon — we'll text registered players when it's live.</p>
        ${phase() === "before" ? countdownHTML(firstServe, "until first serve") : ""}
        <div class="btn-row two mt20" style="max-width:420px;margin-left:auto;margin-right:auto"><a class="btn" href="index.html">← Home</a>${regBtn()}</div>
      </section>`;
  };

  /* ── boot ─────────────────────────────────────────────────────── */
  function boot() {
    chrome();
    const key = document.body.dataset.page, root = $("#app");
    if (key && P[key] && root) P[key](root);
    tickCountdowns(); if ($("[data-cd]")) setInterval(tickCountdowns, 1000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  // expose helpers for page-specific scripts (Financials, Around Indy, Consolation)
  window.ICsite = { esc, toast, openSheet, closeSheet, now, href, lightbox };
})();
