<?php
require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/auth.php';
require_login();

$id = null;
$nama = '';
$jurusan = '';
$kelas = '';
$errors = [];

// Mode edit: ambil data lama via prepared statement, ID di-cast ke int
if (isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    $stmt = $pdo->prepare('SELECT nama, jurusan, kelas FROM members WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        die('Anggota tidak ditemukan.');
    }
    $nama = $row['nama'];
    $jurusan = $row['jurusan'];
    $kelas = $row['kelas'];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();

    $id = isset($_POST['id']) && $_POST['id'] !== '' ? (int) $_POST['id'] : null;

    $nama = $_POST['nama'] ?? '';
    $jurusan = $_POST['jurusan'] ?? '';
    $kelas = $_POST['kelas'] ?? '';

    $validNama = validate_text($nama, 2, 100);
    $validJurusan = validate_text($jurusan, 2, 50);
    $validKelas = validate_text($kelas, 1, 20);

    if (!$validNama) $errors[] = 'Nama tidak valid (2-100 karakter, huruf/angka saja).';
    if (!$validJurusan) $errors[] = 'Jurusan tidak valid.';
    if (!$validKelas) $errors[] = 'Kelas tidak valid.';

    if (empty($errors)) {
        if ($id) {
            // UPDATE - prepared statement, parameter TIDAK PERNAH digabung ke string query
            $stmt = $pdo->prepare('UPDATE members SET nama = ?, jurusan = ?, kelas = ? WHERE id = ?');
            $stmt->execute([$validNama, $validJurusan, $validKelas, $id]);
        } else {
            // INSERT - prepared statement
            $stmt = $pdo->prepare('INSERT INTO members (nama, jurusan, kelas) VALUES (?, ?, ?)');
            $stmt->execute([$validNama, $validJurusan, $validKelas]);
        }
        redirect('dashboard.php');
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $id ? 'Edit' : 'Tambah' ?> Anggota</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #0e0e0e; color: #eee; padding: 2rem; }
        form { max-width: 400px; margin: 0 auto; background: #1b1b1b; padding: 1.5rem; border-radius: 10px; }
        input { width: 100%; padding: 0.6rem; margin: 0.3rem 0 1rem; border-radius: 6px; border: 1px solid #333; background: #222; color: #eee; box-sizing: border-box; }
        button { background: #e63946; color: #fff; border: none; padding: 0.7rem 1.2rem; border-radius: 6px; cursor: pointer; }
        .error { background: #402020; color: #ffb4b4; padding: 0.6rem; border-radius: 6px; margin-bottom: 1rem; }
        a { color: #999; }
    </style>
</head>
<body>
    <form method="POST">
        <h2><?= $id ? 'Edit' : 'Tambah' ?> Anggota</h2>
        <?php foreach ($errors as $err): ?>
            <div class="error"><?= e($err) ?></div>
        <?php endforeach; ?>
        <?= csrf_field() ?>
        <?php if ($id): ?><input type="hidden" name="id" value="<?= (int) $id ?>"><?php endif; ?>

        <label>Nama Siswa</label>
        <input type="text" name="nama" value="<?= e($nama) ?>" required maxlength="100">

        <label>Jurusan</label>
        <input type="text" name="jurusan" value="<?= e($jurusan) ?>" required maxlength="50">

        <label>Kelas</label>
        <input type="text" name="kelas" value="<?= e($kelas) ?>" required maxlength="20">

        <button type="submit">Simpan</button>
        <a href="dashboard.php">Batal</a>
    </form>
</body>
</html>
