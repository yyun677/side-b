/* SIDE B — Worry Stone
 * Hash routes:
 *   #issue-rumi … #issue-bloom   QR entry: the printer issues that stone's ID card
 *   #home                        three menus
 *   #stone  (#stone-rumi opens that card)   #archive   #book
 * A QR may also use ?stone=rumi — it is turned into #issue-rumi.
 */
(() => {
  const D = window.SIDEB;
  const STONES = D.stones;
  const byId = Object.fromEntries(STONES.map((s) => [s.id, s]));
  const img = {
    stone: (id) => `assets/img/stones/${id}.png`,
    card: (id) => `assets/img/cards/${id}.png`,
    cert: (id) => `assets/img/certificates/${id}.jpg`,
    bg: (id) => `assets/img/backgrounds/${id}.jpg`,
  };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- fit the 402 x 874 design to the screen ---------- */
  function fit() {
    const w = window.innerWidth, h = window.innerHeight;
    document.documentElement.style.setProperty("--z", Math.min(w / 402, h / 874));
    document.documentElement.style.setProperty("--zw", Math.min(w / 402, 1.6));
  }
  fit();
  addEventListener("resize", fit);

  /* ---------- shared chrome ---------- */
  const titlebarHTML = $(".view-home .titlebar").innerHTML;
  const tabsHTML = `
    <a class="tab tab-home" href="#home">HOME</a>
    <a class="tab tab-stone" href="#stone" data-tab="stone">STONE</a>
    <a class="tab tab-archive" href="#archive" data-tab="archive">ARCHIVE</a>
    <a class="tab tab-book" href="#book" data-tab="book">BOOK</a>`;
  $$('[data-include="titlebar"]').forEach((el) => (el.innerHTML = titlebarHTML));
  $$('[data-include="tabs"]').forEach((el) => {
    el.innerHTML = tabsHTML;
    const view = el.closest(".view").dataset.view;
    const cur = el.querySelector(`[data-tab="${view}"]`);
    if (cur) cur.setAttribute("aria-current", "page");
  });

  /* ---------- STONE list ---------- */
  // thumb placement inside the 109 x 85 gradient box, from Figma
  const THUMB = {
    rumi: [24, 10, 62, 65], spark: [9, 3, 92, 80], veil: [21, 9, 67, 68],
    soul: [25, 13, 59, 60], bloom: [16, 9, 77, 67],
  };
  $(".stone-list").innerHTML = STONES.map((s, i) => {
    const [x, y, w, h] = THUMB[s.id] || [20, 8, 70, 70];
    return `<li class="stone-row" style="top:${i * 105}px" data-id="${s.id}" role="button" tabindex="0" aria-label="${s.name} 카드 보기">
      <div class="thumb"><img src="${img.stone(s.id)}" alt="" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>
      <p class="nm">${s.name}</p><p class="sb">${s.sub}</p>
      <span class="go" aria-hidden="true">&gt;</span>
    </li>`;
  }).join("");
  $(".stone-list").addEventListener("click", (e) => {
    const row = e.target.closest(".stone-row");
    if (row) location.hash = "stone-" + row.dataset.id;
  });
  $(".stone-list").addEventListener("keydown", (e) => {
    const row = e.target.closest(".stone-row");
    if (row && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); location.hash = "stone-" + row.dataset.id; }
  });
  const pop = $(".card-pop");
  pop.addEventListener("click", () => (location.hash = "stone"));

  /* ---------- ARCHIVE ---------- */
  const archive = $(".archive");
  const frames = $(".poster-frames", archive);
  const stills = $(".stills", archive);
  const play = $(".play", archive);
  const SHOTS = D.archiveStills || [];
  frames.innerHTML = SHOTS.map((src, i) => `<img src="${src}" alt="" class="${i ? "" : "on"}">`).join("");
  stills.innerHTML = SHOTS.map((src, i) =>
    `<button type="button" role="listitem" class="still${i ? "" : " on"}" data-i="${i}" aria-label="장면 ${i + 1}"><img src="${src}" alt=""></button>`).join("");
  $("[data-total]", archive).textContent = String(SHOTS.length).padStart(2, "0");
  let shot = 0, shotTimer = null;
  function showShot(i) {
    shot = (i + SHOTS.length) % SHOTS.length;
    $$("img", frames).forEach((im, k) => im.classList.toggle("on", k === shot));
    $$(".still", stills).forEach((b, k) => b.classList.toggle("on", k === shot));
    $("[data-cur]", archive).textContent = String(shot + 1).padStart(2, "0");
  }
  function startShots() { stopShots(); if (SHOTS.length > 1) shotTimer = setInterval(() => showShot(shot + 1), 3200); }
  function stopShots() { clearInterval(shotTimer); shotTimer = null; }
  stills.addEventListener("click", (e) => {
    const b = e.target.closest(".still");
    if (!b) return;
    showShot(+b.dataset.i);
    if (player.hidden) startShots();
  });
  play.href = D.youtubeId ? `https://youtu.be/${D.youtubeId}` : D.youtubeUrl;
  // The video plays in a full-width layer outside the zoomed 402px stage:
  // iOS Safari draws iframes inside a CSS-zoomed box at the wrong size.
  const player = document.createElement("div");
  player.className = "player";
  player.hidden = true;
  player.innerHTML = `<div class="player-box"></div><button type="button" class="player-close">닫기</button>`;
  document.body.appendChild(player);
  play.addEventListener("click", (e) => {
    if (!D.youtubeId) return; // no embed: open YouTube in a new tab
    e.preventDefault();
    stopShots();
    $(".player-box", player).innerHTML =
      `<iframe src="https://www.youtube-nocookie.com/embed/${D.youtubeId}?autoplay=1&playsinline=1&rel=0"
        title="67ID archive" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    player.hidden = false;
  });
  function closePlayer() {
    $(".player-box", player).innerHTML = "";
    player.hidden = true;
  }
  $(".player-close", player).addEventListener("click", () => { closePlayer(); startShots(); });
  player.addEventListener("click", (e) => { if (e.target === player) { closePlayer(); startShots(); } });
  function resetArchive() {
    stopShots();
    closePlayer();
  }
  $(".yt-link").href = D.youtubeId ? `https://youtu.be/${D.youtubeId}` : D.youtubeUrl;

  /* ---------- save certificate ---------- */
  const sheet = $(".sheet");
  $(".sheet button").addEventListener("click", () => (sheet.hidden = true));
  let certFile = null, certURL = null;
  async function prepareCert(id) {
    certFile = null; certURL = img.cert(id);
    try {
      const blob = await (await fetch(certURL)).blob();
      certURL = URL.createObjectURL(blob);
      certFile = new File([blob], `SIDE-B_${id.toUpperCase()}.jpg`, { type: "image/jpeg" });
    } catch (_) { /* opened from file:// — the sheet fallback still works */ }
  }
  async function saveCert() {
    if (certFile && navigator.canShare && navigator.canShare({ files: [certFile] })) {
      try { await navigator.share({ files: [certFile] }); return; }
      catch (err) { if (err && err.name === "AbortError") return; }
    }
    $("img", sheet).src = certURL;
    sheet.hidden = false;
  }
  $(".btn-save").addEventListener("click", saveCert);
  $(".btn-home").addEventListener("click", () => (location.hash = "home"));

  /* ---------- ISSUE (printer) ---------- */
  const issue = $(".view-issue");
  const feedCard = $(".feed-card");
  let issueRun = 0;

  function emergeFrames() {
    const steps = [ // [% out, move ms, pause ms]
      [4, 260, 520], [18, 420, 200], [33, 420, 180], [49, 420, 200],
      [64, 420, 180], [79, 420, 200], [92, 420, 160], [100, 520, 0],
    ];
    const total = steps.reduce((a, s) => a + s[1] + s[2], 0);
    const tf = (p, x) => `translate(${x}px, ${-101 + p * 1.01}%)`;
    const frames = [{ transform: tf(0, 0), offset: 0, easing: "cubic-bezier(.3,0,.2,1)" }];
    let t = 0;
    steps.forEach(([p, m, pause], i) => {
      t += m;
      frames.push({ transform: tf(p, i % 2 ? 0.5 : -0.5), offset: t / total, easing: "cubic-bezier(.3,0,.2,1)" });
      if (pause) { t += pause; frames.push({ transform: tf(p, 0), offset: t / total }); }
    });
    return { frames, total };
  }

  async function runIssue(id) {
    const s = byId[id] || STONES[0];
    const run = ++issueRun;
    issue.classList.remove("printing", "printed", "unclip", "bar-off", "ready");
    $("[data-stone-no]", issue).textContent = s.no;
    feedCard.getAnimations().forEach((a) => a.cancel());
    feedCard.style.transform = "";
    feedCard.alt = `${s.name} ID 카드`;
    $(".bg-stone", issue).style.backgroundImage = `url("${img.bg(s.id)}")`;
    prepareCert(s.id);
    await new Promise((res) => {
      feedCard.onload = res; feedCard.onerror = res;
      feedCard.src = img.card(s.id);
      if (feedCard.complete) res();
    });
    await wait(700);
    if (run !== issueRun) return;

    issue.classList.add("printing");
    const { frames, total } = emergeFrames();
    const anim = feedCard.animate(frames, { duration: total, fill: "forwards" });
    await anim.finished.catch(() => {});
    if (run !== issueRun) return;
    issue.classList.remove("printing");
    // the bar still covers the top of the card here, so un-clipping is invisible
    issue.classList.add("unclip");
    await wait(450);
    if (run !== issueRun) return;
    issue.classList.add("bar-off", "printed");   // bar lifts away, title swaps in
    await wait(1400);
    if (run !== issueRun) return;
    issue.classList.add("ready");                // HOME / 증서 저장하기
  }

  /* ---------- router ---------- */
  function route() {
    // QR may use ?stone=rumi
    const q = new URLSearchParams(location.search).get("stone");
    if (q && byId[q] && !location.hash) {
      history.replaceState(null, "", location.pathname + "#issue-" + q);
    }
    const h = (location.hash || "#home").slice(1);
    let view = h, param = null;
    const m = h.match(/^(issue|stone)-([a-z]+)$/);
    if (m) { view = m[1]; param = m[2]; }
    if (!$(`.view[data-view="${view}"]`)) view = "home";

    $$(".view").forEach((v) => (v.hidden = v.dataset.view !== view));
    sheet.hidden = true;

    if (view === "archive") { showShot(0); startShots(); } else resetArchive();
    if (view === "issue") runIssue(param);
    else issueRun++;

    if (view === "stone" && param && byId[param]) {
      $(".card-pop-img").src = img.card(param);
      $(".card-pop-img").alt = `${byId[param].name} ID 카드`;
      pop.hidden = false;
    } else {
      pop.hidden = true;
    }
    if (view === "book" && !param) $(".view-book").scrollTop = 0;
  }
  addEventListener("hashchange", route);
  route();
})();
