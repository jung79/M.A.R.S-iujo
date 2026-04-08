<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M.A.R.S.</title>
    <link rel="stylesheet" href="style.css">

    <link rel="stylesheet" href="css/estilo.css">
</head>
<body>


<?php include 'php/navegador.php';?>
    <section class="hero-section" id="inicio">
        <div class="hero-container">

            <div class="hero-content">
                <h1 class="hero-title">Sistema M.A.R.S.</h1>
                <p class="hero-description">
                    <strong>M.A.R.S.</strong> es un sistema futurista de alta tecnología de 
                <strong>Monitoreo y Análisis de Reconocimiento Sensorial</strong>. 
                Nuestra plataforma utiliza visión computacional avanzada para rastrear la presencia, 
                identificar rostros y medir métricas de atención en tiempo real con precisión milimétrica.
                </p>
                <div class="hero-buttons">
                    <a href="movimiento.php" class="btn btn-primary">Iniciar Monitoreo</a>
                    <a href="rostro.php" class="btn btn-secondary">Registra tu Rostro</a>
                </div>
            </div>

            <div class="hero-visual">
                <div class="visual-background-wrapper">
                    <img src="img/fondo.png" alt="Fondo Tecnológico" class="visual-background">
                </div>
                <img src="img/humano.png" alt="Robot M.A.R.S." class="visual-robot">
            </div>

        </div>
    </section>


<section class="services-section" id="servicios">
    <div class="container">
        <h2 class="section-title">Nuestros Servicios M.A.R.S.</h2>
        
        <div class="cards-row">
            
            <div class="service-card">
                <div class="image-container">
                    <img src="img/rostro.png" alt="Monitoreo de Presencia" class="service-img">
                </div>
                <h3 >Biometría</h3>
                <p>Identificación precisa de rasgos faciales y expresiones mediante redes neuronales de última generación.</p>
            </div>

            <div class="service-card">
                <div class="image-container">
                    <img src="img/movimiento.png" alt="Validación de Identidad" class="service-img">
                </div>
                <h3>Telemetría</h3>
                <p>Cálculo de distancia física entre el usuario y la cámara basado en proporciones oculares constantes.</p>
            </div>

            <div class="service-card">
                <div class="image-container">
                    <img src="img/logo.png" alt="Seguridad Garantizada" class="service-img">
                </div>
               <h3>Seguridad</h3>
                <p>Protocolo diseñado para el monitoreo de presencia y validación de identidad en entornos controlados.</p>
            </div>

        </div>
    </div>
</section>

<footer class="footer-mars" id="pie">
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

</body>
</html>