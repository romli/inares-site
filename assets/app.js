// =======================
// KONFIGURASI
// =======================

const SHEET_ID = "16tLvrEBd7GGkn6h9e5VdRx9luqVQPOSe5j6HzQ4VS18";

const SHEET_JSON_PRODUK = `https://opensheet.elk.sh/${SHEET_ID}/produk`;
const SHEET_JSON_HARGA  = `https://opensheet.elk.sh/${SHEET_ID}/harga`;

const BRAND = "Inares";
const WA_NUMBER = "6285643383884";

// =======================
// UTIL
// =======================

function rupiah(n){
  const num = Number(n || 0);
  if (!num) return "Hubungi Admin";
  return "Rp " + num.toLocaleString("id-ID");
}

function waMessageFor(item){
  const bahan = item.bahan || "";
  const ukuran = item.ukuran || "";
  const jenis = (item.jenis || "").toLowerCase();

  if (jenis === "sprei") {
    return `Halo ${BRAND}, saya mau pesan Sprei ${bahan} ukuran ${ukuran}. Mohon info motif yang tersedia.`;
  }
  if (jenis === "bedcover") {
    return `Halo ${BRAND}, saya mau pesan Bedcover ${bahan} ukuran ${ukuran}. Mohon info motif yang tersedia.`;
  }
  if (jenis === "paket") {
    return `Halo ${BRAND}, saya mau pesan Paket Sprei + Bedcover ${bahan} ukuran ${ukuran}. Mohon info motif yang tersedia.`;
  }
  if (jenis === "sarung_bantal" || jenis === "sarung_guling" || jenis === "sarung") {
    return `Halo ${BRAND}, saya mau pesan Sarung Bantal/Guling ${bahan} ukuran ${ukuran}. Mohon info motif yang tersedia.`;
  }

  return `Halo ${BRAND}, saya mau pesan ${item.nama_produk || "produk"} ${bahan} ukuran ${ukuran}. Mohon info motif yang tersedia.`;
}

function waLink(item){
  const msg = waMessageFor(item);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function normalizeRow(row){
  return {
    id: row.id || "",
    kategori: row.kategori || "",
    jenis: (row.jenis || "").toLowerCase(),
    bahan: row.bahan || "",
    nama_produk: row.nama_produk || "",
    deskripsi: row.deskripsi || "",
    ukuran: row.ukuran || "",
    foto_url: row.foto_url || "",
    stok: row.stok || "",
    urutan: Number(row.urutan || 9999),
    aktif: (row.aktif || "").toUpperCase(),
  };
}

// bikin key untuk join harga
function priceKey(jenis, bahan, ukuran){
  return `${(jenis||"").toLowerCase()}|${(bahan||"").toLowerCase()}|${(ukuran||"").toLowerCase()}`;
}

// =======================
// AMBIL DATA
// =======================

async function fetchJson(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error("Gagal fetch: " + url);
  return await res.json();
}

async function fetchProducts(){
  const rows = await fetchJson(SHEET_JSON_PRODUK);
  return rows.map(normalizeRow)
    .filter(x => x.aktif === "YA")
    .sort((a,b) => a.urutan - b.urutan);
}

async function fetchPriceMap(){
  const rows = await fetchJson(SHEET_JSON_HARGA);

  const map = {};
  for(const r of rows){
    const k = priceKey(r.jenis, r.bahan, r.ukuran);
    map[k] = Number(r.harga || 0);
  }
  return map;
}

async function fetchProductsWithPrices(){
  const [products, priceMap] = await Promise.all([
    fetchProducts(),
    fetchPriceMap()
  ]);

  return products.map(p => {
    const k = priceKey(p.jenis, p.bahan, p.ukuran);
    const harga = priceMap[k] || 0;
    return { ...p, harga };
  });
}

// =======================
// RENDER
// =======================

function productCard(item){
  const img = (item.foto_url && !item.foto_url.includes("(isi")) 
    ? item.foto_url 
    : "https://via.placeholder.com/1200x800?text=Inares";

  return `
    <div class="card">
      <img src="${img}" alt="${item.nama_produk}" loading="lazy" />
      <div class="card-body">
        <h3>${item.nama_produk}</h3>
        <p class="desc">${item.deskripsi || "Bahan nyaman, jahitan rapi, dan motif selalu update."}</p>
        <div class="meta">
          <span>• ${item.bahan}</span>
          <span>• ${item.ukuran}</span>
          ${item.stok ? `<span>• ${item.stok}</span>` : ""}
        </div>
        <div class="price">${rupiah(item.harga)}</div>
        <div class="actions">
          <a class="btn primary" href="${waLink(item)}" target="_blank" rel="noopener">Quick Order (WA)</a>
          <a class="btn" href="katalog.html">Lihat Katalog</a>
        </div>
      </div>
    </div>
  `;
}

function renderGrid(el, items){
  el.innerHTML = items.map(productCard).join("");
}

function unique(list){
  return [...new Set(list.filter(Boolean))];
}

async function initKatalogPage(){
  const grid = document.querySelector("#grid");
  const selectKategori = document.querySelector("#filterKategori");
  const selectBahan = document.querySelector("#filterBahan");
  const search = document.querySelector("#search");

  const all = await fetchProductsWithPrices();

  const kategori = unique(all.map(x => x.kategori));
  const bahan = unique(all.map(x => x.bahan));

  selectKategori.innerHTML = `<option value="">All Category</option>` + kategori.map(x => `<option value="${x}">${x}</option>`).join("");
  selectBahan.innerHTML = `<option value="">All Material</option>` + bahan.map(x => `<option value="${x}">${x}</option>`).join("");

  function apply(){
    const k = selectKategori.value;
    const b = selectBahan.value;
    const q = (search.value || "").toLowerCase().trim();

    const filtered = all.filter(item => {
      const okK = !k || item.kategori === k;
      const okB = !b || item.bahan === b;

      const blob = `${item.nama_produk} ${item.deskripsi} ${item.ukuran} ${item.bahan} ${item.kategori}`.toLowerCase();
      const okQ = !q || blob.includes(q);

      return okK && okB && okQ;
    });

    renderGrid(grid, filtered);
  }

  selectKategori.addEventListener("change", apply);
  selectBahan.addEventListener("change", apply);
  search.addEventListener("input", apply);

  apply();
}

async function initHomePage(){
  const grid = document.querySelector("#bestSellerGrid");
  if(!grid) return;

  const all = await fetchProductsWithPrices();
  const best = all.slice(0,6);
  renderGrid(grid, best);
}

function init(){
  const page = document.body.getAttribute("data-page");
  if(page === "katalog") initKatalogPage();
  if(page === "home") initHomePage();
}

document.addEventListener("DOMContentLoaded", init);
