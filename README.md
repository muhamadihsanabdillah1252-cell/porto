# Sistem Data Anggota Eskul Fotografi

Website sederhana untuk mendata anggota eskul fotografi (nama, jurusan, kelas)
lengkap dengan panel admin untuk kelola data dan upload foto karya.

## 🚀 Cara Install

1. **Import database**
   ```bash
   mysql -u root -p < database.sql
   ```
   Ganti password `'password_kuat_disini'` di `database.sql` sebelum dijalankan.

2. **Buat akun admin pertama**
   ```bash
   php -r "echo password_hash('password_admin_anda', PASSWORD_BCRYPT), PHP_EOL;"
   ```
   Salin hasilnya, lalu jalankan query ini di MySQL:
   ```sql
   INSERT INTO admins (username, password_hash) VALUES ('admin', 'HASIL_HASH_TADI');
   ```

3. **Sesuaikan `config.php`**
   Isi `DB_USER`, `DB_PASS` sesuai akun MySQL yang dibuat di `database.sql`
   (bukan root!). Set `FORCE_HTTPS` ke `true` jika situs sudah pakai SSL.

4. **Set permission folder uploads**
   ```bash
   chmod 755 uploads/
   ```

5. **Pastikan `mod_headers` dan `mod_rewrite` aktif** di Apache supaya
   `.htaccess` berfungsi penuh.

6. Buka `index.php` untuk galeri publik, `login.php` untuk masuk sebagai admin.

## 🔒 Ringkasan Lapisan Keamanan

| Ancaman | Cara Ditangani |
|---|---|
| **SQL Injection** | Semua query pakai PDO *prepared statement* (`ATTR_EMULATE_PREPARES = false`), tidak ada satupun input user yang digabung langsung ke string SQL |
| **XSS (Cross-Site Scripting)** | Semua output ke HTML dibungkus fungsi `e()` (`htmlspecialchars`), plus header `Content-Security-Policy` |
| **CSRF** | Token unik per session, diverifikasi (`hash_equals`) di setiap form POST dan aksi hapus |
| **Session Hijacking** | Cookie `HttpOnly`, `SameSite=Strict`, `Secure` (jika HTTPS), ID session diregenerasi setelah login, auto-logout setelah 30 menit idle |
| **Brute Force Login** | Akun terkunci otomatis 15 menit setelah 5 kali gagal login, semua percobaan dicatat di `login_logs` |
| **Malicious File Upload (Web Shell)** | Validasi ekstensi whitelist + MIME asli via `finfo` + `getimagesize()`, nama file di-random, folder `uploads/` diblokir total dari eksekusi PHP via `.htaccess` |
| **Path Traversal** | ID selalu di-cast `(int)`, nama file selalu lewat `basename()` |
| **Password Lemah** | Hash dengan `password_hash()` (bcrypt), tidak pernah disimpan plain text |
| **Kebocoran Info Server** | `display_errors` dimatikan, error hanya ke log file; `ServerSignature Off`; pesan login gagal generik (tidak bocorkan username valid) |
| **Directory Listing / Akses File Sensitif** | `.htaccess` mematikan `Options -Indexes`, memblokir akses langsung ke `config.php`, `database.sql`, `includes/`, `logs/` |
| **Akun Database Berlebihan Hak Akses** | Akun aplikasi MySQL hanya diberi `SELECT, INSERT, UPDATE, DELETE` (tidak ada `DROP`/`ALTER`/`GRANT`) — prinsip *least privilege* |
| **Clickjacking** | Header `X-Frame-Options: DENY` |
| **MIME Sniffing** | Header `X-Content-Type-Options: nosniff` |

## ⚠️ Yang Masih Perlu Kamu Lakukan Sendiri

Tidak ada sistem yang "100% tanpa celah" — keamanan adalah proses berkelanjutan.
Selain kode di atas, pastikan juga:

- **Aktifkan HTTPS** (sertifikat gratis lewat Let's Encrypt) lalu set `FORCE_HTTPS = true`
- **Backup database rutin**
- **Update PHP & MySQL** ke versi yang masih didapat security patch
- **Jangan taruh `config.php` dan folder proyek ini di Git tanpa `.gitignore`**
- Kalau hosting mendukung, pindahkan `config.php` ke **luar document root**
- Lakukan **penetration testing berkala**, misalnya coba jalankan `sqlmap` ke
  situsmu sendiri (bukan situs orang lain) untuk memverifikasi tidak ada celah SQLi
- Ganti semua password default (`password_kuat_disini`, dst) sebelum go-live

## 📁 Struktur Folder

```
eskul-fotografi/
├── config.php              # Kredensial DB (JANGAN publikasi ke browser)
├── database.sql             # Skema database
├── index.php                 # Galeri publik
├── login.php / logout.php
├── .htaccess                 # Header keamanan + blokir file sensitif
├── includes/
│   ├── bootstrap.php         # Session aman + koneksi PDO
│   ├── functions.php         # CSRF, validasi, escape output
│   └── auth.php               # Login, rate limiting, lockout
├── admin/
│   ├── dashboard.php
│   ├── member_form.php       # Tambah/edit anggota
│   ├── delete_member.php
│   └── upload_photo.php      # Upload dengan validasi ketat
├── uploads/
│   └── .htaccess              # Matikan eksekusi PHP di folder ini
└── logs/
    └── .htaccess              # Blokir akses langsung
```
