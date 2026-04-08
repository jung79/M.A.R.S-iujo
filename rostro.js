// rostro.js — Registro de rostro M.A.R.S.

let stream           = null;
let camaraOn         = false;
let cargado          = false;
let descriptorActual = null;
let ultimoBox        = null;
let personasDB       = []; // personas registradas para validar duplicados

const UMBRAL_DUPLICADO = 0.45; // menor = más estricto (misma persona)

const video  = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

// -----------------------------------------------
// Encender cámara
// -----------------------------------------------
async function iniciarCamara() {
    if (camaraOn) return;
    setStatus('Cargando modelos...');

    if (!cargado) {
        const url = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
        await faceapi.nets.tinyFaceDetector.loadFromUri(url);
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri(url);
        await faceapi.nets.faceRecognitionNet.loadFromUri(url);
        cargado = true;
    }

    // Cargar personas ya registradas para poder detectar duplicados
    await cargarPersonas();

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        camaraOn = true;
        setStatus('CÁMARA ACTIVA');

        video.onloadedmetadata = () => {
            canvas.width  = video.videoWidth;
            canvas.height = video.videoHeight;
            dibujarBucle();
            deteccionBucle();
        };
    } catch (e) {
        setStatus('ERROR: ' + e.message);
    }
}

// -----------------------------------------------
// Apagar cámara
// -----------------------------------------------
function apagarCamara() {
    if (!camaraOn) return;
    stream.getTracks().forEach(t => t.stop());
    video.srcObject  = null;
    camaraOn         = false;
    descriptorActual = null;
    ultimoBox        = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStatus('ESPERANDO CÁMARA...');
    setDetectado(false);
}

// -----------------------------------------------
// Cargar personas desde PHP
// -----------------------------------------------
async function cargarPersonas() {
    try {
        const res  = await fetch('personas.php');
        const data = JSON.parse(await res.text());
        if (data.ok) personasDB = data.personas;
    } catch (e) {
        console.error('Error cargando personas:', e);
    }
}

// -----------------------------------------------
// Bucle de DIBUJO — fluido con requestAnimationFrame
// -----------------------------------------------
function dibujarBucle() {
    if (!camaraOn) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (ultimoBox) {
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth   = 2;
        ctx.strokeRect(ultimoBox.x, ultimoBox.y, ultimoBox.width, ultimoBox.height);
    }

    requestAnimationFrame(dibujarBucle);
}

// -----------------------------------------------
// Bucle de DETECCIÓN — cada 800ms
// -----------------------------------------------
async function deteccionBucle() {
    if (!camaraOn) return;

    const resultado = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true)
        .withFaceDescriptor();

    if (resultado) {
        descriptorActual = resultado.descriptor;
        ultimoBox        = resultado.detection.box;
        setDetectado(true);
        setStatus('DETECTADO');
    } else {
        descriptorActual = null;
        ultimoBox        = null;
        setDetectado(false);
        setStatus('BUSCANDO');
    }

    setTimeout(deteccionBucle, 800);
}

// -----------------------------------------------
// VALIDACIONES
// -----------------------------------------------

// 1. Solo letras y espacios, mínimo 3 caracteres
function validarNombre(nombre) {
    if (nombre.length < 3) {
        mostrarMensaje('El nombre debe tener al menos 3 caracteres.', 'red');
        return false;
    }
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!soloLetras.test(nombre)) {
        mostrarMensaje('El nombre solo puede contener letras y espacios.', 'red');
        return false;
    }
    return true;
}

// 2. Verificar si el rostro ya está registrado
function esDuplicado(descriptor) {
    for (const p of personasDB) {
        const dist = faceapi.euclideanDistance(descriptor, new Float32Array(p.descriptor));
        if (dist <= UMBRAL_DUPLICADO) {
            return p.nombre; // devuelve el nombre con quien coincide
        }
    }
    return null;
}

// -----------------------------------------------
// Registrar rostro
// -----------------------------------------------
async function registrarRostro() {
    const nombre = document.getElementById('input-nombre').value.trim();

    // Validar que haya rostro detectado
    if (!descriptorActual) {
        mostrarMensaje('No se detecta rostro. Colócate frente a la cámara.', 'red');
        return;
    }

    // Validar nombre
    if (!validarNombre(nombre)) return;

    // Validar que el rostro no esté ya registrado
    const yaRegistrado = esDuplicado(descriptorActual);
    if (yaRegistrado) {
        mostrarMensaje('Este rostro ya está registrado como: ' + yaRegistrado, 'orange');
        return;
    }

    mostrarMensaje('Registrando...', 'cyan');

    try {
        const res  = await fetch('registrar.php', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                nombre:     nombre,
                descriptor: Array.from(descriptorActual)
            })
        });
        const data = JSON.parse(await res.text());

        if (data.ok) {
            mostrarMensaje('✔ ' + data.nombre + ' registrado correctamente.', 'lime');
            document.getElementById('input-nombre').value = '';
            await cargarPersonas(); // actualizar lista para futuras validaciones
        } else {
            mostrarMensaje('Error: ' + data.error, 'red');
        }
    } catch (e) {
        mostrarMensaje('Error de conexión: ' + e.message, 'red');
    }
}

// -----------------------------------------------
// Utilidades
// -----------------------------------------------
function setStatus(txt) {
    document.getElementById('status-cam').textContent = txt;
}

function setDetectado(detectado) {
    document.getElementById('ind-detectado').classList.toggle('active', detectado);
    document.getElementById('ind-no-detectado').classList.toggle('active', !detectado);
}

function mostrarMensaje(txt, color) {
    const el       = document.getElementById('msg-registro');
    el.textContent = txt;
    el.style.color = color;
}