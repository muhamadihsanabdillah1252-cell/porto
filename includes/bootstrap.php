<?php
/**
 * includes/bootstrap.php
 * -----------------------------------------------------------------
 * Wajib di-include PALING ATAS di setiap halaman (login.php, index.php,
 * semua file di admin/, dst). File ini mengatur:
 *   1. Session yang aman (httponly, samesite, secure, regenerasi ID)
 *   2. Koneksi database via PDO dengan PREPARED STATEMENT enabled
 *   3. Error handling yang tidak membocorkan detail teknis ke user
 *   4. Header keamanan HTTP tambahan
 * -----------------------------------------------------------------
 */

require_once __DIR__ . '/../config.php';

// ---------------------------------------------------------------------
// 1. JANGAN tampilkan error PHP mentah ke pengunjung (bisa bocorkan
//    path server, query SQL, struktur tabel, dsb). Simpan ke log saja.
// ---------------------------------------------------------------------
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/../logs/error.log');

// ---------------------------------------------------------------------
// 2. Paksa HTTPS jika diaktifkan di config
// ---------------------------------------------------------------------
if (FORCE_HTTPS && (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off')) {
    $redirectUrl = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header('Location: ' . $redirectUrl, true, 301);
    exit;
}

// ---------------------------------------------------------------------
// 3. Konfigurasi session yang aman - HARUS sebelum session_start()
// ---------------------------------------------------------------------
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.use_strict_mode', '1');   // tolak session ID yang tidak dikenal
    ini_set('session.use_only_cookies', '1');  // jangan terima session ID dari URL
    ini_set('session.cookie_httponly', '1');   // JS tidak bisa baca cookie session (anti XSS-session-theft)
    ini_set('session.cookie_samesite', 'Strict'); // anti CSRF via cookie
    if (FORCE_HTTPS) {
        ini_set('session.cookie_secure', '1'); // cookie hanya dikirim lewat HTTPS
    }
    session_start();
}

// Timeout otomatis: logout paksa setelah 30 menit tidak aktif
$INACTIVE_LIMIT = 1800; // detik
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $INACTIVE_LIMIT)) {
    session_unset();
    session_destroy();
    session_start();
}
$_SESSION['last_activity'] = time();

// ---------------------------------------------------------------------
// 4. Header keamanan HTTP tambahan (lapisan pertahanan di luar SQLi)
// ---------------------------------------------------------------------
header('X-Content-Type-Options: nosniff');       // cegah MIME-sniffing
header('X-Frame-Options: DENY');                 // cegah clickjacking
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline';");

// ---------------------------------------------------------------------
// 5. Koneksi database via PDO - INI KUNCI UTAMA ANTI SQL INJECTION.
//    PDO::ATTR_EMULATE_PREPARES di-nonaktifkan supaya query benar-benar
//    dikirim sebagai prepared statement ke MySQL (bukan cuma di-escape
//    oleh PHP), dan PDO::ERRMODE_EXCEPTION supaya error tertangani rapi.
// ---------------------------------------------------------------------
try {
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false, // WAJIB false: prepared statement asli dari MySQL
    ]);
} catch (PDOException $e) {
    error_log('DB Connection failed: ' . $e->getMessage());
    http_response_code(500);
    die('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
}

require_once __DIR__ . '/functions.php';
