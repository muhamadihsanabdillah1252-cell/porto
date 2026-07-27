/* =============================================================
   CONFIG.JS
   ---------------------------------------------------------------
   INI SATU-SATUNYA FILE YANG PERLU KAMU EDIT untuk mengubah isi
   website (nama, foto, software, poster, foto, video).
   Tidak perlu ngoding — cukup ganti teks & nama file di bawah ini.

   Cara pakai gambar/video:
   1. Taruh file gambar/video kamu di folder "assets/..." yang sesuai
      (assets/profile, assets/software, assets/poster, assets/photo,
      assets/video).
   2. Tulis nama filenya di bagian bawah, contoh: "assets/photo/pantai.jpg"
   3. Simpan file ini, lalu refresh halaman website di browser.

   Kamu bebas menambah / menghapus / mengurutkan ulang item di dalam
   array (yang diapit tanda [ ... ]) sesuka hati.

   "category" dipakai untuk filter/kotak centang di halaman Poster,
   Fotografi, dan Video (mirip filter di Modrinth). Boleh diisi bebas,
   misalnya: "Event", "Personal", "Klien", "Gaming", dst.
   ============================================================= */

const CONFIG = {

  // ============ HALAMAN 1: HOME / PROFIL ============
  profile: {
    name: "MUHAMAD IHSAN ABDILLAH",                 // ganti dengan nama kamu
    role: "Video Editor · Graphic Designer · Photographer · Videographer",
    photo: "assets/profile/pf.png", // foto utama kamu
    bio: "Video Editor, Graphic Designer, dan Photographer yang sedang aktif mengembangkan skill di bidang visual. Fokus pada editing yang rapi, desain yang komunikatif, dan hasil foto yang natural. Terbuka untuk proyek kolaborasi guna terus belajar dan berkembang.",
    location: "Bogor, Indonesia",
    status: "Terbuka untuk proyek freelance",
    email: "muhamadihsanabdillah1252@gmail.com"
  },

  // Tombol sosial media di halaman Home. "value" itu teks yang tampil di
  // tombolnya, "url" adalah link tujuan saat diklik. Boleh tambah/hapus/kosongkan.
  //
  // Soal tombol "Email": "mailto:email@kamu.com" akan membuka APLIKASI EMAIL
  // DEFAULT di komputer pengunjung (misalnya Outlook/Mail app) — bukan selalu
  // Gmail, tergantung pengaturan device mereka. Kalau kamu mau tombolnya PASTI
  // membuka Gmail (compose di browser), ganti urlnya jadi format ini:
  // "https://mail.google.com/mail/?view=cm&fs=1&to=emailkamu@gmail.com"
  socials: [
    { value: "Instagram", url: "https://instagram.com/mistyihsan" },
    { value: "YouTube",   url: "https://youtube.com/@MistyIhsan" },
    { value: "Email",     url: "mailto:muhamadihsanabdillah1252@gmail.com" },
    { value: "WhatsApp",  url: "https://wa.me/6282299364639" }
  ],

  // Daftar software/aplikasi yang kamu pakai.
  // "logo" = path ke file logo (taruh di assets/software/).
  // Kalau logo belum ada, tulis "initials" (2 huruf) untuk tampilan sementara.
  software: [
    { name: "CapCut",        logo: "assets/software/capcut.png",        initials: "CC" },
    { name: "Adobe Premiere Pro", logo: "assets/software/premiere.png", initials: "Pr" },
    { name: "Adobe Photoshop",    logo: "assets/software/photoshop.png", initials: "Ps" },
    { name: "Adobe Lightroom",    logo: "assets/software/lightroom.png", initials: "Lr" },
    { name: "Canva",         logo: "assets/software/canva.png",         initials: "Cv" }
  ],

  // ============ HALAMAN 2: POSTER ============
  posters: [
    { image: "assets/poster/poster-1.jpg", title: "Judul Poster 1", year: "2026", category: "Event" },
    { image: "assets/poster/poster-2.jpg", title: "Judul Poster 2", year: "2026", category: "Klien" },
    { image: "assets/poster/poster-3.jpg", title: "Judul Poster 3", year: "2025", category: "Personal" }
  ],

  // ============ HALAMAN 3: FOTOGRAFI ============
  photos: [
    { image: "assets/photo/photo-1.jpg", title: "Judul Foto 1", caption: "Lokasi / kamera / catatan singkat", category: "Landscape" },
    { image: "assets/photo/photo-2.jpg", title: "Judul Foto 2", caption: "Lokasi / kamera / catatan singkat", category: "Potrait" },
    { image: "assets/photo/photo-3.jpg", title: "Judul Foto 3", caption: "Lokasi / kamera / catatan singkat", category: "Event" }
  ],

  // ============ HALAMAN 4: VIDEO ============
  // type: "file"    -> video kamu sendiri (taruh di assets/video/, isi "src")
  // type: "youtube" -> tempel ID videonya saja (bukan link penuh)
  //                    contoh link: https://www.youtube.com/watch?v=ABC123 -> ID = ABC123
  videos: [
    {
      type: "file",
      src: "assets/video/video-1.mp4",
      thumbnail: "assets/video/thumb-1.jpg",
      title: "Judul Video Edit 1",
      duration: "01:24",
      category: "Editing"
    },
    {
      type: "youtube",
      src: "dQw4w9WgXcQ",
      thumbnail: "",
      title: "Judul Video (dari YouTube)",
      duration: "—",
      category: "Footage"
    }
  ]
};
