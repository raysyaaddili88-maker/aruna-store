# Aruna Store — Website Affiliate & Dropship

Website toko online **affiliate & dropship** dengan desain clean, modern, profesional, dan mobile-first (fokus Android). Cocok untuk produk elektronik maupun outfit/fashion. Semua konten (produk, banner, CTA, WhatsApp, pengaturan website) dikelola dari **Dashboard Admin**.

Teknologi: **React 19 · Vite · Tailwind CSS v4 · React Router DOM v7 · Lucide React · LocalStorage** (data layer terpisah dari UI, siap dipindah ke backend/REST API).

---

## 1. Fitur

- **Homepage** — hero banner carousel (dikelola admin), produk pilihan, produk diskon.
- **Katalog Produk** — search realtime, filter (harga, diskon, jenis CTA), sorting (terbaru, harga ↑↓, diskon terbesar).
- **Detail Produk** — galeri dengan thumbnail + preview layar penuh, spesifikasi, deskripsi, CTA sticky di mobile.
- **CTA Dinamis per Produk** — `Affiliate` | `WhatsApp` | `Custom URL` | `Tanpa CTA`.
- **WhatsApp CTA** — buka `wa.me` dengan pesan otomatis; template mendukung placeholder `{product_name}`, `{price}`. Nomor & pesan dapat diatur per produk.
- **Dashboard Admin** — statistik, CRUD produk, CRUD banner (dengan urutan), CTA Settings, WhatsApp Settings, Pengaturan Website (nama toko, logo, favicon, sosial media, footer, SEO).
- **SEO dasar** — dynamic title, meta description/keywords, Open Graph, canonical, slug SEO-friendly (`/product/smartphone-nova-x5-5g-256gb`).
- **Responsive mobile-first** — navbar hamburger, grid produk 2 kolom, sidebar admin jadi drawer, CTA full-width, tanpa overflow horizontal.
- Data demo siap pakai; gambar produk dari Unsplash CDN dan **mudah diganti** dari dashboard admin.

---

## 2. Struktur Folder

```
src/
├── components/
│   ├── AdminLayout.jsx        # Layout dashboard (sidebar/drawer + topbar)
│   ├── Banner.jsx             # Hero carousel
│   ├── CTAButton.jsx          # Tombol CTA dinamis (affiliate/WA/custom)
│   ├── Footer.jsx
│   ├── Header.jsx             # Navbar + search + drawer mobile
│   ├── ImageInput.jsx         # Input gambar (URL atau upload file)
│   ├── Modal.jsx              # Modal + ConfirmDialog
│   ├── ProductCard.jsx
│   ├── ProductGallery.jsx
│   └── States.jsx             # Empty / Loading / SectionHeading
├── context/
│   ├── StoreContext.jsx       # Jembatan service ↔ UI (data loading)
│   └── ToastContext.jsx       # Notifikasi toast
├── data/
│   └── initialData.js         # Data demo (produk, banner, settings)
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx           # Katalog + filter + sorting
│   ├── ProductDetail.jsx
│   ├── NotFound.jsx
│   ├── AdminLogin.jsx         # Login demo
│   ├── AdminDashboard.jsx
│   ├── AdminProducts.jsx
│   ├── AdminProductForm.jsx   # Tambah/Edit produk
│   ├── AdminBanners.jsx
│   ├── AdminCtaSettings.jsx
│   ├── AdminWhatsAppSettings.jsx
│   └── AdminWebsiteSettings.jsx
├── services/
│   ├── storage.js             # Layer localStorage (ganti ke API di sini)
│   ├── seedService.js
│   ├── productService.js
│   ├── bannerService.js
│   ├── settingsService.js
│   └── authService.js         # Auth demo (⚠️ produksi pakai backend)
├── utils/
│   ├── formatPrice.js
│   ├── slugify.js
│   ├── whatsapp.js
│   ├── cta.js
│   ├── placeholder.js
│   └── seo.js
├── App.jsx                    # Routing & layout
├── main.jsx
└── index.css
```

**Lapisan data sudah terpisah** dari komponen UI. Semua akses localStorage hanya ada di `services/`. Untuk memindahkan ke backend, tinggal ubah isi fungsi di `productService.js`, `bannerService.js`, `settingsService.js` menjadi `fetch('/api/...')` — komponen UI tidak perlu diubah.

---

