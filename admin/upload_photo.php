<?php
require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/auth.php';
require_login();

$memberId = isset($_GET['id']) ? (int) $_GET['id'] : (isset($_POST['id']) ? (int) $_POST['id'] : 0);

$stmt = $pdo->prepare('SELECT nama FROM members WHERE id = ?');
$stmt->execute([$memberId]);
$member = $stmt->fetch();
if (!$member) {
    die('Anggota tidak ditemukan.');
}

$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();

    if (empty($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'Upload gagal atau tidak ada file dipilih.';
    } else {
        $file = $_FILES['photo'];

        // 1. Cek ukuran file
        if ($file['size'] > MAX_UPLOAD_SIZE) {
            $errors[] = 'Ukuran file maksimal 5MB.';
        }

        // 2. Cek ekstensi (whitelist, case-insensitive)
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ALLOWED_EXTENSIONS, true)) {
            $errors[] = 'Ekstensi file tidak diizinkan. Gunakan: ' . implode(', ', ALLOWED_EXTENSIONS);
        }

        // 3. Cek MIME type ASLI dari isi file (bukan dari nama/header yang bisa dipalsukan)
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($mime, $allowedMimes, true)) {
            $errors[] = 'File bukan gambar yang valid.';
        }

        // 4. Verifikasi ulang bahwa file benar-benar gambar yang bisa dibaca
        //    (menolak file "gambar" yang sebenarnya berisi kode PHP/script)
        if (empty($errors) && @getimagesize($file['tmp_name']) === false) {
            $errors[] = 'File rusak atau bukan gambar asli.';
        }

        if (empty($errors)) {
            // 5. Generate nama file RANDOM - JANGAN PERNAH pakai nama asli dari user
            //    (mencegah path traversal & menyembunyikan struktur server)
            $newFilename = bin2hex(random_bytes(16)) . '.' . $ext;
            $destination = __DIR__ . '/../uploads/' . $newFilename;

            if (move_uploaded_file($file['tmp_name'], $destination)) {
                chmod($destination, 0644); // tidak executable

                $caption = validate_text($_POST['caption'] ?? '', 0, 255) ?? '';
                $stmt = $pdo->prepare(
                    'INSERT INTO photos (member_id, filename, original_name, caption) VALUES (?, ?, ?, ?)'
                );
                $stmt->execute([$memberId, $newFilename, basename($file['name']), $caption]);
                $success = true;
            } else {
                $errors[] = 'Gagal menyimpan file ke server.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Foto</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #0e0e0e; color: #eee; padding: 2rem; }
        form { max-width: 400px; margin: 0 auto; background: #1b1b1b; padding: 1.5rem; border-radius: 10px; }
        input { width: 100%; padding: 0.6rem; margin: 0.3rem 0 1rem; border-radius: 6px; border: 1px solid #333; background: #222; color: #eee; box-sizing: border-box; }
        button { background: #e63946; color: #fff; border: none; padding: 0.7rem 1.2rem; border-radius: 6px; cursor: pointer; }
        .error { background: #402020; color: #ffb4b4; padding: 0.6rem; border-radius: 6px; margin-bottom: 1rem; }
        .success { background: #204020; color: #b4ffb4; padding: 0.6rem; border-radius: 6px; margin-bottom: 1rem; }
        a { color: #999; }
    </style>
</head>
<body>
    <form method="POST" enctype="multipart/form-data">
        <h2>Upload Foto - <?= e($member['nama']) ?></h2>
        <?php if ($success): ?><div class="success">Foto berhasil diupload!</div><?php endif; ?>
        <?php foreach ($errors as $err): ?><div class="error"><?= e($err) ?></div><?php endforeach; ?>

        <?= csrf_field() ?>
        <input type="hidden" name="id" value="<?= (int) $memberId ?>">

        <label>Pilih Foto (JPG/PNG/WEBP, maks 5MB)</label>
        <input type="file" name="photo" accept=".jpg,.jpeg,.png,.webp" required>

        <label>Keterangan (opsional)</label>
        <input type="text" name="caption" maxlength="255">

        <button type="submit">Upload</button>
        <a href="dashboard.php">Kembali</a>
    </form>
</body>
</html>
