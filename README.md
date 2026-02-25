# Inares — Website Homebedding

Website statis untuk brand homebedding **Inares** (inares.co.id), dibangun dengan HTML/CSS/JS murni dan terintegrasi dengan Google Sheets sebagai sumber data produk.

---

## Stack Teknologi

| Komponen | Teknologi |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Data Produk | Google Sheets (via opensheet.elk.sh API) |
| Hosting | Cloudflare Pages |
| Repository | GitHub |
| Analytics | GoatCounter |

---

## Struktur Folder

```
/
├── index.html          # Halaman utama (Home)
├── katalog.html        # Halaman katalog produk dengan filter
├── detail.html         # Halaman detail produk (dynamic via URL param)
├── cara-order.html     # Halaman panduan pemesanan
├── tentang.html        # Halaman tentang brand
├── _headers            # Konfigurasi security headers Cloudflare Pages
├── assets/
│   ├── app.js          # ✅ File JS utama (gunakan ini)
│   └── style.css       # ✅ File CSS utama (gunakan ini)
├── app.js              # ⚠️ File lama (tidak digunakan, bisa dihapus)
└── style.css           # ⚠️ File lama (tidak digunakan, bisa dihapus)
```

> **Catatan:** File `app.js` dan `style.css` di root folder adalah sisa versi lama. Semua halaman HTML sudah merujuk ke `assets/`. File di root aman untuk dihapus.

---

## Konfigurasi

Semua konfigurasi global ada di satu tempat di `assets/app.js`:

```javascript
const CONFIG = {
  SHEET_ID:   "16tLvrEBd7GGkn6h9e5VdRx9luqVQPOSe5j6HzQ4VS18",
  WA_NUMBER:  "6285643383884",
  BRAND:      "Inares",
  SHOPEE_URL: "https://shopee.co.id/inaresofficial",
  TOKPED_URL: "https://www.tokopedia.com/inaresofficial",
  IG_URL:     "https://www.instagram.com/inaresofficial",
};
```

Untuk mengganti nomor WhatsApp, Sheet ID, atau URL marketplace — cukup ubah di sini, berlaku untuk seluruh website.

---

## Google Sheets — Format Data

Website membaca dua sheet dari Google Spreadsheet yang sama:

### Sheet: `produk`
| Kolom | Keterangan | Contoh |
|---|---|---|
| `id` | ID unik produk | `SPR-001` |
| `kategori` | Kategori tampilan | `Sprei` |
| `jenis` | Jenis produk (untuk harga) | `sprei` |
| `bahan` | Nama bahan | `Embos` |
| `nama_produk` | Nama lengkap | `Sprei Embos 160` |
| `deskripsi` | Deskripsi singkat | `Bahan lembut...` |
| `ukuran` | Ukuran kasur | `160x200` |
| `foto_url` | URL foto produk | `https://...` |
| `stok` | Status stok | `Ready` |
| `urutan` | Urutan tampil | `1` |
| `aktif` | Tampil atau tidak | `YA` / `TIDAK` |
| `label` | Badge khusus | `bestseller` / `new` |

### Sheet: `harga`
| Kolom | Keterangan |
|---|---|
| `jenis` | Harus sama dengan kolom `jenis` di sheet produk |
| `bahan` | Harus sama dengan kolom `bahan` di sheet produk |
| `ukuran` | Harus sama dengan kolom `ukuran` di sheet produk |
| `harga` | Harga dalam Rupiah (angka saja, tanpa Rp) |

Harga dicocokkan secara otomatis berdasarkan kombinasi `jenis + bahan + ukuran`.

---

## Cara Update Produk

1. Buka Google Sheets
2. Edit data di sheet `produk` atau `harga`
3. Website akan otomatis menampilkan data terbaru saat pengunjung membuka halaman

> Karena website bersifat statis, tidak perlu deploy ulang hanya untuk update data produk. Data diambil langsung dari Google Sheets saat halaman dibuka.

---

## Deploy ke Cloudflare Pages

Website ini terhubung ke GitHub dan di-deploy otomatis melalui Cloudflare Pages.

### Setup Awal
1. Fork/push repo ke GitHub
2. Login ke [Cloudflare Pages](https://pages.cloudflare.com)
3. Buat project baru → Connect to Git → pilih repo ini
4. Build settings: **tidak perlu** (tidak ada build command, ini static site murni)
5. Deploy

### Update Website (Konten/Kode)
```bash
git add .
git commit -m "pesan perubahan"
git push
```
Cloudflare Pages akan otomatis detect push dan re-deploy dalam ~1 menit.

---

## Fitur Website

- **Dark Mode** — Toggle tema gelap/terang, tersimpan di localStorage
- **Keranjang Belanja** — Pilih beberapa produk, kirim semua via WhatsApp sekaligus
- **Filter Katalog** — Filter berdasarkan kategori, bahan, dan pencarian teks
- **Active Nav Otomatis** — Penanda halaman aktif di navbar otomatis berdasarkan URL
- **Skeleton Loading** — Placeholder saat data produk masih dimuat
- **Image Fallback** — Jika foto produk tidak ada, tampil placeholder otomatis
- **Lightbox** — Klik foto produk di halaman detail untuk zoom
- **Responsive** — Mobile-friendly dengan hamburger menu
- **WA Float Button** — Tombol WhatsApp mengambang di semua halaman

---

## Arsitektur Halaman

Setiap halaman HTML menggunakan atribut `data-page` di tag `<body>` untuk routing JavaScript:

```html
<body data-page="home">      <!-- index.html -->
<body data-page="katalog">   <!-- katalog.html -->
<body data-page="detail">    <!-- detail.html -->
<body data-page="cara-order"> <!-- cara-order.html -->
```

`app.js` mendeteksi nilai ini dan menjalankan fungsi inisialisasi yang sesuai.

---

## Catatan Teknis Penting

### Footer
Footer **harus** berada di luar `<div class="container">` dan memiliki container-nya sendiri di dalam. Struktur yang benar:

```html
  </div> <!-- tutup .container konten -->

  <footer class="footer">
    <div class="container">
      ...
    </div>
  </footer>
```

Jika footer diletakkan di dalam `.container` konten, footer akan terpotong mengikuti max-width container.

### Active Menu
Jangan tambahkan `class="active"` secara manual di link navigasi HTML. Fungsi `setActiveNav()` di `app.js` menangani ini secara otomatis berdasarkan URL halaman yang sedang dibuka.

### Foto Produk dari GitHub
Jika foto produk dihosting di GitHub, gunakan URL `raw.githubusercontent.com`, bukan URL halaman blob. `app.js` melakukan konversi ini secara otomatis:
- Dari: `https://github.com/user/repo/blob/main/foto.png`
- Ke: `https://raw.githubusercontent.com/user/repo/main/foto.png`

---

## Kontak & Link

| | |
|---|---|
| Website | [inares.co.id](https://inares.co.id) |
| Shopee | [shopee.co.id/inaresofficial](https://shopee.co.id/inaresofficial) |
| Tokopedia | [tokopedia.com/inaresofficial](https://www.tokopedia.com/inaresofficial) |
| Instagram | [@inaresofficial](https://www.instagram.com/inaresofficial) |
| WhatsApp | [0856-4338-3884](https://wa.me/6285643383884) |
| Lokasi | Yogyakarta, Indonesia |
