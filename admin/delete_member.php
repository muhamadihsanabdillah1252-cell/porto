<?php
require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/auth.php';
require_login();

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$token = $_GET['csrf'] ?? '';

// Verifikasi CSRF token juga untuk aksi hapus (walau lewat GET link)
if (!$id || empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
    http_response_code(403);
    die('Permintaan tidak valid.');
}

// Ambil dulu daftar file foto untuk dihapus dari disk sebelum record DB dihapus
$stmt = $pdo->prepare('SELECT filename FROM photos WHERE member_id = ?');
$stmt->execute([$id]);
$photos = $stmt->fetchAll();

$stmt = $pdo->prepare('DELETE FROM members WHERE id = ?'); // ON DELETE CASCADE menghapus foto di DB juga
$stmt->execute([$id]);

foreach ($photos as $p) {
    $path = __DIR__ . '/../uploads/' . basename($p['filename']); // basename() cegah path traversal
    if (is_file($path)) {
        unlink($path);
    }
}

redirect('dashboard.php');
