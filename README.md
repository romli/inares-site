# Inares Site

Website katalog produk **Inares Homebedding** — static site yang di-host di Cloudflare Pages dengan Google Sheets sebagai backend.

## 🗂 Struktur File

```
inares-site/
├── index.html          # Homepage + Best Seller
├── katalog.html        # Katalog lengkap + filter
├── detail.html         # Halaman detail produk (dynamic via ?id=)
├── cara-order.html     # Panduan cara order
├── tentang.html        # Profil brand
├── _headers            # Cloudflare security & cache headers
├── _redirects          # Cloudflare URL redirects
└── assets/
    ├── app.js          # Semua logic JS (satu file)
    ├── style.css       # Semua style (satu file)
    ├── logo-white.png  # Logo untuk dark mode
    └── logo-dark.png   # Logo untuk light mode
```

## ⚙️ Konfigurasi

Semua konfigurasi ada di bagian atas `assets/app.js`:

```js
const CONFIG = {
  SHEET_ID:   "ID_GOOGLE_SHEETS_ANDA",  // ← ganti ini
  WA_NUMBER:  "6285643383884",           // ← nomor WA admin
  BRAND:      "Inares",
  SHOPEE_URL: "https://shopee.co.id/inaresofficial",
  TOKPED_URL: "https://www.tokopedia.com/inaresofficial",
  IG_URL:     "https://www.instagram.com/inaresofficial",
};
```

## 📊 Struktur Google Sheets

### Sheet 1: `produk`

| Kolom | Keterangan | Contoh |
|-------|------------|--------|
| `id` | ID unik produk | `SP-001` |
| `kategori` | Kategori tampilan | `Sprei` |
| `jenis` | Untuk logika WA message | `sprei` / `bedcover` / `paket` |
| `bahan` | Bahan produk | `Embos` / `Mikrotek` |
| `nama_produk` | Nama tampil di website | `Sprei Embos 160` |
| `deskripsi` | Deskripsi singkat | `Bahan embos premium...` |
| `ukuran` | Ukuran | `160x200` |
| `foto_url` | URL foto (Google Drive/CDN) | `https://...` |
| `stok` | Info stok | `Ready` / `Indent` |
| `urutan` | Angka urutan tampil | `1`, `2`, `3` |
| `aktif` | Tampilkan? | `YA` / `TIDAK` |
| `label` | Badge kartu | `bestseller` / `new` / _(kosong)_ |

### Sheet 2: `harga`

| Kolom | Keterangan |
|-------|------------|
| `jenis` | Harus sama dengan kolom `jenis` di sheet produk |
| `bahan` | Harus sama dengan kolom `bahan` di sheet produk |
| `ukuran` | Harus sama dengan kolom `ukuran` di sheet produk |
| `harga` | Angka harga (tanpa titik/koma) |

> **Catatan:** Harga di-join otomatis berdasarkan kombinasi `jenis + bahan + ukuran`.

## 🔗 Google Sheets API

Website menggunakan layanan [opensheet.elk.sh](https://opensheet.elk.sh) untuk mengakses Google Sheets sebagai JSON tanpa perlu backend.

**Persyaratan:** Google Sheets harus di-set **Anyone with the link can view**.

## 🚀 Deploy ke Cloudflare Pages

1. Push semua file ke GitHub repo
2. Login ke [Cloudflare Pages](https://pages.cloudflare.com)
3. Buat project baru → Connect to Git → Pilih repo ini
4. Build settings:
   - **Framework**: None
   - **Build command**: _(kosong)_
   - **Output directory**: `/` (root)
5. Deploy!

## ✨ Fitur

- ✅ Katalog dari Google Sheets (real-time)
- ✅ Filter kategori, bahan, dan search
- ✅ Category pills sebagai shortcut filter
- ✅ Halaman detail produk dengan tabel harga
- ✅ Keranjang sementara (localStorage)
- ✅ Order via WhatsApp dengan pesan pre-filled
- ✅ Link Shopee & Tokopedia di navbar & footer
- ✅ Dark mode (otomatis + toggle manual)
- ✅ Mobile responsive + hamburger menu
- ✅ SEO meta tags + Open Graph
- ✅ Loading skeleton saat fetch data
- ✅ Error state + tombol retry
- ✅ Cloudflare cache & security headers

## 📱 Cara Update Produk

Cukup edit Google Sheets — tidak perlu deploy ulang!

- Tambah baris baru di sheet `produk` → produk langsung muncul
- Ubah `aktif` dari `YA` ke `TIDAK` → produk tersembunyi
- Ubah harga di sheet `harga` → harga terupdate otomatis
- Ubah `urutan` angka → ubah urutan tampil di website
