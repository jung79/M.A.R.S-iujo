const faceapi = window.faceapi;

let video, canvas, ctx;

function initDOM() {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDOM);
} else {
  initDOM();
}

/*------------------------------------------/
Variables globales y elementos del DOM
/------------------------------------------*/

let stream           = null;
let camaraOn         = false;
let cargado          = false;
let descriptorActual = null;
let ultimoBox        = null;
let myFace           = 'unknown';
let faceMatcher      = null;
let faceUmbral       = 0.6;

/*------------------------------------------/
Funcion para iniciar la camara, cargar los modelos y comenzar los bucles de deteccion y dibujo.
/------------------------------------------*/
async function iniciarCamara() {
    if (camaraOn) return;
    setStatus('Cargando modelos...');

    if (!cargado) {
        // Cargar los modelos para que 
        // face-api funcione correctamente.
        const url = './models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(url);
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri(url);
        await faceapi.nets.faceRecognitionNet.loadFromUri(url);
        cargado = true;
    }

    try {
        // Intentar acceder a la camara y 
        // configurar el video y los 
        // bucles de deteccion y dibujo.
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

/*------------------------------------------/
Función para apagar la cámara.
/------------------------------------------*/
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


/*------------------------------------------/
Bucle de dibujo para dibujar el cuadro del rostro detectado en el canvas.
/------------------------------------------*/

function dibujarBucle() {
    if (!camaraOn) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Dibujar cuadro del último rostro detectado
    if (ultimoBox) {
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth   = 2;
        ctx.strokeRect(ultimoBox.x, ultimoBox.y, ultimoBox.width, ultimoBox.height);
    }

    requestAnimationFrame(dibujarBucle);
}


/*------------------------------------------/
Función para iniciar el bucle de detección de rostros.
/------------------------------------------*/

async function deteccionBucle() {
    if (!camaraOn) return;

    // Detectar rostro utilizando face-api.js 
    // y actualizar el estado de la aplicación en consecuencia.
    const resultado = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true)
        .withFaceDescriptor();

    if (resultado) {
        //Si se detecto un rostros
        //se actualizan las variables globales.

         if (faceMatcher && typeof faceMatcher.findBestMatch === 'function') {
            //Si hay rostros que comparar, se hace la comparacion.
            const recognitions = faceMatcher.findBestMatch(resultado.descriptor);
            myFace = recognitions._label;
         }

        descriptorActual = resultado.descriptor;
        ultimoBox        = resultado.detection.box;
        setDetectado(true);
        if(myFace === 'unknown'){
            // Si no se reconoce el rostro, 
            // se muestra un mensaje indicando que el 
            // rostro esta listo para ser registrado.
        setStatus('ROSTRO DETECTADO — LISTO PARA REGISTRAR');
        }else{
            // Si se reconoce el rostro, 
            // se muestra un mensaje indicando 
            // el nombre del rostro detectado.
        setStatus('ROSTRO DETECTADO: ' + myFace);
        }
    } else {
        // Si no se detecta ningún rostro,
        // se reinician las variables y se actualiza el estado.
        myFace           = 'unknown';
        descriptorActual = null;
        ultimoBox        = null;
        setDetectado(false);
        setStatus('BUSCANDO ROSTRO...');
    }

    setTimeout(deteccionBucle, 800);
}

// -----------------------------------------------|
// Registrar rostro
// -----------------------------------------------|
async function registrarRostro() {
    const nombre = document.getElementById('input-nombre').value.trim();

    if (!nombre) {
        // Si el nombre esta vacio, 
        // mostrar un mensaje y salir de la funcion.
        mostrarMensaje('Escribe tu nombre completo.', 'red');
        return;
    }
    if (!descriptorActual) {
        // Si no se detecta rostro, 
        // mostrar un mensaje y salir de la funcion.
        mostrarMensaje('No se detecta rostro. Colócate frente a la cámara.', 'red');
        return;
    }
    if (myFace !== 'unknown') {
        // Si el rostro ya esta registrado,
        // mostrar un mensaje indicando el nombre del rostro detectado.
        mostrarMensaje('Este rostro ya está registrado como: ' + myFace, 'orange');
        return;
    }

    mostrarMensaje('Registrando...', 'cyan');

    try {
        // Enviar el descriptor del rostro al servidor para su registro. 
        const res  = await fetch('./php/registrar.php', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                nombre:     nombre,
                descriptor: Array.from(descriptorActual)
                // Se envia el descriptor como un array 
                // y el nombre del usuario.
            })
        });
        const data = JSON.parse(await res.text());

        if (data.ok) {
            // Si el registro es exitoso, 
            // se muestra un mensaje de éxito 
            // y se limpia el campo de texto.
            mostrarMensaje('✔ ' + data.nombre + ' registrado correctamente.', 'lime');
            document.getElementById('input-nombre').value = '';
            // Se actualiza el faceMatcher para incluir el nuevo rostro registrado.
            faceMatcher = await obtenerRostros(faceUmbral);
        } else {
            //Si el registro falla, 
            // se muestra un mensaje de error 
            // con la información proporcionada 
            // por el servidor.
            mostrarMensaje('Error: ' + data.error, 'red');
        }
    } catch (e) {
        //Si hay un error de conexión o 
        // cualquier otro error durante 
        // el proceso de registro, se 
        // muestra un mensaje de error 
        // con la información pertinente.
        
        mostrarMensaje('Error de conexión: ' + e.message, 'red');
    }
}

