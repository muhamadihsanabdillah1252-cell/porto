-- =====================================================================
-- Skema Database - Sistem Eskul Fotografi
-- =====================================================================
-- Jalankan file ini di MySQL/MariaDB untuk membuat database & tabel.
-- Import lewat: mysql -u root -p < database.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS eskul_fotografi
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE eskul_fotografi;

-- Tabel admin (yang bisa login ke panel admin)
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    failed_attempts INT DEFAULT 0,
    locked_until DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel anggota eskul fotografi
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    jurusan VARCHAR(50) NOT NULL,
    kelas VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel foto karya (upload oleh admin, terhubung ke anggota)
CREATE TABLE photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,      -- nama file random di server (BUKAN nama asli)
    original_name VARCHAR(255) NOT NULL, -- nama file asli, hanya untuk ditampilkan
    caption VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Log percobaan login, untuk audit & deteksi brute force
CREATE TABLE login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    ip_address VARCHAR(45),
    success BOOLEAN,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================================
-- PENTING: Buat akun MySQL khusus aplikasi dengan hak akses TERBATAS.
-- JANGAN pernah pakai akun root MySQL di aplikasi web.
-- Ganti 'password_kuat_disini' dengan password yang benar-benar kuat.
-- =====================================================================
CREATE USER IF NOT EXISTS 'eskul_app'@'localhost' IDENTIFIED BY 'password_kuat_disini';

-- Hanya beri izin yang benar-benar dibutuhkan aplikasi (tidak ada DROP/ALTER/GRANT)
GRANT SELECT, INSERT, UPDATE, DELETE ON eskul_fotografi.* TO 'eskul_app'@'localhost';
FLUSH PRIVILEGES;

-- =====================================================================
-- Membuat akun admin pertama.
-- JANGAN masukkan password polos di sini. Generate hash-nya dulu dengan:
--   php -r "echo password_hash('password_anda', PASSWORD_BCRYPT);"
-- Lalu tempel hasilnya di bawah ini.
-- =====================================================================
-- INSERT INTO admins (username, password_hash) VALUES ('admin', 'TEMPEL_HASH_DI_SINI');