## 3. Route / Halaman

| Route | Halaman |
|---|---|
| `/` | Homepage |
| `/products` | Katalog + filter + sorting (`?q=` `?cta=` `?price=` `?discount=` `?sort=`) |
| `/product/:slug` | Detail produk (SEO-friendly) |
| `/admin/login` | Login admin (demo: `admin` / `admin123`) |
| `/admin` | Dashboard |
| `/admin/products` | Kelola produk |
| `/admin/products/new` | Tambah produk |
| `/admin/products/:id/edit` | Edit produk |
| `/admin/banners` | Kelola banner |
| `/admin/settings/cta` | CTA Settings (default produk baru) |
| `/admin/settings/whatsapp` | Nomor & template WhatsApp |
| `/admin/settings/website` | Identitas toko, sosial media, SEO |

---

## 4. `package.json`

```json
{
  "name": "affiliate-store",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "oxlint"
  },
  "dependencies": {
    "lucide-react": "^0.4xx",
    "react": "^18.3.1 || ^19",
    "react-dom": "^18.3.1 || ^19",
    "react-router-dom": "^7"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^4",
    "vite": "^6 || ^7 || ^8"
  }
}
```

> Versi aktual di `package.json` mengikuti hasil instalasi `npm create vite` + versi stabil terbaru. Tidak ada library tambahan yang perlu diunduh manual.

---

## 5. Cara Install

```bash
npm install
```

Persyaratan: **Node.js 18.12+** (disarankan 20/22 LTS) dan **npm 9+**.

---

## 6. Cara Menjalankan (Development)

```bash
npm run dev
```

Buka `http://localhost:5173` (Vite memilih port bebas otomatis).

---

## 7. Build Produksi

```bash
npm run build
```

Hasil build ada di folder `dist/`. Preview hasil build secara lokal:

```bash
npm run preview
```

Cek lint:

```bash
npm run lint
```

---

## 8. Cara Deploy ke Hosting

Aplikasi ini **static SPA** (`base: './'` sehingga bisa diletakkan di root domain maupun sub-folder). Cukup upload isi folder `dist/`.

### 8a. Netlify / Vercel
1. Import repositori di dashboards Netlify/Vercel.
2. Build command: `npm run build` · Publish directory: `dist`.
3. Tambahkan **redirect SPA** (agar `/product/...` dan `/admin` tidak 404):
   - Netlify: buat file `public/_redirects` berisi `/*  /index.html  200`.
   - Vercel: buat file `vercel.json`:
     ```json
     { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
     ```

### 8b. cPanel / Shared Hosting
1. Jalankan `npm run build`.
2. Upload isi `dist/` ke `public_html` (via File Manager / FTP).
3. Buat `.htaccess` di `public_html` untuk SPA fallback:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
4. Gunakan domain/SSL Anda.

### 8c. GitHub Pages (sub-folder)
1. `npm run build` (sudah pakai `base: './'`).
2. Push isi `dist/` ke branch `gh-pages`.
3. Enable **SPA fallback** (custom 404) dan sesuaikan route agar tidak memakai navigate *refresh* di sub-path — untuk SPA di sub-folder disarankan switch `BrowserRouter` → `HashRouter` di `src/main.jsx`.

---

## 9. Login Admin

- URL: `/admin/login`
- **Kredensial demo:** username `admin`, password `admin123`.

> **⚠️ Keamanan:** autentikasi ini hanya demo frontend. Password tidak disimpan sebagai teks (hanya hash sederhana) dan sesi disimpan di localStorage. **Untuk produksi wajib validasi kredensial di backend/API** (hash di server, sesi/JWT di httpOnly cookie). Lihat catatan di `src/services/authService.js`.

---

## 10. Konfigurasi Affiliate (CTA Per Produk)

Setiap produk punya pengaturan CTA sendiri (di form **Tambah/Edit Produk → Pengaturan CTA**):

1. **Tipe CTA** pilih `Affiliate`.
2. **Teks Tombol** — misal `Beli via Affiliate`.
3. **URL Tujuan** — contoh `https://shopee.co.id/affiliate/...` atau `https://tid.uber/?coupon=...`.

Saat pengunjung menekan tombol, browser membuka URL affiliate di **tab baru** (`rel="noopener noreferrer"`).

