<?php
// personas.php Devuelve todas las personas registradas en JSON

require_once __DIR__ . '/config.php';

$conn   = conectar();
$result = $conn->query("SELECT id, nombre, descriptor FROM personas ORDER BY nombre ASC");



echo '<div class="lista-rostros">
<h2>Rostros Registrados</h2>
<div id="rostros-registrados" class="rostros-container">
<table id="tagTable" class="tabla-rostros">
<thead>
<tr>';

 if ($result->num_rows === 0) {
        echo '<th id="taglist">La tabla esta vacia</th>';
        } else{
        echo '<th id="taglist">Etiqueta</th>';   
        }


echo '<th></th>
</tr>
</thead>
<tbody id="tabla-rostros">';

while ($fila = $result->fetch_assoc()) {

                echo '<tr id="persona-' . $fila['id'] . '"><td>' . $fila['nombre'] . '</td><td><button type="button" class="optionButton btnOff" onClick="eliminarPersona(' . $fila['id'] . ', \'' . $fila['nombre'] . '\')">Eliminar</button></td></tr>';

}

echo   '</tbody>
        </table>
        </div>
        </div>';

echo "<p>" . json_decode($result->fetch_assoc()) . "</p>";

$conn->close();
?>