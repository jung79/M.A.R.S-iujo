import { obtenerRostros } from './rostro.js';

const faceapi = window.faceapi;

const webcam = document.getElementById('webcam');
const canvas = document.getElementById('overlay');

const toggleLandMarkButton = document.getElementById('toggleLandMark');
const landmarkStatus = document.getElementById('landmarkStatus');

const ctx = canvas.getContext('2d');//Obtener el contexto del canvas para dibujar las detecciones.

let width = webcam.clientWidth;//Obtener el ancho del video para ajustar el canvas.
let height = webcam.clientHeight;//Obtener el alto del video para ajustar el canvas.

let stream           = null;
let faceMatcher      = null;
let faceUmbral       = 0.6;
let showLedmarks     = false;
let modelosCargados  = false;
let detectionInterval = null;
let cameraCalibration = 500;
let camaraOn = false;

toggleLandMarkButton.addEventListener('click', () => {
  showLedmarks = !showLedmarks;
  landmarkStatus.textContent = showLedmarks ? 'Sí' : 'No';
});/*-----Accion de alternar la visualizacion de las marcas faciales-----*/


async function cargarModelos() {
  const MODEL_URL = './models';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  console.log("Modelos listos");
}/*-----Funcion para cargar los modelos de face-api.js-----*/


/*------------------------------------------/

Funcion para calcular la distancia de 
la persona a la camara utilizando la 
distancia entre los ojos y una formula 
de triangulacion simple.

/------------------------------------------*/

async function estimarDistancia() {

  if (!webcam.srcObject) {
    // Si la camara no esta activa, 
    // mostrar un mensaje en la consola 
    // y salir de la funcion

    console.log('Camera not active');
    return;
  }
  if (webcam.videoWidth === 0 || webcam.videoHeight === 0) {
    //  Si las dimesiones de la camara no estan disponibles,
    //  mostrar un mensaje en la consola y salir de la funcion.

    console.log('Video not ready');
    return;
  }

  try {
    //Intentar detectar el rostro y calcular la distancia.

    let width = webcam.clientWidth;//Obtener el ancho del video para ajustar el canvas.
    let height = webcam.clientHeight;//Obtener el alto del video para ajustar el canvas.

    if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    }

    const deteccion = await faceapi.detectAllFaces(webcam)
      .withFaceLandmarks()
      .withFaceDescriptors(); // Aca detectamos los rostros, landmarks y descriptores.

    if (deteccion && deteccion.length > 0) {

      const displaySize = { width, height };//Redimensionamos.
      const resized = faceapi.resizeResults(deteccion, displaySize);

      ctx.clearRect(0, 0, width, height);//Limpiamos el canvas.

      if (showLedmarks) {
        // Si estamos mostrando los landmarks, 
        // ajustar las detecciones al tamaño del canvas 
        // y dibujarlas.

        faceapi.draw.drawDetections(canvas, resized);//Dibujamos.
        faceapi.draw.drawFaceLandmarks(canvas, resized);
        }

      var bestMatch = [];

      resized.map(d => {

      var ultimoBox        = d.detection.box;

      //Si se detecta un rostro, proceder a calcular la distancia.
      const landmarks = d.landmarks;//Obtenemos los landmarks del rostro detectado.
      const ojoIzquierdo = landmarks.getLeftEye();//Obtenemos las coordenadas de los ojos izquierdo y derecho.
      const ojoDerecho = landmarks.getRightEye(); 

      //  Calculamos el centro de cada ojo.
      //  Para eso usaremos la funcion previamente 
      //  creada de calcular el centro de dos puntos.
      const centroIzquierdo = calcularCentro(ojoIzquierdo);
      const centroDerecho = calcularCentro(ojoDerecho);

      // Calculamos la distancia en píxeles entre los ojos.
      const distPixeles = Math.sqrt(
        Math.pow(centroDerecho.x - centroIzquierdo.x, 2) +
        Math.pow(centroDerecho.y - centroIzquierdo.y, 2)
      );

      // Estimación de distancia (Fórmula simplificada)
      // 'f' es un factor de calibración que depende de la cámara.
      const f = cameraCalibration; 
      const distanciaCm = (6.3 * f) / distPixeles;

      if (faceMatcher){
        bestMatch[bestMatch.length] = {
          label: faceMatcher.findBestMatch(d.descriptor)._label,
          distance: distanciaCm
        };
      } else {
        bestMatch[bestMatch.length] = {
          label: "unknown",
          distance: distanciaCm
        };
      }

        if (ultimoBox) {
          const label = bestMatch[bestMatch.length - 1].label || 'Rostro';
          ctx.font = '18px Arial';
          ctx.fillStyle = '#00FFFF';
          ctx.textBaseline = 'bottom';
          ctx.fillText(label + ":", ultimoBox.x + ultimoBox.width + 5, ultimoBox.y + 20);

          var _distanciaText = distanciaCm > 100 ? (distanciaCm/100).toFixed(2) + " m" : distanciaCm.toFixed(2) + " cm";

          ctx.fillText(_distanciaText, ultimoBox.x + ultimoBox.width + 5, ultimoBox.y + 40);  
        }

      }); 

      // Mostrar los resultados en la interfaz.
      document.getElementById('estado').textContent = 'Detectado';

      var humans = "";
      var myNumber = 0;
      var distances = "";

      bestMatch.forEach(element => {
        if (myNumber > 0) {
          humans += ",";
          distances += ",";
        }
        humans += element.label + " ";
        if(element.distance > 100){
        distances += (element.distance/100).toFixed(2) + "m ";
        } else {
        distances += element.distance.toFixed(2) + "cm ";
        }
        myNumber++;
      });

      if(humans.length > 40){
        humans = humans.substring(0, 37) + "...";
      }
      if(distances.length > 40){
        distances = distances.substring(0, 37) + "...";
      }

      document.getElementById('humans').textContent = humans;
      document.getElementById('distance').textContent = distances;

    }else{
      // Si no se detecta ningún rostro, 
      // mostrara un mensaje en la consola, 
      // limpiara el canvas y dejara la 
      // interfaz en un estado de stand-by.
      console.log('No se detectó ningún rostro');
      ctx.clearRect(0, 0, width, height);

      document.getElementById('distance').textContent = `Calculando...`;
      document.getElementById('estado').textContent = 'Esperando...';
      document.getElementById('humans').textContent = 'Buscando...';
    }

  } catch (e) {
    console.error('Error en detección:', e);// Si ocurre un error durante la detección, lo mostrará en la consola.
  }
}