- Nilai **default** untuk produk baru bisa diatur di **Dashboard → CTA Settings**.
- Tipe `Custom URL` bekerja sama persis dengan Affiliate, hanya untuk tautan non-affiliate (toko sendiri, marketplace).

---

## 11. Konfigurasi WhatsApp (CTA WhatsApp)

Buka **Dashboard → WhatsApp Settings**:

1. **Nomor WhatsApp** — gunakan format internasional tanpa `+`/spasi. Contoh: `6283166857537`. Input `08xx` otomatis diubah jadi `628xx`.
2. **Template Pesan** — contoh:
   ```
   Halo kak, saya tertarik dengan produk {product_name}.
   Harga: {price}

   Apakah produknya masih tersedia?
   ```

Placeholder yang didukung (diganti otomatis saat tombol ditekan):

| Placeholder | Diganti dengan |
|---|---|
| `{product_name}` | Nama produk |
| `{price}` | Harga efektif (promo jika ada), format Rupiah |

Format tautan yang dibuat: `https://wa.me/6283166857537?text=<pesan_ter-encode>` (format resmi WhatsApp).

- Produk dengan CTA WhatsApp bisa **menimpa nomor & template** sendiri (opsional) di form produk.
- Halaman settings menyediakan **preview pesan** + tombol **"Uji Coba Kirim"**.

---

## 12. Cara Menambahkan Produk

1. Login admin → **Tambah Produk** (atau `/admin/products/new`).
2. Isi:
   - **Nama Produk** — slug dibuat otomatis (mis. `Hoodie Oversize Fleece Premium` → `/product/hoodie-oversize-fleece-premium`).
   - **Foto Utama / Foto Tambahan** — tempel URL gambar atau upload file (maks 400KB untuk penyimpanan lokal).
   - **Harga Normal** dan **Harga Promo** — diskon dihitung otomatis. Kosongkan harga promo = tampil harga normal saja.
   - **Deskripsi** dan **Spesifikasi** (baris nama/nilai, bisa ditambah/hapus).
   - **Pengaturan CTA** — pilih tipe (`Affiliate` / `WhatsApp` / `Custom URL` / `Tanpa CTA`) dan isi field sesuai tipe.
   - **Status aktif** dan **Produk Pilihan** (tampil di homepage), lalu simpan.

Produk nonaktif disembunyikan dari toko tetapi tetap ada di admin. Semua data tersimpan di localStorage browser; tidak perlu database.

---

## 13. Alur Pengembangan ke Backend/API

Struktur sudah disiapkan agar mudah upgrade:

1. Di `services/storage.js` hanya ada helper baca/tulis (saat ini localStorage).
2. Ganti isi `productService.listProducts()` misalnya menjadi `fetch('/api/products').then(r => r.json())`.
3. Panggil `touch()` dari `StoreContext` setelah mutasi agar seluruh UI otomatis re-render (sudah difasilitasi lewat `useStoreValue`).
4. Komponen UI & halaman **tidak perlu diubah** karena hanya memanggil service.

Untuk gambar produksi, simpan file di object storage/backend, bukan localStorage (upload file di dashboard dibatasi 400KB hanya untuk hosting lokal).

---

## 14. Struktur Data Produk

```js
{
  id: "p-1",
  name: "Smartphone Nova X5 5G 256GB",
  slug: "smartphone-nova-x5-5g-256gb",
  mainImage: "https://.../foto.jpg",
  images: ["https://.../foto-1.jpg", "https://.../foto-2.jpg"],
  normalPrice: 4999000,
  salePrice: 4399000,
  discount: 12,                // otomatis
  description: "Deskripsi lengkap...",
  specifications: [ { name: "Warna", value: "Hitam" } ],
  cta: {
    type: "affiliate",         // affiliate | whatsapp | custom | none
    text: "Beli via Affiliate",
    url: "https://affiliate.com/product123",
    phone: "",                 // opsional (khusus whatsapp)
    message: ""                // opsional template khusus produk
  },
  status: true,
  featured: true,
  createdAt: 1730000000000
}
```

---

## 15. Kontribusi / Perluas

- Tambah halaman baru: buat di `src/pages`, daftarkan route di `src/App.jsx`.
- Ganti aksen warna: ubah `--color-*` / kelas `indigo` di `src/index.css` & komponen.
- Tambah backend: ikuti bagian 13.

Lisensi: bebas digunakan untuk pengembangan Anda sendiri.