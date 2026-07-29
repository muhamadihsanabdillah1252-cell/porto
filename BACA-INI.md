# Website Portofolio Kamu

Tema desain: **layout ala [Modrinth](https://modrinth.com)** (sidebar navigasi,
kotak pencarian, filter kategori, grid kartu) dengan nuansa **Minecraft**
(kartu seperti slot inventory, font blocky, warna hijau rumput khas
Modrinth/Minecraft).

Website ini punya 4 halaman terpisah:

1. **index.html** — Home: ala halaman "project" di Modrinth — foto profil besar, nama, deskripsi, jumlah karya (otomatis dihitung), info lokasi/status, tombol sosial media, dan daftar tools/software sebagai chip.
2. **poster.html** — Karya poster, dengan kotak pencarian + filter kategori di sisi kiri (mirip filter mod di Modrinth), grid kartu di kanan.
3. **fotografi.html** — Sama seperti Poster, untuk karya fotografi.
4. **video.html** — Sama seperti Poster/Fotografi, kartu video dengan tombol play, klik untuk memutar.

## Tampilan di HP
Website ini sudah dirapikan khusus untuk layar HP:
- Nav sidebar berubah jadi bar navigasi horizontal yang tetap menempel di atas saat scroll (ikon-only di layar sangat kecil, biar hemat tempat)
- Kotak pencarian & filter kategori dibuat jadi chip yang bisa disentuh dengan mudah (bukan checkbox kecil lagi)
- Foto profil & info di halaman Home otomatis jadi rata tengah dan ukurannya menyesuaikan lebar layar
- Jarak/padding di semua halaman dirapikan biar tidak terlalu sempit atau kepotong
- Lightbox foto & pemutar video menyesuaikan supaya tetap nyaman dilihat di layar kecil
- Efek partikel & background dekoratif otomatis lebih sederhana di HP biar tetap ringan dan tidak mengganggu

## Yang baru di versi ini
- **Sidebar navigasi** di kiri (seperti Modrinth) — otomatis mengikuti `config.js`, tidak perlu diedit manual. Di layar sempit/HP, sidebar berubah jadi bar navigasi di atas.
- **Pencarian & filter kategori** — di halaman Poster/Fotografi/Video, kamu bisa mengetik untuk mencari judul karya, dan mencentang kategori untuk menyaring. Kategori diambil otomatis dari field `category` di `config.js`.
- **Kartu ala "slot inventory" Minecraft** — saat kartu di-hover, muncul garis hijau seperti slot yang sedang dipilih di inventory Minecraft.
- **Background interaktif** — grid pixel, dua cahaya (hijau & dirt) yang melayang perlahan, siluet gunung blocky di bagian bawah layar, dan blok-blok kecil melayang (beberapa berkilau seperti ore). Semuanya bergerak halus mengikuti posisi mouse kamu (parallax). Gerakkan mouse juga memunculkan jejak partikel kecil, dan klik di mana saja memunculkan "ledakan" partikel — seperti efek pecah blok di Minecraft. Otomatis nonaktif di HP dan kalau "reduce motion" diaktifkan.
- **Statistik otomatis** di halaman Home — jumlah Poster/Foto/Video dihitung otomatis dari isi `config.js`, tidak perlu diubah manual.
- Transisi antar halaman dibuat halus tapi ringan (fade cepat), tidak ada animasi besar yang mengganggu.

## Soal tombol "Email"
Link `mailto:` di tombol Email akan membuka aplikasi email default di perangkat
pengunjung (bisa Outlook, Mail app bawaan HP, dll — bukan pasti Gmail).
Kalau kamu mau tombol itu **selalu membuka Gmail** (compose langsung di
browser), ganti url-nya di `config.js` menjadi:
```
https://mail.google.com/mail/?view=cm&fs=1&to=emailkamu@gmail.com
```
(sudah ada penjelasan yang sama sebagai komentar di dalam `config.js`)

> Catatan: ini bukan situs resmi Modrinth atau Mojang/Minecraft — hanya
> terinspirasi gaya layout & warnanya untuk portofolio kamu sendiri. Tidak ada
> logo/aset asli Minecraft atau Modrinth yang dipakai.

## Cara ubah isi website (tanpa ngoding)

Semua yang perlu kamu edit ada di **satu file**: `js/config.js`.
Buka file itu pakai text editor apa saja (Notepad, VS Code, dll).

Di dalamnya ada bagian:
- `profile` → nama, jabatan/peran, foto, bio singkat, lokasi, status ketersediaan
- `socials` → tombol sosial media (Instagram, YouTube, Email, WhatsApp, dll) di halaman Home
- `software` → daftar aplikasi yang kamu pakai (CapCut, Photoshop, dst)
- `posters` / `photos` / `videos` → karya kamu. Field `category` dipakai untuk kotak centang filter di sidebar kiri halaman masing-masing — isi bebas sesuai kebutuhanmu (misalnya "Event", "Personal", "Klien").
- `posters` → daftar karya poster
- `photos` → daftar karya foto
- `videos` → daftar video (file sendiri ATAU video YouTube)

Untuk menambah karya baru, tinggal **copy salah satu baris** di dalam kurung
`{ ... }`, tempel di bawahnya, lalu ganti isinya. Untuk menghapus, cukup hapus
barisnya.

## Cara menambahkan file gambar/video

1. Taruh file gambar/video ke folder yang sesuai di dalam `assets/`:
   - `assets/profile/` → foto profil kamu
   - `assets/software/` → logo aplikasi (png/svg, background transparan lebih bagus)
   - `assets/poster/` → gambar poster
   - `assets/photo/` → foto-foto
   - `assets/video/` → file video (.mp4) dan thumbnail-nya (.jpg)
2. Tulis nama file itu di `config.js` (contoh: `"assets/photo/pantai-sore.jpg"`).
3. Simpan, lalu refresh browser.

> Kalau gambar/video belum ada, website tetap tidak akan error — otomatis
> menampilkan kotak placeholder bertuliskan "belum ditambahkan" supaya kamu
> tahu bagian mana yang masih perlu diisi.

## Soal logo software (CapCut, Photoshop, dll)

Logo aplikasi seperti CapCut/Adobe adalah milik masing-masing perusahaan
(hak cipta/merek dagang), jadi saya tidak menyertakan file logo aslinya di
sini. Silakan unduh logo resminya sendiri (misalnya dari halaman "brand/press
kit" masing-masing aplikasi, atau dari App Store), simpan di
`assets/software/`, lalu daftarkan namanya di `config.js`. Selama file logo
belum ada, akan otomatis muncul kotak inisial (contoh: "CC" untuk CapCut)
sebagai gantinya.

## Cara membuka websitenya

Paling gampang: klik dua kali file `index.html`, akan terbuka di browser.

Kalau ada fitur yang tidak jalan saat dibuka langsung dari file (biasanya soal
video autoplay/beberapa browser membatasi ini), jalankan lewat server lokal
sederhana, misalnya lewat terminal di folder ini:

```
python3 -m http.server 8000
```

lalu buka `http://localhost:8000` di browser.

## Cara upload ke internet (opsional)

Folder ini bisa langsung diupload ke hosting statis gratis seperti
**GitHub Pages**, **Netlify**, atau **Vercel** — tinggal drag & drop seluruh
folder ini (pastikan struktur foldernya tidak berubah).