/*------------------------------------------/

Funcion para calcular el centro de un conjunto 
de puntos (en este caso, los landmarks de los ojos).

------------------------------------------*/

function calcularCentro(puntos) {
  const x = puntos.reduce((s, p) => s + p.x, 0) / puntos.length;
  const y = puntos.reduce((s, p) => s + p.y, 0) / puntos.length;
  return { x, y };
}


/*------------------------------------------/

Funcion para iniciar el bucle de detección 
que cada cierto tiempo intentará detectar un rostro y
calcular la distancia.

configurada a 15ms por defecto para una detección fluida.

------------------------------------------*/

let refreshFrecuency = 15; // Frecuencia de actualización en ms

async function iniciarDeteccion(){
  if (!modelosCargados) {
    await cargarModelos();
  }

  document.getElementById('distance').textContent = `Cargando...`;
  document.getElementById('estado').textContent = 'Cargando...';
  document.getElementById('humans').textContent = 'Cargando...';

    //  ajustar el canvas al tamaño del video.
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

  procesarLoop(); // Iniciar el bucle de procesamiento.

  }

async function init() {
  await cargarModelos();
  await iniciarCamara();
  faceMatcher = await obtenerRostros(faceUmbral);
  modelosCargados = true;
  if (!detectionInterval && webcam.readyState >= 2) {
    iniciarDeteccion();
  }
}

init(); // Iniciamos todo en orden.

async function procesarLoop() {
    await estimarDistancia(); // Ejecuta la lógica
    if(camaraOn)
    requestAnimationFrame(procesarLoop); // Se llama a sí mismo en el próximo frame disponible
}

async function iniciarCamara() {
    if (camaraOn) return;

    try {
        // Intentar acceder a la camara y 
        // configurar el video y los 
        // bucles de deteccion y dibujo.
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcam.srcObject = stream;
        camaraOn = true;
        document.querySelector('.btnOn').classList.add('btnPush');
        document.querySelector('.btnOff').classList.remove('btnPush');

        webcam.onloadedmetadata = () => {
            canvas.width  = webcam.videoWidth;
            canvas.height = webcam.videoHeight;
            iniciarDeteccion();
        };
    } catch (e) {
        console.log('ERROR: ' + e.message);
    }
}

/*------------------------------------------/
Función para apagar la cámara.
/------------------------------------------*/
function apagarCamara() {
    if (!camaraOn) return;
    stream.getTracks().forEach(t => t.stop());
    webcam.srcObject  = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    camaraOn = false;
    document.querySelector('.btnOn').classList.remove('btnPush');
    document.querySelector('.btnOff').classList.add('btnPush');
    document.getElementById('distance').textContent = `Esperando camara...`;
    document.getElementById('estado').textContent = 'Esperando camara...';
    document.getElementById('humans').textContent = 'Esperando camara...';
}

window.iniciarCamara = iniciarCamara;
window.apagarCamara = apagarCamara;