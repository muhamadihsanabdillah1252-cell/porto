<?php
/**
 * includes/functions.php
 * -----------------------------------------------------------------
 * Kumpulan fungsi keamanan yang dipakai berulang kali.
 * -----------------------------------------------------------------
 */

/**
 * Escape output untuk mencegah XSS. SELALU bungkus data dari database
 * atau input user dengan fungsi ini sebelum ditampilkan di HTML.
 */
function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

/**
 * Generate CSRF token dan simpan di session (sekali per session).
 */
function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Cetak <input type="hidden"> berisi CSRF token, dipakai di semua <form>.
 */
function csrf_field(): string
{
    return '<input type="hidden" name="csrf_token" value="' . e(csrf_token()) . '">';
}

/**
 * Verifikasi CSRF token dari form. Panggil di awal setiap handler POST.
 * hash_equals() dipakai supaya tahan terhadap timing attack.
 */
function verify_csrf(): void
{
    $token = $_POST['csrf_token'] ?? '';
    if (!is_string($token) || empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        http_response_code(403);
        die('Permintaan tidak valid (CSRF token salah/kadaluarsa). Silakan muat ulang halaman.');
    }
}

/**
 * Validasi input teks sederhana (nama, jurusan, kelas).
 * Whitelist karakter yang diizinkan, bukan blacklist.
 */
function validate_text(string $value, int $minLen = 1, int $maxLen = 100): ?string
{
    $value = trim($value);
    $len = mb_strlen($value);
    if ($len < $minLen || $len > $maxLen) {
        return null;
    }
    // Huruf, angka, spasi, titik, koma, strip, garis miring (untuk jurusan spt "IPA/MIPA")
    if (!preg_match('/^[\p{L}\p{N}\s\.\,\-\/]+$/u', $value)) {
        return null;
    }
    return $value;
}

/**
 * Ambil alamat IP pengunjung (untuk logging, bukan untuk otorisasi).
 */
function get_client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/**
 * Redirect dengan header Location lalu hentikan eksekusi.
 */
function redirect(string $path): void
{
    header('Location: ' . $path);
    exit;
}
