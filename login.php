<?php
require_once __DIR__ . '/includes/bootstrap.php';
require_once __DIR__ . '/includes/auth.php';

// Jika sudah login, langsung ke dashboard
if (!empty($_SESSION['admin_id'])) {
    redirect('admin/dashboard.php');
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();

    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username === '' || $password === '') {
        $error = 'Username dan password wajib diisi.';
    } elseif (is_locked_out($pdo, $username)) {
        $error = 'Akun terkunci sementara karena terlalu banyak percobaan gagal. Coba lagi beberapa menit lagi.';
    } else {
        if (attempt_login($pdo, $username, $password)) {
            redirect('admin/dashboard.php');
        } else {
            // Pesan generik: JANGAN kasih tahu apakah username atau password
            // yang salah, supaya penyerang tidak bisa "menebak" username valid.
            $error = 'Username atau password salah.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - Eskul Fotografi</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #111; color: #eee; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .box { background: #1b1b1b; padding: 2rem; border-radius: 10px; width: 320px; }
        h1 { font-size: 1.2rem; margin-top: 0; }
        input { width: 100%; padding: 0.6rem; margin: 0.4rem 0 1rem; border-radius: 6px; border: 1px solid #333; background: #222; color: #eee; box-sizing: border-box; }
        button { width: 100%; padding: 0.7rem; background: #e63946; border: none; border-radius: 6px; color: #fff; font-weight: 600; cursor: pointer; }
        .error { background: #402020; color: #ffb4b4; padding: 0.6rem; border-radius: 6px; font-size: 0.9rem; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="box">
        <h1>📷 Login Admin Eskul Fotografi</h1>
        <?php if ($error): ?>
            <div class="error"><?= e($error) ?></div>
        <?php endif; ?>
        <form method="POST" autocomplete="off">
            <?= csrf_field() ?>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required maxlength="50">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required maxlength="255">
            <button type="submit">Masuk</button>
        </form>
    </div>
</body>
</html>
