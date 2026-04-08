<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M.A.R.S. - Medidor de Distancia</title>
    <link rel="stylesheet" href="css/estilo.css">

    <script src="js/face-api.min.js"></script>
</head>
<body>
    <?php include 'php/navegador.php';?>

 <section class="monitoreo-section">

    <div class="monitoreo-container">
        
        <div class="panel-izquierdo">
            <div class="visor-camara">
                
                <video id="webcam" autoplay playsinline class="webcamspace"></video>
                <canvas id="overlay" class="webcamspace"></canvas>
                <div class="escaneo-animado"></div>
                <p class="tag-cam">LIVE: M.A.R.S. SENSOR001</p>
            </div>
                
            <button id="toggleLandMark" class="optionButton">Mostrar las marcas: <span id="landmarkStatus">No</span> </button>
           

            <div class="datos-biometricos">
                <div class="dato-item">
                    <span class="label">Personas:</span>
                    <span class="valor" id="humans">Esperando camara...</span>
                </div>
                <div class="dato-item">
                    <span class="label">Distancia:</span>
                    <span class="valor" id="distance">Esperando camara...</span>
                </div>
                <div class="dato-item">
                    <span class="label">Estado Biométrico:</span>
                    <span class="valor" id="estado">Esperando camara...</span>
                </div>
                <div class="dato-item">
                    <span class="label">Precisión:</span>
                    <div class="barra-carga"></div>
                </div>
            </div>
        </div>

        <div class="panel-derecho">
            <div class="info-card">
                <img src="img/movimiento.png" alt="">
                <p>El sistema M.A.R.S. analiza patrones oculares y biométricos para validar la presencia humana en áreas restringidas.</p>
                
                <div class="instrucciones">
                    <h3>Instrucciones de Uso</h3>
                    <ul>
                        <li><span>1</span> Sitúese frente al sensor a una distancia de 1.5 metros.</li>
                        <li><span>2</span> Mantenga la mirada fija en el lente de la cámara M.A.R.S.</li>
                        <li><span>3</span> Espere a que el indicador biometríco cambie a <strong style="color: #00FFFF;">VALIDADO</strong>.</li>
                        <li><span>4</span> No use accesorios que cubran parcialmente el rostro (lentes oscuros, bufandas).</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>


    

<footer class="footer-mars">
    <div class="footer-container">
        
        <div class="footer-section">
            <img src="img/logo.png" alt=""><br>
            <h2 class="footer-logo">M.A.R.S.</h2>
            <p class="proyecto-nombre">Proyecto: Monitoreo y Análisis de Reconocimiento Sensorial</p>
            <p class="proyecto-desc">"Este proyecto ha sido realizado con mucha dedicación y pasión, buscando innovar en el campo de la visión artificial."</p>
        </div>

        <div class="footer-section">
            <h3>Información Académica</h3>
            <p><strong>Area:</strong> Algoritmo y programacion 2</p>
            <p><strong>Sección:</strong> "A" </p>
            <p><strong>Semestre :</strong> 3</p>
        </div>

        <div class="footer-section">
            <h3>Integrantes del Grupo</h3>
            <ul class="lista-integrantes">
                 <?php include 'php/nombres.php';?>
            </ul>
        </div>

    </div>

    <div class="footer-bottom">
        
        <p>&copy; 2026 M.A.R.S. - Informatica </p>
        <img src="img/IUJO.gif" alt=""><br>
    </div>
</footer>


    <script src="js/camara.js" type="module"></script>
    
</body>
</html>