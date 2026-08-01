<?php
require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/auth.php';
require_login();

$stmt = $pdo->query('SELECT id, nama, jurusan, kelas FROM members ORDER BY nama ASC');
$members = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #0e0e0e; color: #eee; margin: 0; padding: 2rem; }
        .topbar { display: flex; justify-content: space-between; align-items: center; max-width: 900px; margin: 0 auto 1.5rem; }
        table { width: 100%; max-width: 900px; margin: 0 auto; border-collapse: collapse; background: #1b1b1b; border-radius: 8px; overflow: hidden; }
        th, td { padding: 0.7rem 1rem; text-align: left; border-bottom: 1px solid #292929; }
        th { background: #222; }
        a.btn { color: #fff; background: #333; padding: 0.35rem 0.7rem; border-radius: 6px; text-decoration: none; font-size: 0.85rem; margin-right: 0.3rem; }
        a.btn.danger { background: #7a2020; }
        a.btn.primary { background: #e63946; }
    </style>
</head>
<body>
    <div class="topbar">
        <h1>Dashboard Anggota</h1>
        <div>
            <a class="btn primary" href="member_form.php">+ Tambah Anggota</a>
            <a class="btn" href="../logout.php">Logout (<?= e($_SESSION['admin_username']) ?>)</a>
        </div>
    </div>
    <table>
        <tr><th>Nama</th><th>Jurusan</th><th>Kelas</th><th>Aksi</th></tr>
        <?php foreach ($members as $m): ?>
        <tr>
            <td><?= e($m['nama']) ?></td>
            <td><?= e($m['jurusan']) ?></td>
            <td><?= e($m['kelas']) ?></td>
            <td>
                <a class="btn" href="member_form.php?id=<?= (int)$m['id'] ?>">Edit</a>
                <a class="btn" href="upload_photo.php?id=<?= (int)$m['id'] ?>">Upload Foto</a>
                <a class="btn danger" href="delete_member.php?id=<?= (int)$m['id'] ?>&csrf=<?= e(csrf_token()) ?>"
                   onclick="return confirm('Yakin hapus anggota ini beserta semua fotonya?');">Hapus</a>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>
