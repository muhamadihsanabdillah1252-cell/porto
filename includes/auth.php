<?php
/**
 * includes/auth.php
 * -----------------------------------------------------------------
 * Semua logika autentikasi: cek kredensial, rate limiting/lockout
 * anti brute-force, dan guard untuk halaman admin.
 * -----------------------------------------------------------------
 */

/**
 * Panggil di paling atas setiap halaman admin/*.php untuk memastikan
 * hanya admin yang sudah login yang bisa mengakses.
 */
function require_login(): void
{
    if (empty($_SESSION['admin_id'])) {
        redirect('../login.php');
    }
}

/**
 * Cek apakah akun sedang dikunci karena terlalu banyak percobaan gagal.
 */
function is_locked_out(PDO $pdo, string $username): bool
{
    $stmt = $pdo->prepare('SELECT locked_until FROM admins WHERE username = ?');
    $stmt->execute([$username]);
    $row = $stmt->fetch();

    if ($row && $row['locked_until'] !== null) {
        return strtotime($row['locked_until']) > time();
    }
    return false;
}

/**
 * Catat percobaan login gagal. Kunci akun sementara jika sudah
 * melebihi batas MAX_LOGIN_ATTEMPTS.
 */
function record_failed_attempt(PDO $pdo, string $username): void
{
    $stmt = $pdo->prepare('SELECT id, failed_attempts FROM admins WHERE username = ?');
    $stmt->execute([$username]);
    $row = $stmt->fetch();

    if ($row) {
        $attempts = (int) $row['failed_attempts'] + 1;
        if ($attempts >= MAX_LOGIN_ATTEMPTS) {
            $lockUntil = date('Y-m-d H:i:s', time() + LOCKOUT_MINUTES * 60);
            $upd = $pdo->prepare('UPDATE admins SET failed_attempts = ?, locked_until = ? WHERE id = ?');
            $upd->execute([$attempts, $lockUntil, $row['id']]);
        } else {
            $upd = $pdo->prepare('UPDATE admins SET failed_attempts = ? WHERE id = ?');
            $upd->execute([$attempts, $row['id']]);
        }
    }

    log_login_attempt($pdo, $username, false);
}

/**
 * Reset counter percobaan gagal setelah login berhasil.
 */
function reset_failed_attempts(PDO $pdo, int $adminId): void
{
    $stmt = $pdo->prepare('UPDATE admins SET failed_attempts = 0, locked_until = NULL WHERE id = ?');
    $stmt->execute([$adminId]);
}

/**
 * Simpan log setiap percobaan login (berhasil maupun gagal) untuk audit.
 */
function log_login_attempt(PDO $pdo, string $username, bool $success): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO login_logs (username, ip_address, success) VALUES (?, ?, ?)'
    );
    $stmt->execute([$username, get_client_ip(), $success ? 1 : 0]);
}

/**
 * Proses login: verifikasi username + password (hash), lalu buat session baru.
 * Mengembalikan true jika berhasil.
 */
function attempt_login(PDO $pdo, string $username, string $password): bool
{
    // Query pakai prepared statement -> aman dari SQL Injection
    $stmt = $pdo->prepare('SELECT id, password_hash FROM admins WHERE username = ?');
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    // password_verify menangani perbandingan hash dengan aman (timing-safe)
    if ($admin && password_verify($password, $admin['password_hash'])) {
        // Regenerasi session ID setelah login -> cegah session fixation
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $username;

        reset_failed_attempts($pdo, $admin['id']);
        log_login_attempt($pdo, $username, true);
        return true;
    }

    record_failed_attempt($pdo, $username);
    return false;
}