// -----------------------------------------------
// Utilidades
// -----------------------------------------------
function setStatus(txt) {
    // Función para actualizar el 
    // estado de la aplicación en 
    // la interfaz.
    const statusEl = document.getElementById('status-cam');
    if (statusEl) {
        statusEl.textContent = txt;
    }
}

function setDetectado(detectado) {
    // Función para actualizar los indicadores de detección
    // en la interfaz, mostrando si se ha detectado un rostro o no.
    document.getElementById('ind-detectado').classList.toggle('active', detectado);
    document.getElementById('ind-no-detectado').classList.toggle('active', !detectado);
}

function mostrarMensaje(txt, color) {
    // Función para mostrar mensajes de estado o error 
    // relacionado con la etiqueta del rostro,
    // con un color específico para diferenciar 
    // entre tipos de mensajes.
    const el = document.getElementById('msg-registro');
    if (el) {
        el.textContent = txt;
        el.style.color = color;
    } else {
        console.log(txt);
    }
}

export async function obtenerRostros(fU){
// Función para obtener los rostros registrados 
// en el servidor y configurar el faceMatcher 
// para el reconocimiento facial.

     try {
        // Intentar enviar una solicitud al servidor para obtener 
        // los rostros registrados y configurar el faceMatcher 
        // con los datos recibidos.

        const res  = await fetch('./php/personas.php', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' }/*,
            body:    JSON.stringify({
                nombre:     nombre,
                descriptor: Array.from(descriptorActual)
            })*/
        });
        const data = JSON.parse(await res.text());

        if (data.ok) {
            // Si la solicitud es exitosa, se obtiene la lista de personas
            // y sus descriptores, se crean los LabeledFaceDescriptors 
            // para cada persona y se configura el faceMatcher con estos datos.
            
            if (data.personas.length > 0) {
            var labeledFaceDescriptors = data.personas.map(user => {
                // Para cada persona recibida del servidor, 
                // se crea un LabeledFaceDescriptor
                const desc = new Float32Array(user.descriptor);

                var faceDescriptor = new faceapi.LabeledFaceDescriptors(user.nombre, [desc]);

                return faceDescriptor;
                });

            // Se configura el faceMatcher con los LabeledFaceDescriptors
            // y un umbral de similitud de 0.4 (se cambiar la variable "faceUmbral")
            //  para el reconocimiento facial.

            var fM = new faceapi.FaceMatcher(labeledFaceDescriptors, fU);

            console.log('Rostros obtenidos y faceMatcher configurado:');
            console.log(fM);

            return fM;
            }else{
                // Si no hay personas registradas, 
                // se muestra un mensaje indicando que 
                // no se han encontrado rostros.
                console.log('No se han encontrado rostros registrados en el servidor.');
                return null;
            }

        } else {
            // Para cualquier error, se mostrara el mensaje
            mostrarMensaje('Error: ' + data.error, 'red');
        }
    } catch (e) {
        // Si hay un error de conexión o cualquier otro error durante 
        // el proceso de obtención de rostros, se muestra un 
        // mensaje de error con la información pertinente.
        mostrarMensaje('Error de conexión: ' + e.message, 'red');
    }

}

async function initRostro() {
    if (!document.getElementById('status-cam')) return;
    iniciarCamara();
    faceMatcher = await obtenerRostros(faceUmbral);
}

initRostro();

// Exponer funciones necesarias al DOM cuando se carga como módulo.
window.registrarRostro = registrarRostro;
window.iniciarCamara = iniciarCamara;
window.apagarCamara = apagarCamara;

