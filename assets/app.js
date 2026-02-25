/* =============================================
   INARES — app.js
   ============================================= */

// ── CONFIG (satu tempat, mudah diubah) ──
const CONFIG = {
  SHEET_ID:   "16tLvrEBd7GGkn6h9e5VdRx9luqVQPOSe5j6HzQ4VS18",
  WA_NUMBER:  "6285643383884",
  BRAND:      "Inares",
  SHOPEE_URL: "https://shopee.co.id/inaresofficial",
  TOKPED_URL: "https://www.tokopedia.com/inaresofficial",
  IG_URL:     "https://www.instagram.com/inaresofficial",
};

const SHEET_PRODUK = `https://opensheet.elk.sh/${CONFIG.SHEET_ID}/produk`;
const SHEET_HARGA  = `https://opensheet.elk.sh/${CONFIG.SHEET_ID}/harga`;

// ── DARK MODE ──
const THEME_KEY = "inares-theme";

function getTheme() {
  return localStorage.getItem(THEME_KEY) ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem(THEME_KEY, t);
}
function toggleTheme() {
  applyTheme(getTheme() === "dark" ? "light" : "dark");
}
// Apply immediately to avoid flash
applyTheme(getTheme());

// ── CART (localStorage) ──
const CART_KEY = "inares-cart";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(x => x.id === product.id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showCartToast(product.nama_produk);
}
function removeFromCart(id) {
  saveCart(getCart().filter(x => x.id !== id));
}
function clearCart() {
  saveCart([]);
}

function cartTotal() {
  return getCart().reduce((s, x) => s + (x.harga || 0) * (x.qty || 1), 0);
}
function cartCount() {
  return getCart().reduce((s, x) => s + (x.qty || 1), 0);
}

function updateCartUI() {
  const count = cartCount();
  const badge = document.querySelector(".cart-fab-badge");
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle("visible", count > 0);
  }
  renderCartItems();
  const totalEl = document.querySelector(".cart-total .amount");
  if (totalEl) totalEl.textContent = rupiah(cartTotal());
}

function renderCartItems() {
  const body = document.querySelector(".cart-body");
  if (!body) return;
  const cart = getCart();
  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Belum ada produk dipilih.</p>
        <a href="katalog.html" class="btn btn-primary btn-sm">Lihat Katalog</a>
      </div>`;
    return;
  }
  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img"
        src="${item.foto_url && !item.foto_url.includes('(isi') ? item.foto_url : 'https://placehold.co/64x64/f3ece0/b8834a?text=I'}"
        alt="${item.nama_produk}" loading="lazy" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nama_produk}</div>
        <div class="cart-item-meta">${item.bahan} · ${item.ukuran}</div>
        <div class="cart-item-price">${rupiah(item.harga)}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Hapus">×</button>
    </div>
  `).join("");
}

function buildWACartMessage() {
  const cart = getCart();
  if (cart.length === 0) return `Halo ${CONFIG.BRAND}, saya mau order.`;
  const lines = cart.map(x =>
    `• ${x.nama_produk} ${x.bahan} ${x.ukuran}${x.qty > 1 ? ` (${x.qty}x)` : ''}`
  );
  return `Halo ${CONFIG.BRAND}, saya mau order:\n${lines.join("\n")}\n\nMohon info motif yang tersedia dan total harga. Terima kasih!`;
}

function openCart() {
  const overlay = document.querySelector(".cart-overlay");
  const drawer  = document.querySelector(".cart-drawer");
  if (overlay) overlay.classList.add("open");
  if (drawer)  drawer.classList.add("open");
  document.body.style.overflow = "hidden";
  renderCartItems();
  updateCartUI();
}
function closeCart() {
  const overlay = document.querySelector(".cart-overlay");
  const drawer  = document.querySelector(".cart-drawer");
  if (overlay) overlay.classList.remove("open");
  if (drawer)  drawer.classList.remove("open");
  document.body.style.overflow = "";
}

function showCartToast(name) {
  let toast = document.getElementById("cart-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.style.cssText = `
      position:fixed; bottom:80px; left:50%; transform:translateX(-50%) translateY(10px);
      background:var(--surface); border:1px solid var(--border); border-radius:999px;
      padding:10px 20px; font-size:14px; font-weight:600; color:var(--text);
      box-shadow:var(--shadow-md); z-index:999; opacity:0;
      transition: all .3s ease; white-space:nowrap; pointer-events:none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = `✅ "${name}" ditambahkan`;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
  }, 2200);
}

