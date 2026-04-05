<?php
// personas.php Devuelve todas las personas registradas en JSON

header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

$conn   = conectar();
$result = $conn->query("SELECT id, nombre, descriptor FROM personas ORDER BY nombre ASC");

$personas = [];
while ($fila = $result->fetch_assoc()) {
    $personas[] = [
        //'id'         => (int) $fila['id'],
        'nombre'     => $fila['nombre'],
        'descriptor' => json_decode($fila['descriptor'])
    ];
}

$conn->close();
echo json_encode(['ok' => true, 'personas' => $personas]);
?>