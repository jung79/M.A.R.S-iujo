<?php
// registrar.php — Guarda nombre + descriptor facial en MySQL

header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

$datos = json_decode(file_get_contents('php://input'), true);

if (empty($datos['id'])) {
    echo json_encode(['ok' => false, 'error' => 'Faltan datos']);
    exit;
}

$id         = intval($datos['id']);

$conn = conectar();
$stmt = $conn->prepare("DELETE FROM personas WHERE id = ?");
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo json_encode(['ok' => true, 'id' => $id]);
} else {
    echo json_encode(['ok' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>