// ── UTILS ──
function rupiah(n) {
  const num = Number(n || 0);
  if (!num) return "Hubungi Admin";
  return "Rp " + num.toLocaleString("id-ID");
}

function waLink(msg) {
  return `https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function waMessageFor(item) {
  const b = item.bahan || "", u = item.ukuran || "";
  const j = (item.jenis || "").toLowerCase();
  const map = {
    sprei:    `Halo ${CONFIG.BRAND}, saya mau pesan Sprei ${b} ukuran ${u}. Mohon info motif yang tersedia.`,
    bedcover: `Halo ${CONFIG.BRAND}, saya mau pesan Bedcover ${b} ukuran ${u}. Mohon info motif yang tersedia.`,
    paket:    `Halo ${CONFIG.BRAND}, saya mau pesan Paket Sprei + Bedcover ${b} ukuran ${u}. Mohon info motif yang tersedia.`,
  };
  if (j.includes("sarung")) return `Halo ${CONFIG.BRAND}, saya mau pesan Sarung Bantal/Guling ${b} ukuran ${u}. Mohon info motif yang tersedia.`;
  return map[j] || `Halo ${CONFIG.BRAND}, saya mau pesan ${item.nama_produk} ${b} ukuran ${u}. Mohon info motif yang tersedia.`;
}

function normalizeRow(r) {
  return {
    id:          r.id || crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    kategori:    r.kategori || "",
    jenis:       (r.jenis || "").toLowerCase(),
    bahan:       r.bahan || "",
    nama_produk: r.nama_produk || "",
    deskripsi:   r.deskripsi || "",
    ukuran:      r.ukuran || "",
    foto_url:    r.foto_url || "",
    stok:        r.stok || "",
    urutan:      Number(r.urutan || 9999),
    aktif:       (r.aktif || "").toUpperCase(),
    label:       (r.label || "").toLowerCase(), // bestseller | new | ready
  };
}

function priceKey(j, b, u) {
  return `${(j||"").toLowerCase()}|${(b||"").toLowerCase()}|${(u||"").toLowerCase()}`;
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function imgSrc(url) {
  if (!url || url.includes("(isi") || !url.startsWith("http")) {
    return "https://placehold.co/600x400/f3ece0/b8834a?text=Inares";
  }
  // Auto-convert GitHub blob URL → raw URL
  // Dari: https://github.com/user/repo/blob/main/foto.png
  // Ke:   https://raw.githubusercontent.com/user/repo/main/foto.png
  if (url.includes("github.com") && url.includes("/blob/")) {
    url = url
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/");
  }
  return url;
}

// ── FETCH ──
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch gagal: " + url);
  return res.json();
}

async function fetchAll() {
  const [prodRows, hargaRows] = await Promise.all([
    fetchJson(SHEET_PRODUK),
    fetchJson(SHEET_HARGA),
  ]);
  const priceMap = {};
  for (const r of hargaRows) {
    priceMap[priceKey(r.jenis, r.bahan, r.ukuran)] = Number(r.harga || 0);
  }
  return prodRows
    .map(normalizeRow)
    .filter(x => x.aktif === "YA")
    .sort((a, b) => a.urutan - b.urutan)
    .map(p => ({
      ...p,
      harga: priceMap[priceKey(p.jenis, p.bahan, p.ukuran)] || 0,
    }));
}

// ── SKELETON ──
function skeletonCards(n = 6) {
  return Array.from({ length: n }, () => `
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line price"></div>
      </div>
    </div>`).join("");
}

// ── CARD RENDER ──
function productCard(item, opts = {}) {
  const { showDetail = true } = opts;
  const badge = item.label === "bestseller" ? `<span class="card-badge bestseller">Best Seller</span>`
    : item.label === "new" ? `<span class="card-badge new">Baru</span>`
    : item.stok && item.stok.toLowerCase().includes("ready") ? `<span class="card-badge ready">Ready</span>`
    : "";
  const detailUrl = `detail.html?id=${encodeURIComponent(item.id)}`;
  return `
    <div class="card fade-up" onclick="window.location='${detailUrl}'">
      <div class="card-img-wrap">
        <img src="${imgSrc(item.foto_url)}" alt="${item.nama_produk}" loading="lazy" />
        ${badge}
      </div>
      <div class="card-body">
        <h3>${item.nama_produk}</h3>
        <p class="card-desc">${item.deskripsi || "Bahan nyaman, jahitan rapi, motif selalu update."}</p>
        <div class="card-meta">
          <span class="tag">${item.bahan}</span>
          <span class="tag">${item.ukuran}</span>
          ${item.stok ? `<span class="tag">${item.stok}</span>` : ""}
        </div>
        <div class="card-price ${!item.harga ? 'hubungi' : ''}">${rupiah(item.harga)}</div>
        <div class="card-actions" onclick="event.stopPropagation()">
          <a class="btn btn-wa btn-sm" href="${waLink(waMessageFor(item))}" target="_blank" rel="noopener">
            ${waIcon()} Order WA
          </a>
          <button class="btn btn-sm" onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
            🛒 Pilih
          </button>
        </div>
      </div>
    </div>`;
}

function waIcon() {
  return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.124 1.528 5.855L0 24l6.335-1.508C8.054 23.455 9.987 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.655-.52-5.163-1.426l-.37-.22-3.762.896.957-3.67-.242-.38C2.524 15.618 2 13.872 2 12 2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>`;
}

