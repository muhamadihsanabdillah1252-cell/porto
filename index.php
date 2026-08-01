<?php
require_once __DIR__ . '/includes/bootstrap.php';

// Prepared statement: aman meski tanpa input user, ini praktik konsisten
$stmt = $pdo->query('SELECT id, nama, jurusan, kelas FROM members ORDER BY nama ASC');
$members = $stmt->fetchAll();

// Ambil foto per anggota (query terpisah, tetap prepared statement)
$photoStmt = $pdo->prepare('SELECT filename, caption FROM photos WHERE member_id = ? ORDER BY uploaded_at DESC LIMIT 3');
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eskul Fotografi</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #0e0e0e; color: #eee; margin: 0; padding: 2rem; }
        h1 { text-align: center; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.2rem; max-width: 1000px; margin: 2rem auto; }
        .card { background: #1b1b1b; border-radius: 10px; padding: 1rem; }
        .card h3 { margin: 0 0 0.3rem; }
        .meta { color: #999; font-size: 0.85rem; margin-bottom: 0.6rem; }
        .photos { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .photos img { width: 70px; height: 70px; object-fit: cover; border-radius: 6px; }
        footer { text-align: center; margin-top: 3rem; }
        footer a { color: #888; font-size: 0.85rem; }
    </style>
</head>
<body>
    <h1>📷 Anggota Eskul Fotografi</h1>
    <div class="grid">
        <?php foreach ($members as $m): ?>
            <div class="card">
                <h3><?= e($m['nama']) ?></h3>
                <div class="meta"><?= e($m['jurusan']) ?> &middot; Kelas <?= e($m['kelas']) ?></div>
                <div class="photos">
                    <?php
                    $photoStmt->execute([$m['id']]);
                    foreach ($photoStmt->fetchAll() as $p):
                        // Nama file yang ditampilkan sudah di-generate random saat upload,
                        // jadi aman dipakai sebagai path. Tetap di-escape untuk jaga-jaga.
                    ?>
                        <img src="uploads/<?= e($p['filename']) ?>" alt="<?= e($p['caption'] ?? 'Foto karya') ?>" loading="lazy">
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endforeach; ?>
        <?php if (empty($members)): ?>
            <p>Belum ada anggota terdaftar.</p>
        <?php endif; ?>
    </div>
    <footer><a href="login.php">Login Admin</a></footer>
</body>
</html>
