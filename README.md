# INARES Website

Calm & Refined Handmade Fabric Brand System

Website resmi INARES --- brand handmade retail berbasis fabric dengan
pendekatan desain **calm, refined, dan modern boutique**.

Website ini dibangun menggunakan static architecture (HTML, CSS, JS) dan
di-deploy melalui GitHub + Cloudflare Pages.

------------------------------------------------------------------------

## ✨ Filosofi Rebranding (2026)

Rebranding dilakukan untuk:

-   Meningkatkan kesan dewasa & refined
-   Menghilangkan tampilan marketplace generik
-   Membangun identitas brand handmade boutique
-   Membuat sistem modular yang scalable
-   Memisahkan identitas brand dari WhatsApp commerce

Pendekatan desain: - Calm & Refined - Warm neutral color system - Sage
accent (brand color) - WhatsApp tetap menggunakan warna official untuk
CTA

------------------------------------------------------------------------

## 🏗️ Arsitektur Project

/ ├── index.html ├── katalog.html ├── detail.html ├── cara-order.html
├── tentang.html │ ├── /assets │ ├── /css │ │ └── style.css │ └── /js │
└── app.js │ ├── /components │ ├── header.html │ └── footer.html │ ├──
\_headers └── \_redirects

------------------------------------------------------------------------

## 🔧 Teknologi yang Digunakan

-   HTML5
-   CSS3 (Custom Design System)
-   Vanilla JavaScript
-   Modular Component System (fetch-based)
-   GitHub (Repository)
-   Cloudflare Pages (Hosting)

Tidak menggunakan framework agar: - Ringan - Cepat - Mudah dikontrol -
Mudah dikembangkan

------------------------------------------------------------------------

## 🎨 Design System

### Primary Identity

-   Warm Stone Background
-   Sage Accent
-   Soft Typography
-   Subtle Shadow
-   Large Spacing

### CTA Strategy

-   Brand Button → Sage
-   WhatsApp Button → Official Green (#25D366)

WhatsApp tidak dijadikan warna brand agar identitas tetap independen.

------------------------------------------------------------------------

## 🌓 Dark Mode

Website mendukung dark mode dengan sistem CSS variable. Dark mode bukan
sekadar invert warna, tetapi disesuaikan agar tetap refined.

------------------------------------------------------------------------

## 🧩 Modular System

Header dan Footer menggunakan sistem komponen:

-   /components/header.html
-   /components/footer.html

Di-load melalui assets/js/app.js

Keuntungan: - Tidak ada duplikasi kode - Konsistensi seluruh halaman -
Mudah di-maintain

------------------------------------------------------------------------

## 🚀 Deployment

1.  Push ke GitHub repository
2.  Cloudflare Pages otomatis rebuild
3.  Website live tanpa server-side dependency

------------------------------------------------------------------------

## 🔮 Roadmap Pengembangan

-   Refactor detail page (product layout premium)
-   Integrasi Google Sheet dynamic data
-   Image optimization system
-   SEO refinement
-   Performance tuning

------------------------------------------------------------------------

## 📌 Author

INARes Official\
Handmade Fabric Retail Brand

------------------------------------------------------------------------

## 📄 License

Private project -- All rights reserved.
