<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M.A.R.S. - Registro de Rostro</title>
    <link rel="stylesheet" href="css/estilo.css">
    <script src="js/face-api.min.js"></script>
</head>
<body>
    <?php include 'php/navegador.php';?>

    <section class="registro-rostro">
        <div class="registro-container">

            <div class="panel-captura">
                <div class="visor-circular" style="position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
                    <video id="video" autoplay muted playsinline style="position:absolute; opacity:100; width:1px; height:1px;"></video>
                    <canvas id="canvas" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:100%; height:100%; object-fit:cover;"></canvas>
                    <div class="anillo-escaneo" style="position:relative; z-index:2;"></div>
                </div>

                <div style="margin: 10px 0;">
                    <button class="optionButton btnOn btnPush" onclick="iniciarCamara()">Encender cámara</button>
                    <button class="optionButton btnOff" onclick="apagarCamara()">Apagar cámara</button>
                </div>
                
                <div class="indicadores-estado">
                    <div class="estado-item" id="ind-detectado">● Detectado</div>
                    <div class="estado-item active" id="ind-no-detectado">● No Detectado</div>
                </div>

                <p class="status-cam" id="status-cam" style="position:relative; margin-top:30px; z-index:3;">ESPERANDO CÁMARA...</p>
                
            </div>


            <div class="panel-info-registro">
                <div class="info-content">
                    <img src="img/rostro.png" alt="">
                    <h2>Captura de Rostro M.A.R.S.</h2>
                    <p>Nuestra tecnología utiliza redes neuronales para mapear 68 puntos faciales clave, garantizando que tu identidad sea única e intransferible en el sistema.</p>

                    <!-- Formulario de registro -->
                    <div id="form-registro" style="margin: 15px 0;">
                        <input type="text" id="input-nombre" pattern="[a-zA-Z0-9]+" maxlength="16" placeholder="Añadele una etiqueta a tu rostro"
                               style="padding: 8px; width: 100%; margin-bottom: 8px;">
                        <button class="btn-registrar" onclick="registrarRostro()">REGISTRAR ROSTRO</button>
                        <p id="msg-registro" style="margin-top: 8px;"></p>
                    </div>

                    <div class="detalles-sistema">
                        <h4>Sistema M.A.R.S.:</h4>
                        <p>El proceso de captura toma menos de 3 segundos y cifra los datos localmente para proteger tu privacidad.</p>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <section>
        
                    
                <?php include 'php/lista_personas.php';?>

               
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
                <p><strong>Sección:</strong> "A"</p>
                <p><strong>Semestre:</strong> 3</p>
            </div>
            <div class="footer-section">
                <h3>Integrantes del Grupo</h3>
                <ul class="lista-integrantes">
                    <?php include 'php/nombres.php';?>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 M.A.R.S. - Informatica</p>
            <img src="img/IUJO.gif" alt=""><br>
        </div>
    </footer>

    <script type="module" src="js/rostro.js"></script>
</body>
</html>