// ── ERROR RENDER ──
function errorHTML(msg = "Gagal memuat produk.") {
  return `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Ups, terjadi masalah</h3>
      <p>${msg}</p>
      <button class="btn btn-primary" onclick="location.reload()">Coba Lagi</button>
    </div>`;
}

// ── HOME PAGE ──
async function initHomePage() {
  const grid = document.querySelector("#bestSellerGrid");
  if (!grid) return;

  grid.innerHTML = skeletonCards(3);
  try {
    const all = await fetchAll();
    const best = all.slice(0, 6);
    if (best.length === 0) {
      grid.innerHTML = `<div class="empty-state"><p>Belum ada produk.</p></div>`;
    } else {
      grid.innerHTML = best.map(p => productCard(p)).join("");
    }
  } catch (e) {
    grid.innerHTML = errorHTML("Tidak dapat memuat produk saat ini. Cek koneksi internet Anda.");
  }
}

// ── KATALOG PAGE ──
async function initKatalogPage() {
  const grid         = document.querySelector("#grid");
  const selKategori  = document.querySelector("#filterKategori");
  const selBahan     = document.querySelector("#filterBahan");
  const searchEl     = document.querySelector("#search");
  const pills        = document.querySelector("#categoryPills");
  const countEl      = document.querySelector("#filterCount");

  if (!grid) return;
  grid.innerHTML = skeletonCards(6);

  let all = [];
  try {
    all = await fetchAll();
  } catch (e) {
    grid.innerHTML = errorHTML("Tidak dapat memuat katalog. Cek koneksi internet Anda.");
    return;
  }

  // Populate filters
  const kategoriList = unique(all.map(x => x.kategori));
  const bahanList    = unique(all.map(x => x.bahan));

  if (selKategori) {
    selKategori.innerHTML = `<option value="">Semua Kategori</option>` +
      kategoriList.map(k => `<option value="${k}">${k}</option>`).join("");
  }
  if (selBahan) {
    selBahan.innerHTML = `<option value="">Semua Bahan</option>` +
      bahanList.map(b => `<option value="${b}">${b}</option>`).join("");
  }

  // Category pills
  if (pills) {
    pills.innerHTML = `<button class="pill active" data-val="">Semua</button>` +
      kategoriList.map(k => `<button class="pill" data-val="${k}">${k}</button>`).join("");
    pills.addEventListener("click", e => {
      const btn = e.target.closest(".pill");
      if (!btn) return;
      pills.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      if (selKategori) selKategori.value = btn.dataset.val;
      apply();
    });
  }

  function apply() {
    const k = selKategori?.value || "";
    const b = selBahan?.value || "";
    const q = (searchEl?.value || "").toLowerCase().trim();

    const filtered = all.filter(item => {
      const blob = `${item.nama_produk} ${item.deskripsi} ${item.ukuran} ${item.bahan} ${item.kategori}`.toLowerCase();
      return (!k || item.kategori === k)
          && (!b || item.bahan === b)
          && (!q || blob.includes(q));
    });

    if (countEl) countEl.textContent = `${filtered.length} produk`;
    grid.innerHTML = filtered.length > 0
      ? filtered.map(p => productCard(p)).join("")
      : `<div class="empty-state"><div class="empty-icon">🔍</div><p>Produk tidak ditemukan. Coba kata kunci lain.</p></div>`;

    // Sync pills with select
    if (pills && selKategori) {
      pills.querySelectorAll(".pill").forEach(p => {
        p.classList.toggle("active", p.dataset.val === selKategori.value);
      });
    }
  }

  selKategori?.addEventListener("change", apply);
  selBahan?.addEventListener("change", apply);
  searchEl?.addEventListener("input", apply);
  apply();
}

