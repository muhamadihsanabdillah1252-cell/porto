/* =========================================================
   MAIN.JS — untuk mengubah ISI website (nama, foto, video, dll)
   cukup edit js/config.js. File ini mengatur render + interaksi,
   biasanya tidak perlu disentuh.
   ========================================================= */

(function () {

  const ICONS = {
    home:  "M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z",
    image: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm2 12 4-5 3 3 3-4 4 6H6Z",
    photo: "M9 4h6l1.5 2H19a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2.5L9 4Zm3 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
    video: "M4 5h11a1 1 0 0 1 1 1v3l4-2v10l-4-2v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
  };

  function svgMask(path) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${path}'/></svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }

  const PAGES = [
    { file: "index.html",     label: "Home",      icon: "home" },
    { file: "poster.html",    label: "Poster",     icon: "image" },
    { file: "fotografi.html", label: "Photographer",  icon: "photo" },
    { file: "video.html",     label: "Video",      icon: "video" }
  ];

  function currentFile() {
    const p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  /* ---------------- PAGE FADE ---------------- */
  function setupWipe() {
    const wipe = document.getElementById("wipe");
    if (!wipe) return;
    requestAnimationFrame(() => wipe.classList.add("reveal"));
    document.querySelectorAll("a[href$='.html']").forEach(a => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (a.target === "_blank" || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        wipe.classList.remove("reveal");
        wipe.classList.add("cover");
        setTimeout(() => { location.href = href; }, 200);
      });
    });
  }

  /* ---------------- SIDEBAR ---------------- */
  function buildSidebar() {
    const mount = document.getElementById("sidebar");
    if (!mount) return;
    const active = currentFile();
    const p = CONFIG.profile;
    const initials = (p.name || "P").trim().slice(0, 1).toUpperCase();

    const links = PAGES.map(pg => `
      <a class="sb-link ${pg.file === active ? "active" : ""}" href="${pg.file}">
        <span class="ic" style="-webkit-mask-image:${svgMask(ICONS[pg.icon])};mask-image:${svgMask(ICONS[pg.icon])}"></span>
        <span class="sb-label">${pg.label}</span>
      </a>
    `).join("");

    mount.innerHTML = `
      <div class="sb-brand">
        <div class="sb-logo">${initials}</div>
        <div>
          <div class="sb-name">${p.name || "Portofolio"}</div>
          <div class="sb-tag">Video Editor & Photographer</div>
        </div>
        <button class="sb-toggle" id="sbToggle" type="button" aria-label="Buka menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
      <nav class="sb-nav" id="sbNav">${links}</nav>
      <div class="sb-foot">© ${new Date().getFullYear()} ${p.name || ""}<br>${p.location || ""}</div>
    `;

    const toggle = document.getElementById("sbToggle");
    const nav = document.getElementById("sbNav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }));
    }
  }

  function attachImgFallback(img, label) {
    img.addEventListener("error", function handler() {
      img.removeEventListener("error", handler);
      img.style.display = "none";
      const ph = document.createElement("div");
      ph.style.cssText = `
        width:100%; height:100%; display:flex; align-items:center; justify-content:center;
        background: var(--slot); color: var(--muted); font-family: var(--mono);
        font-size:.7rem; text-align:center; padding:.7rem; white-space:pre-line;
      `;
      ph.textContent = label || "Gambar belum ditambahkan";
      img.parentElement.appendChild(ph);
    });
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  function setupReveal() {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    els.forEach(el => io.observe(el));
  }

  /* ---------------- HOME ---------------- */
  function renderHome() {
    const titleEl = document.getElementById("home-title");
    if (!titleEl) return;
    const p = CONFIG.profile;

    titleEl.textContent = p.name || "";
    document.getElementById("home-role").textContent = p.role || "";
    document.getElementById("home-desc").textContent = p.bio || "";

    const photo = document.getElementById("home-photo");
    photo.src = p.photo; photo.alt = p.name || "";
    photo.decoding = "async";
    photo.fetchPriority = "high";
    attachImgFallback(photo, "Foto profil (full body)\nbelum ditambahkan");

    // stat counts, computed automatically from config
    document.getElementById("stat-poster").textContent = (CONFIG.posters || []).length;
    document.getElementById("stat-photo").textContent = (CONFIG.photos || []).length;
    document.getElementById("stat-video").textContent = (CONFIG.videos || []).length;

    const meta = document.getElementById("meta-row");
    const rows = [];
    if (p.location) rows.push({ label: "Lokasi", value: p.location });
    if (p.status) rows.push({ label: "Status", value: p.status });
    meta.innerHTML = rows.map(r => `
      <div class="meta-item"><div class="meta-label">${r.label}</div><div class="meta-value">${r.value}</div></div>
    `).join("");

    const actions = document.getElementById("action-row");
    const socials = CONFIG.socials || [];
    actions.innerHTML = socials.map((s, i) => `
      <a class="btn ${i === 0 ? "btn-primary" : "btn-ghost"}" href="${s.url}" target="_blank" rel="noopener">${s.value}</a>
    `).join("");

    const chips = document.getElementById("chip-grid");
    const items = CONFIG.software || [];
    if (!items.length) {
      chips.innerHTML = `<div class="empty-state">Belum ada software ditambahkan. Edit <b>js/config.js</b> → software.</div>`;
      return;
    }
    chips.innerHTML = items.map(s => `
      <div class="chip">
        <img src="${s.logo}" alt="${s.name}" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'ph-logo',textContent:'${(s.initials || s.name.slice(0,2)).toUpperCase()}'}))">
        <span>${s.name}</span>
      </div>
    `).join("");
  }

  /* ---------------- GALLERY (poster / fotografi) ---------------- */
  let LB_ITEMS = [];
  let LB_INDEX = 0;

  function setupGalleryPage(mountId, items, key) {
    const grid = document.getElementById(mountId);
    if (!grid) return;
    const railId = mountId === "poster-grid" ? "poster-filters" : "photo-filters";
    const searchId = mountId === "poster-grid" ? "poster-search" : "photo-search";
    const rail = document.getElementById(railId);
    const search = document.getElementById(searchId);

    if (!items || !items.length) {
      grid.innerHTML = `<div class="empty-state">Belum ada karya ditambahkan.<br>Edit <b>js/config.js</b> → ${key}.</div>`;
      if (rail) rail.innerHTML = "";
      return;
    }

    const categories = [...new Set(items.map(it => it.category || "Umum"))];
    const active = new Set(); // empty = show all

    function renderRail() {
      if (!rail) return;
      rail.innerHTML = `
        <div class="filter-block">
          <h3>Kategori</h3>
          <div class="filter-opts">
            ${categories.map(cat => {
              const count = items.filter(it => (it.category || "Umum") === cat).length;
              return `
                <label class="filter-opt">
                  <input type="checkbox" data-cat="${cat}">
                  ${cat}<span class="fo-count">${count}</span>
                </label>
              `;
            }).join("")}
          </div>
        </div>
      `;
      rail.querySelectorAll("input[type=checkbox]").forEach(cb => {
        cb.addEventListener("change", () => {
          if (cb.checked) active.add(cb.dataset.cat); else active.delete(cb.dataset.cat);
          apply();
        });
      });
    }

    function renderCards(list) {
      grid.innerHTML = list.length ? list.map((it, i) => `
        <div class="slot-card" data-index="${it.__i}" data-reveal style="--d:${(i % 6) * 0.05}s">
          <div class="slot-thumb">
            <img src="${it.image}" alt="${it.title || ""}" loading="lazy" decoding="async">
            <div class="slot-tag">${it.category || "Umum"}</div>
          </div>
          <div class="slot-body">
            <div class="slot-title">${it.title || ""}</div>
            <div class="slot-sub">${it.caption || ""}</div>
            <div class="slot-foot">${it.year ? `<span class="pill">${it.year}</span>` : ""}</div>
          </div>
        </div>
      `).join("") : `<div class="empty-state">Tidak ada karya yang cocok dengan filter/pencarian ini.</div>`;

      grid.querySelectorAll("img").forEach(img => attachImgFallback(img, "Gambar belum ditambahkan"));
      grid.querySelectorAll(".slot-card").forEach(el => {
        el.addEventListener("click", () => openLightbox(items, +el.dataset.index));
      });
      setupReveal();
    }

    function apply() {
      const q = (search ? search.value : "").trim().toLowerCase();
      const filtered = items
        .map((it, i) => ({ ...it, __i: i }))
        .filter(it => (active.size === 0 || active.has(it.category || "Umum")))
        .filter(it => !q || (it.title || "").toLowerCase().includes(q));
      renderCards(filtered);
    }

    renderRail();
    apply();
    if (search) search.addEventListener("input", apply);
  }

  function openLightbox(items, index) {
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    LB_ITEMS = items; LB_INDEX = index;
    updateLightbox();
    lb.classList.add("open");
  }
  function updateLightbox() {
    const lb = document.getElementById("lightbox");
    const it = LB_ITEMS[LB_INDEX];
    lb.querySelector("img").src = it.image;
    lb.querySelector(".lb-cap").textContent = [it.title, it.caption, it.year].filter(Boolean).join(" — ");
  }
  function setupLightbox() {
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    lb.addEventListener("click", (e) => {
      if (e.target.closest(".lb-close")) { lb.classList.remove("open"); return; }
      if (e.target.closest(".lb-nav.prev")) { step(-1); return; }
      if (e.target.closest(".lb-nav.next")) { step(1); return; }
      if (e.target === lb) { step(1); }
    });
    function step(dir) {
      if (!LB_ITEMS.length) return;
      LB_INDEX = (LB_INDEX + dir + LB_ITEMS.length) % LB_ITEMS.length;
      updateLightbox();
    }
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") lb.classList.remove("open");
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
  }

  /* ---------------- VIDEO ---------------- */
  function setupVideoPage() {
    const grid = document.getElementById("video-grid");
    if (!grid) return;
    const items = CONFIG.videos || [];
    const rail = document.getElementById("video-filters");
    const search = document.getElementById("video-search");

    if (!items.length) {
      grid.innerHTML = `<div class="empty-state">Belum ada video ditambahkan.<br>Edit <b>js/config.js</b> → videos.</div>`;
      if (rail) rail.innerHTML = "";
      return;
    }

    const categories = [...new Set(items.map(it => it.category || "Umum"))];
    const active = new Set();

    function renderRail() {
      if (!rail) return;
      rail.innerHTML = `
        <div class="filter-block">
          <h3>Kategori</h3>
          <div class="filter-opts">
            ${categories.map(cat => {
              const count = items.filter(it => (it.category || "Umum") === cat).length;
              return `<label class="filter-opt"><input type="checkbox" data-cat="${cat}">${cat}<span class="fo-count">${count}</span></label>`;
            }).join("")}
          </div>
        </div>
      `;
      rail.querySelectorAll("input[type=checkbox]").forEach(cb => {
        cb.addEventListener("change", () => {
          if (cb.checked) active.add(cb.dataset.cat); else active.delete(cb.dataset.cat);
          apply();
        });
      });
    }

    function renderCards(list) {
      grid.innerHTML = list.length ? list.map((v, i) => {
        const thumb = v.thumbnail || (v.type === "youtube" ? `https://img.youtube.com/vi/${v.src}/hqdefault.jpg` : "");
        return `
          <div class="slot-card" data-index="${v.__i}" data-reveal style="--d:${(i % 6) * 0.05}s">
            <div class="slot-thumb">
              ${thumb ? `<img src="${thumb}" alt="${v.title || ""}" loading="lazy" decoding="async">` : ""}
              <div class="play-btn"><span></span></div>
              <div class="slot-tag">${v.duration || ""}</div>
            </div>
            <div class="slot-body">
              <div class="slot-title">${v.title || ""}</div>
              <div class="slot-foot"><span class="pill">${v.category || "Umum"}</span></div>
            </div>
          </div>
        `;
      }).join("") : `<div class="empty-state">Tidak ada video yang cocok dengan filter/pencarian ini.</div>`;

      grid.querySelectorAll(".slot-thumb img").forEach(img => attachImgFallback(img, "Thumbnail belum ditambahkan"));
      grid.querySelectorAll(".slot-card").forEach(el => {
        el.addEventListener("click", () => openVideo(items[+el.dataset.index]));
      });
      setupReveal();
    }

    function apply() {
      const q = (search ? search.value : "").trim().toLowerCase();
      const filtered = items
        .map((it, i) => ({ ...it, __i: i }))
        .filter(it => (active.size === 0 || active.has(it.category || "Umum")))
        .filter(it => !q || (it.title || "").toLowerCase().includes(q));
      renderCards(filtered);
    }

    renderRail();
    apply();
    if (search) search.addEventListener("input", apply);
  }

  function openVideo(v) {
    const modal = document.getElementById("video-modal");
    if (!modal) return;
    const inner = modal.querySelector(".vm-inner");
    inner.innerHTML = v.type === "youtube"
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${v.src}?autoplay=1" title="${v.title || ""}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
      : `<video src="${v.src}" controls autoplay></video>`;
    modal.classList.add("open");
  }
  function setupVideoModal() {
    const modal = document.getElementById("video-modal");
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest(".lb-close")) {
        modal.classList.remove("open");
        modal.querySelector(".vm-inner").innerHTML = "";
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        modal.classList.remove("open");
        modal.querySelector(".vm-inner").innerHTML = "";
      }
    });
  }

  /* ---------------- BACKGROUND PARALLAX ---------------- */
  function setupBgParallax() {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const glow = document.getElementById("bg-glow");
    const glow2 = document.getElementById("bg-glow-2");
    const blocks = document.querySelectorAll(".bg-block");
    if (!glow && !blocks.length) return;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => {
      tx = (e.clientX / window.innerWidth) - 0.5;
      ty = (e.clientY / window.innerHeight) - 0.5;
    });
    (function loop() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (glow) glow.style.transform = `translate(${cx * 50}px, ${cy * 50}px)`;
      if (glow2) glow2.style.transform = `translate(${cx * -35}px, ${cy * -35}px)`;
      blocks.forEach(b => {
        const depth = parseFloat(b.dataset.depth || 12);
        b.style.marginLeft = `${cx * depth}px`;
        b.style.marginTop = `${cy * depth}px`;
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------- BLOCK MINING (click a bg-block to break it) ---------------- */
  function setupBlockMining() {
    const layer = document.getElementById("particle-layer");
    const typeColors = {
      g: ["#5fb52e", "#3f8a1e", "#8b5a2b"],
      d: ["#8b5a2b", "#5c3a1a", "#6e4423"],
      s: ["#a4faff", "#3fd0e0", "#1a8fa0"],
    };
    document.querySelectorAll(".bg-block").forEach((block) => {
      block.addEventListener("click", (e) => {
        e.stopPropagation();
        if (block.classList.contains("mining")) return;

        const rect = block.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const type = block.classList.contains("g") ? "g" : block.classList.contains("d") ? "d" : "s";
        const colors = typeColors[type] || ["#9aa0a6"];

        if (layer) {
          for (let i = 0; i < 10; i++) {
            const p = document.createElement("div");
            p.className = "particle";
            const size = 4 + Math.random() * 4;
            const angle = Math.random() * Math.PI * 2;
            const dist = 18 + Math.random() * 26;
            p.style.left = cx + "px";
            p.style.top = cy + "px";
            p.style.width = size + "px";
            p.style.height = size + "px";
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.setProperty("--px", Math.cos(angle) * dist + "px");
            p.style.setProperty("--py", Math.sin(angle) * dist - 14 + "px");
            layer.appendChild(p);
            setTimeout(() => p.remove(), 650);
          }
        }

        block.classList.add("mining");
        setTimeout(() => {
          block.style.opacity = "0";
          setTimeout(() => {
            block.style.left = (8 + Math.random() * 82) + "%";
            block.style.top = (6 + Math.random() * 82) + "%";
            block.style.marginLeft = "0px";
            block.style.marginTop = "0px";
            block.classList.remove("mining");
            requestAnimationFrame(() => { block.style.opacity = "1"; });
          }, 1200 + Math.random() * 1600);
        }, 260);
      });
    });
  }


  const PARTICLE_COLORS = ["#1bd96a", "#a5682f", "#9aa0a6"];

  function spawnParticle(layer, x, y, opts) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = (opts && opts.size) || (4 + Math.random() * 4);
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = (opts && opts.dist) || (14 + Math.random() * 18);
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.background = color;
    p.style.setProperty("--px", Math.cos(angle) * dist + "px");
    p.style.setProperty("--py", Math.sin(angle) * dist - 10 + "px");
    layer.appendChild(p);
    setTimeout(() => p.remove(), 650);
  }

  function setupParticles() {
    const layer = document.getElementById("particle-layer");
    if (!layer) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = 0;
    window.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (now - last < 55) return; // throttle trail density
      last = now;
      spawnParticle(layer, e.clientX, e.clientY, { size: 4, dist: 10 });
    });

    document.addEventListener("click", (e) => {
      for (let i = 0; i < 8; i++) {
        spawnParticle(layer, e.clientX, e.clientY, { size: 5 + Math.random() * 4, dist: 20 + Math.random() * 26 });
      }
    });
  }

  /* ---------------- PROFILE PHOTO TILT ---------------- */
  function setupPhotoTilt() {
    const frame = document.getElementById("home-frame");
    if (!frame) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = null;
    frame.addEventListener("mousemove", (e) => {
      const rect = frame.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        frame.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg) scale(1.02)`;
      });
    });
    frame.addEventListener("mouseleave", () => {
      if (raf) cancelAnimationFrame(raf);
      frame.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    });
  }

  /* ---------------- INIT ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    buildSidebar();
    setupWipe();
    setupBgParallax();
    setupBlockMining();
    setupParticles();
    setupPhotoTilt();
    renderHome();
    setupGalleryPage("poster-grid", CONFIG.posters, "posters");
    setupGalleryPage("photo-grid", CONFIG.photos, "photos");
    setupVideoPage();
    setupLightbox();
    setupVideoModal();
    setupReveal();
  });

})();
