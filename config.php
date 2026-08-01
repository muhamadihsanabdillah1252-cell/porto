<?php
/**
 * config.php
 * -----------------------------------------------------------------
 * Simpan semua kredensial sensitif di sini, TERPISAH dari kode lain.
 * Idealnya file ini diletakkan di LUAR document root (misal satu
 * folder di atas public_html) supaya tidak bisa diakses langsung
 * lewat browser sama sekali. Kalau tidak memungkinkan, minimal
 * pastikan .htaccess di root memblokir akses ke file ini (sudah
 * disediakan di proyek ini).
 *
 * JANGAN commit file ini ke Git dengan password asli.
 * Tambahkan "config.php" ke .gitignore lalu buat config.example.php
 * sebagai template.
 * -----------------------------------------------------------------
 */

// Sebaiknya ambil dari environment variable jika hosting mendukung,
// supaya password tidak pernah tertulis di kode:
// define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_HOST', 'localhost');
define('DB_NAME', 'eskul_fotografi');
define('DB_USER', 'eskul_app');       // Bukan root! Akun terbatas (least privilege)
define('DB_PASS', 'password_kuat_disini');
define('DB_CHARSET', 'utf8mb4');

// Batas ukuran upload foto (dalam bytes) -> 5MB
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024);

// Ekstensi foto yang diizinkan
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'webp']);

// Batas percobaan login sebelum akun dikunci sementara
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_MINUTES', 15);

// Set true HANYA jika situs sudah berjalan di HTTPS
define('FORCE_HTTPS', false);
