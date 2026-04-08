<?php

$nombre=["Aaron Garcia","Abrahan Lopez","Anderson Pichardo","Raysmari Suarez",'Yovani Romero'];

function mostrar(){
    global $nombre;
    foreach ($nombre as $n){
        echo "<li>".$n."</li>";
    }
}

mostrar();


?>


