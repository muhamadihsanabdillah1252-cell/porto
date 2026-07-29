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
    role: "Video Editor · Photographer · Graphic Designer",
    photo: "assets/profile/pf.png", // foto utama kamu
    bio: "Video Editor, Photographer, dan Graphic Designer yang sedang aktif mengembangkan skill di bidang visual. Fokus pada editing yang rapi, dan hasil foto yang natural. Terbuka untuk proyek kolaborasi guna terus belajar dan berkembang.",
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
    { name: "Canva",         logo: "assets/software/canva.png",         initials: "Cv" },
    { name: "After Effects", logo: "assets/software/aftereffects.png",  initials: "Ae" }
  ],

  // ============ HALAMAN 2: POSTER ============
  posters: [
    { image: "assets/poster/1.png", title: "Poster", year: "2026", category: "Personal" },
    { image: "assets/poster/2.png", title: "Poster", year: "2026", category: "Client" },
    { image: "assets/poster/6.png", title: "Poster", year: "2026", category: "Personal" },
    { image: "assets/poster/7.png", title: "Poster", year: "2026", category: "Personal" },
    { image: "assets/poster/4.png", title: "Poster", year: "2026", category: "Personal" },
    { image: "assets/poster/9.png", title: "Poster", year: "2026", category: "Personal" },
    { image: "assets/poster/11.jpg", title: "Poster", year: "2026", category: "Personal" }
  ],

  // ============ HALAMAN 3: FOTOGRAFI ============
  photos: [
    { image: "assets/photo/3.avif", title: "Tugas Praktik", caption: "", category: "School" },
    { image: "assets/photo/2.avif", title: "Tugas Praktik", caption: "", category: "School" },
    { image: "assets/photo/1.avif", title: "Tugas Praktik", caption: "", category: "School" },
    { image: "assets/photo/4.avif", title: "Tugas Praktik", caption: "", category: "School" },
    { image: "assets/photo/6.avif", title: "Light Trails", caption: "", category: "Personal" }
  ],

  // ============ HALAMAN 4: VIDEO ============
  // type: "file"    -> video kamu sendiri (taruh di assets/video/, isi "src")
  // type: "youtube" -> tempel ID videonya saja (bukan link penuh)
  //                    contoh link: https://www.youtube.com/watch?v=ABC123 -> ID = ABC123
  videos: [
    {
      type: "file",
      src: "assets/video/1.webm",
      thumbnail: "assets/video/1.png",
      title: "Event Pentas Seni",
      duration: "00:20",
      category: "Editing"
    },
    {
      type: "file",
      src: "assets/video/2.webm",
      thumbnail: "assets/video/2.png",
      title: "SKL",
      duration: "01:13",
      category: "Editing"
    },
    {
      type: "file",
      src: "assets/video/4.webm",
      thumbnail: "assets/video/4.png",
      title: "Minecraft",
      duration: "00:14",
      category: "Editing"
    }
  ]
};