// ── DETAIL PAGE ──
async function initDetailPage() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const container = document.querySelector("#detailContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="detail-grid">
      <div class="skeleton-card" style="aspect-ratio:4/3;height:auto"><div class="skeleton-img" style="height:100%"></div></div>
      <div style="display:flex;flex-direction:column;gap:16px">
        ${skeletonCards(1).replace('skeleton-card','').replace('<div class="skeleton-img"></div>','')}
      </div>
    </div>`;

  let all = [];
  try {
    all = await fetchAll();
  } catch (e) {
    container.innerHTML = errorHTML("Tidak dapat memuat detail produk.");
    return;
  }

  const item = all.find(x => x.id === id) || all[0];
  if (!item) {
    container.innerHTML = `<div class="error-state"><div class="error-icon">🔍</div><h3>Produk tidak ditemukan</h3><a href="katalog.html" class="btn btn-primary">Lihat Katalog</a></div>`;
    return;
  }

  // Update page title & SEO
  document.title = `${item.nama_produk} — ${CONFIG.BRAND}`;

  // Related products (same kategori, exclude current)
  const related = all.filter(x => x.kategori === item.kategori && x.id !== item.id).slice(0, 4);

  // Build price table: find all same jenis+bahan, different ukuran
  const sameJenisBahan = all.filter(x =>
    x.jenis === item.jenis && x.bahan === item.bahan
  );
  const priceTableRows = sameJenisBahan.length > 1
    ? sameJenisBahan.map(x => `
        <tr class="${x.id === item.id ? 'highlight' : ''}">
          <td>${x.ukuran}</td>
          <td>${rupiah(x.harga)}</td>
        </tr>`).join("")
    : "";

  const waMsg  = waMessageFor(item);
  const waHref = waLink(waMsg);

  container.innerHTML = `
    <nav class="detail-breadcrumb">
      <a href="index.html">Home</a>
      <span>›</span>
      <a href="katalog.html">Katalog</a>
      <span>›</span>
      <span>${item.nama_produk}</span>
    </nav>

    <div class="detail-grid">
      <!-- LEFT: Image -->
      <div>
        <div class="detail-img-wrap">
          <img src="${imgSrc(item.foto_url)}" alt="${item.nama_produk}" />
          <div class="detail-img-zoom-hint">🔍 Tap untuk zoom</div>
        </div>
      </div>

      <!-- RIGHT: Info -->
      <div class="detail-info">
        <div>
          <span class="detail-category">✦ ${item.kategori || item.jenis}</span>
        </div>
        <h1 class="detail-title">${item.nama_produk}</h1>
        <p class="detail-desc">${item.deskripsi || "Bahan nyaman, jahitan rapi, dan motif selalu update. Cocok untuk kamar minimalis maupun homey."}</p>

        <!-- Meta -->
        <div class="detail-meta-grid">
          <div class="detail-meta-item">
            <div class="label">Bahan</div>
            <div class="value">${item.bahan || "—"}</div>
          </div>
          <div class="detail-meta-item">
            <div class="label">Ukuran</div>
            <div class="value">${item.ukuran || "—"}</div>
          </div>
          <div class="detail-meta-item">
            <div class="label">Jenis</div>
            <div class="value" style="text-transform:capitalize">${item.jenis || "—"}</div>
          </div>
          <div class="detail-meta-item">
            <div class="label">Stok</div>
            <div class="value">${item.stok || "Tanya Admin"}</div>
          </div>
        </div>

        <!-- Price -->
        <div class="detail-price-block">
          <div class="detail-price-label">Harga</div>
          <div class="detail-price">${rupiah(item.harga)}</div>
        </div>

        ${priceTableRows ? `
        <div>
          <p style="font-size:13px;color:var(--muted);font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:.4px;">Harga per Ukuran (${item.bahan})</p>
          <div class="table-wrap">
            <table class="detail-price-table">
              <thead><tr><th>Ukuran</th><th>Harga</th></tr></thead>
              <tbody>${priceTableRows}</tbody>
            </table>
          </div>
        </div>` : ""}

        <!-- Order -->
        <div class="detail-order-section">
          <a class="btn btn-wa" href="${waHref}" target="_blank" rel="noopener">
            ${waIcon()} Order via WhatsApp
          </a>
          <button class="btn" onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
            🛒 Tambah ke Keranjang
          </button>
          <div class="detail-order-divider">— atau beli di marketplace —</div>
          <div class="detail-alt-btns">
            <a class="btn btn-shopee" href="${CONFIG.SHOPEE_URL}" target="_blank" rel="noopener">🛍 Shopee</a>
            <a class="btn btn-tokped" href="${CONFIG.TOKPED_URL}" target="_blank" rel="noopener">🟢 Tokopedia</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    ${related.length > 0 ? `
    <div class="section">
      <div class="section-header">
        <div>
          <h2>Produk Serupa</h2>
          <p>Mungkin kamu juga suka ini</p>
        </div>
        <a class="btn btn-sm" href="katalog.html">Lihat Semua</a>
      </div>
      <div class="grid grid-4">
        ${related.map(p => productCard(p)).join("")}
      </div>
    </div>` : ""}
  `;

  // Sticky order bar (mobile)
  const stickyWA = document.querySelector("#stickyWA");
  const stickyCart = document.querySelector("#stickyCart");
  if (stickyWA) stickyWA.href = waHref;
  if (stickyCart) stickyCart.onclick = () => addToCart(item);

  // Lightbox: klik gambar produk untuk zoom
  const detailImg = container.querySelector(".detail-img-wrap img");
  if (detailImg) {
    detailImg.addEventListener("click", () => {
      openLightbox(detailImg.src, item.nama_produk);
    });
  }
}

// ── LIGHTBOX ──
function initLightbox() {
  if (document.getElementById("lightbox")) return;
  const overlay = document.createElement("div");
  overlay.id = "lightbox";
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <div class="lightbox-img-wrap">
      <img id="lightbox-img" src="" alt="" />
      <button class="lightbox-close" title="Tutup">×</button>
    </div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeLightbox();
  });
  overlay.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });
}

function openLightbox(src, alt) {
  initLightbox();
  const overlay = document.getElementById("lightbox");
  const img     = document.getElementById("lightbox-img");
  img.src = src;
  img.alt = alt || "";
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const overlay = document.getElementById("lightbox");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

// ── MOBILE MENU ──
function initMobileMenu() {
  const btn  = document.querySelector(".hamburger");
  const menu = document.querySelector(".mobile-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  // Close on link click
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      btn.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

// ── ACTIVE NAV ──
function setActiveNav() {
  // Normalize path: strip .html extension and trailing slash for consistent comparison
  const rawPath = location.pathname.split("/").pop() || "index.html";
  const path = rawPath.replace(/\.html$/, "") || "index";

  document.querySelectorAll(".nav-menu a, .mobile-menu a").forEach(a => {
    const rawHref = a.getAttribute("href")?.split("/").pop() || "";
    const href = rawHref.replace(/\.html$/, "") || "index";
    a.classList.toggle("active", href === path);
  });
}

// ── SHARED COMPONENTS ──
function renderShared() {
  // Theme toggle listeners
  document.querySelectorAll(".theme-toggle").forEach(btn => {
    btn.addEventListener("click", toggleTheme);
  });

  // Cart button
  const cartFab = document.querySelector(".cart-fab");
  if (cartFab) cartFab.addEventListener("click", openCart);

  // Cart close
  const cartClose = document.querySelector(".cart-close");
  if (cartClose) cartClose.addEventListener("click", closeCart);

  // Cart overlay close
  const cartOverlay = document.querySelector(".cart-overlay");
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // Cart WA button
  const cartWA = document.querySelector(".cart-wa-btn");
  if (cartWA) {
    cartWA.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) return alert("Keranjang masih kosong.");
      window.open(waLink(buildWACartMessage()), "_blank");
    });
  }

  updateCartUI();
  setActiveNav();
  initMobileMenu();
}

// ── INIT ──
document.addEventListener("DOMContentLoaded", () => {
  // Apply theme early (also handled at top for no-flash)
  applyTheme(getTheme());
  renderShared();

  const page = document.body.dataset.page;
  if (page === "home")    initHomePage();
  if (page === "katalog") initKatalogPage();
  if (page === "detail")  initDetailPage();
});
