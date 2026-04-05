<?php
// registrar.php — Guarda nombre + descriptor facial en MySQL

header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

$datos = json_decode(file_get_contents('php://input'), true);

if (empty($datos['nombre']) || empty($datos['descriptor'])) {
    echo json_encode(['ok' => false, 'error' => 'Faltan datos']);
    exit;
}

$nombre     = htmlspecialchars(trim($datos['nombre']));
$descriptor = json_encode($datos['descriptor']);

$conn = conectar();
$stmt = $conn->prepare("INSERT INTO personas (nombre, descriptor) VALUES (?, ?)");
$stmt->bind_param('ss', $nombre, $descriptor);

if ($stmt->execute()) {
    echo json_encode(['ok' => true, 'id' => $conn->insert_id, 'nombre' => $nombre]);
} else {
    echo json_encode(['ok' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>