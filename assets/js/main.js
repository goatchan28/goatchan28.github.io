(function () {
  const SITE = window.SITE;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const photoById = Object.fromEntries(SITE.photos.map((p) => [p.id, p]));

  /* ---------- Hero: one load moment ---------- */
  const heroImg = document.querySelector(".hero-media img");
  if (heroImg) {
    const ready = () => document.documentElement.classList.add("hero-ready");
    heroImg.complete ? ready() : heroImg.addEventListener("load", ready);
    setTimeout(ready, 2500); // never leave the name hidden on a slow connection
  }

  /* ---------- Currently reading: a small stack of book spines ---------- */
  document.querySelectorAll("[data-reading]").forEach((el) => {
    const books = SITE.reading || [];
    if (!books.length) { el.remove(); return; }
    const colors = ["#23408E", "#5C6B4C", "#9A4B3B", "#4A4A52"];
    el.innerHTML = `<p class="reading-label">Currently reading</p>
      <ul class="stack">${books.map((b, i) => `
        <li class="spine" style="--spine:${b.color || colors[i % colors.length]}">
          <cite>${esc(b.title)}</cite><span>${esc(b.author)}</span>
        </li>`).join("")}
      </ul>`;
  });

  /* ---------- Project index ---------- */
  function mediaHTML(p) {
    if (!p.media.length) {
      return ""; // no media yet: show only the links
    }
    return p.media.map((m) => {
      if (m.type === "video") {
        return `<figure class="media-item media-video"><video controls preload="none" playsinline poster="${esc(m.poster)}" src="${esc(m.src)}"></video>${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ""}</figure>`;
      }
      return `<figure class="media-item${m.ratio === "auto" ? " media-natural" : ""}${m.wide ? " media-wide media-natural" : ""}"><img src="${esc(m.src)}" alt="${esc(m.alt || "")}" loading="lazy">${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ""}</figure>`;
    }).join("");
  }

  function entryHTML(p) {
    const preview = p.preview || (p.media.find((m) => m.type !== "video") || {}).src || "";
    const links = p.links.length ? `<p class="entry-links">${p.links.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}</p>` : "";
    return `
      <li class="entry" id="${esc(p.id)}" ${preview ? `data-preview="${esc(preview)}"` : ""}>
        <button class="entry-row" type="button" aria-expanded="false" aria-controls="${esc(p.id)}-detail">
          <span class="entry-date">${esc(p.dates)}</span>
          <span class="entry-title">${esc(p.title)}${p.context ? `<span class="entry-context">${esc(p.context)}</span>` : ""}</span>
          <span class="entry-summary">${esc(p.summary)}</span>
          <span class="entry-stack">${esc(p.stack)}</span>
          <span class="entry-toggle" aria-hidden="true"></span>
        </button>
        <div class="entry-detail" id="${esc(p.id)}-detail" inert>
          <div class="entry-detail-inner">
            ${p.media.length ? `<div class="entry-media">${mediaHTML(p)}</div>` : ""}
            <div class="with-note">
              <div class="entry-body">${(p.body || []).map((t) => `<p>${esc(t)}</p>`).join("")}${p.did && p.did.length ? `<ul class="entry-did">${p.did.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}${links}</div>
              ${p.note ? `<aside class="note">${esc(p.note)}</aside>` : ""}
            </div>
          </div>
        </div>
      </li>`;
  }

  function setOpen(entry, open) {
    entry.classList.toggle("is-open", open);
    entry.querySelector(".entry-row").setAttribute("aria-expanded", String(open));
    const detail = entry.querySelector(".entry-detail");
    if (open) detail.removeAttribute("inert");
    else {
      detail.setAttribute("inert", "");
      const v = detail.querySelector("video");
      if (v) v.pause();
    }
  }

  document.querySelectorAll("[data-projects]").forEach((list) => {
    const which = list.dataset.projects;
    const projects = which === "featured"
      ? SITE.featured.map((id) => SITE.projects.find((p) => p.id === id)).filter(Boolean)
      : SITE.projects;
    list.innerHTML = projects.map(entryHTML).join("");
    list.addEventListener("click", (e) => {
      const row = e.target.closest(".entry-row");
      if (!row) return;
      const entry = row.closest(".entry");
      setOpen(entry, !entry.classList.contains("is-open"));
      hidePreview();
    });
  });

  // Open a project linked by hash, e.g. projects.html#robin
  if (location.hash) {
    const entry = document.querySelector(`.entry${CSS.escape(location.hash)}`);
    if (entry) { setOpen(entry, true); entry.scrollIntoView({ block: "start" }); }
  }

  /* ---------- Hover preview that follows the cursor ---------- */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const preview = document.createElement("img");
  preview.className = "cursor-preview";
  preview.alt = "";
  document.body.appendChild(preview);
  let previewEntry = null;

  function hidePreview() { preview.classList.remove("is-visible"); previewEntry = null; }

  if (finePointer) {
    document.addEventListener("pointermove", (e) => {
      const entry = e.target.closest && e.target.closest(".entry[data-preview]");
      const overRow = e.target.closest && e.target.closest(".entry-row");
      if (!entry || !overRow || entry.classList.contains("is-open")) return hidePreview();
      if (previewEntry !== entry) {
        preview.src = entry.dataset.preview;
        previewEntry = entry;
      }
      const w = preview.offsetWidth || 320, h = preview.offsetHeight || 200;
      let x = e.clientX + 28, y = e.clientY - h / 2;
      if (x + w > window.innerWidth - 16) x = e.clientX - w - 28;
      y = Math.max(16, Math.min(y, window.innerHeight - h - 16));
      preview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      preview.classList.add("is-visible");
    });
    document.addEventListener("scroll", hidePreview, { passive: true });
  }

  /* ---------- Photos ---------- */
  function photoButton(p, index, group) {
    const ar = (p.w / p.h).toFixed(4);
    return `<button class="photo" type="button" style="--ar:${ar}" data-group="${group}" data-index="${index}" aria-label="Open photo: ${esc(p.caption)}">
      <img src="images/photography/${esc(p.id)}-800.jpg" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" loading="lazy">
    </button>`;
  }

  const groups = {};

  document.querySelectorAll("[data-strip]").forEach((el) => {
    const list = SITE.homeStrip.map((id) => photoById[id]).filter(Boolean);
    groups.strip = list;
    const more = photoById[SITE.stripMore] || SITE.photos.find((p) => !SITE.homeStrip.includes(p.id));
    el.innerHTML = list.map((p, i) => photoButton(p, i, "strip")).join("") + (more ? `
      <a class="strip-more" href="photography.html">
        <img src="images/photography/${esc(more.id)}-800.jpg" alt="" loading="lazy">
        <span class="strip-more-label">See all ${SITE.photos.length} photographs</span>
      </a>` : "");
  });

  // Arrows beside the strip: scroll by most of a screen, hide at either end
  document.querySelectorAll(".strip-wrap").forEach((wrap) => {
    const strip = wrap.querySelector(".strip");
    const prev = wrap.querySelector("[data-strip-prev]");
    const next = wrap.querySelector("[data-strip-next]");
    const smooth = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const update = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      prev.classList.toggle("is-hidden", strip.scrollLeft <= 4);
      next.classList.toggle("is-hidden", strip.scrollLeft >= max - 4);
    };
    const go = (dir) => strip.scrollBy({ left: dir * strip.clientWidth * 0.8, behavior: smooth });
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    strip.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    strip.querySelectorAll("img").forEach((im) => im.addEventListener("load", update));
    window.addEventListener("load", update);
    document.fonts && document.fonts.ready.then(update);
    requestAnimationFrame(update);
    update();
  });

  document.querySelectorAll("[data-gallery]").forEach((el) => {
    // Shuffle so the order is different on every visit
    const list = SITE.photos.slice();
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    groups.all = list;
    el.innerHTML = `<div class="justified">${list.map((p, i) => photoButton(p, i, "all")).join("")}</div>`;
  });

  /* ---------- Scroll reveal for the gallery ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gallery = document.querySelector("[data-gallery]");
  if (gallery && "IntersectionObserver" in window && !reduceMotion) {
    gallery.classList.add("reveal");
    const io = new IntersectionObserver((entries) => {
      // reveal photos that arrive together left-to-right, top-to-bottom, slightly staggered
      const arriving = entries.filter((e) => e.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left));
      arriving.forEach((e, i) => {
        e.target.style.setProperty("--delay", `${Math.min(i, 6) * 80}ms`);
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.12 });
    gallery.querySelectorAll(".photo").forEach((el) => io.observe(el));
  }

  /* ---------- Scroll reveal for the About page ---------- */
  if (document.body.classList.contains("page-about") && "IntersectionObserver" in window && !reduceMotion) {
    const items = [];
    document.querySelectorAll(".overlap").forEach((sec) => {
      sec.querySelectorAll(".overlap-photo img").forEach((img, i) => items.push([img, i * 140]));
      const card = sec.querySelector(".overlap-card");
      if (card) items.push([card, 220]); // the card arrives just after its photo
    });
    document.querySelectorAll(".statement, .contact").forEach((el) => items.push([el, 0]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(([el, delay]) => {
      el.classList.add("reveal-el");
      el.style.setProperty("--delay", `${delay}ms`);
      io.observe(el);
    });
  }

  /* ---------- Lightbox with a zoom from and back to the thumbnail ---------- */
  const box = document.querySelector(".lightbox");
  if (box) {
    const img = box.querySelector(".lightbox-img");
    const stage = box.querySelector(".lightbox-stage");
    const cap = box.querySelector(".lightbox-caption");
    const count = box.querySelector(".lightbox-count");
    const chrome = [box.querySelector(".lightbox-bar"), box.querySelector(".lightbox-foot")];
    const EASE = "cubic-bezier(.2,.7,.2,1)";
    const OPEN_MS = reduceMotion ? 0 : 520;
    const CLOSE_MS = reduceMotion ? 0 : 420;
    let list = [], group = "", idx = 0, busy = false;

    const thumbFor = (i) => document.querySelector(`.photo[data-group="${group}"][data-index="${i}"]`);

    function sizeImage() {
      const p = list[idx];
      const cs = getComputedStyle(stage);
      const availW = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const availH = stage.clientHeight;
      const scale = Math.min(availW / p.w, availH / p.h, 1);
      img.style.width = `${Math.round(p.w * scale)}px`;
      img.style.height = `${Math.round(p.h * scale)}px`;
    }

    function show(i) {
      idx = (i + list.length) % list.length;
      const p = list[idx];
      // start with the cached thumbnail, swap to the large file once it has loaded
      img.src = `images/photography/${p.id}-800.jpg`;
      const full = new Image();
      full.onload = () => { if (list[idx] === p) img.src = full.src; };
      full.src = `images/photography/${p.id}-2000.jpg`;
      img.alt = p.alt;
      cap.textContent = p.caption;
      count.textContent = `${idx + 1} / ${list.length}`;
      sizeImage();
    }

    // transform that makes the lightbox image sit exactly over a thumbnail
    function flipFrom(rect) {
      const last = img.getBoundingClientRect();
      return `translate(${rect.left - last.left}px, ${rect.top - last.top}px) scale(${rect.width / last.width}, ${rect.height / last.height})`;
    }
    const inView = (r) => r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;

    function open(btn) {
      if (busy) return;
      group = btn.dataset.group;
      list = groups[group];
      document.documentElement.classList.add("lightbox-open");
      box.showModal();
      show(Number(btn.dataset.index));
      const from = btn.getBoundingClientRect();
      if (!OPEN_MS) return;
      busy = true;
      btn.style.visibility = "hidden";
      const anim = img.animate([{ transform: flipFrom(from) }, { transform: "none" }], { duration: OPEN_MS, easing: EASE });
      box.animate([{ backgroundColor: "rgba(246,246,243,0)" }, { backgroundColor: "rgba(246,246,243,1)" }], { duration: OPEN_MS * 0.8, easing: "ease-out" });
      chrome.forEach((el) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, delay: OPEN_MS * 0.55, fill: "backwards" }));
      anim.onfinish = anim.oncancel = () => { btn.style.visibility = ""; busy = false; };
    }

    function close() {
      if (busy || !box.open) return;
      const finish = () => {
        box.close();
        document.documentElement.classList.remove("lightbox-open");
        const t = thumbFor(idx);
        if (t) { t.style.visibility = ""; t.focus({ preventScroll: true }); }
        busy = false;
      };
      if (!CLOSE_MS) return finish();
      busy = true;
      const thumb = thumbFor(idx);
      const to = thumb && thumb.getBoundingClientRect();
      chrome.forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" }));
      box.animate([{ backgroundColor: "rgba(246,246,243,1)" }, { backgroundColor: "rgba(246,246,243,0)" }], { duration: CLOSE_MS, easing: "ease-in", fill: "forwards" });
      let anim;
      if (to && inView(to)) {
        thumb.style.visibility = "hidden";
        anim = img.animate([{ transform: "none" }, { transform: flipFrom(to) }], { duration: CLOSE_MS, easing: EASE, fill: "forwards" });
      } else {
        anim = img.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.97)" }], { duration: CLOSE_MS * 0.7, easing: "ease-in", fill: "forwards" });
      }
      anim.onfinish = () => {
        finish();
        // clear the "forwards" fills so the next open starts clean
        img.getAnimations().forEach((a) => a.cancel());
        box.getAnimations().forEach((a) => a.cancel());
        chrome.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
      };
    }

    function step(dir) {
      if (busy) return;
      show(idx + dir);
      if (!reduceMotion) img.animate([{ opacity: 0, transform: `translateX(${dir * 1.25}rem)` }, { opacity: 1, transform: "none" }], { duration: 320, easing: EASE });
    }

    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".photo");
      if (btn) open(btn);
    });
    box.querySelector("[data-prev]").addEventListener("click", () => step(-1));
    box.querySelector("[data-next]").addEventListener("click", () => step(1));
    box.querySelector("[data-close]").addEventListener("click", close);
    box.addEventListener("click", (e) => { if (e.target === box || e.target === stage) close(); });
    box.addEventListener("cancel", (e) => { e.preventDefault(); close(); }); // Esc key
    box.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
    window.addEventListener("resize", () => { if (box.open) sizeImage(); });

    let touchX = null;
    box.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      touchX = null;
    });
  }
})();
