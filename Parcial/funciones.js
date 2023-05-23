//Escena, camara y render
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

//Parámetros del plano
let origin = new THREE.Vector3(0, 0, 0);
let x = new THREE.Vector3(1, 0, 0);
let y = new THREE.Vector3(0, 1, 0);
let z = new THREE.Vector3(0, 0, 1);

//Grilla
var gridHelperXZ = new THREE.GridHelper(700, 20, 0x333333, 0x333333);

//Plano
var arrowX = new THREE.ArrowHelper(x, origin, 40, 0xAA0000);
var arrowY = new THREE.ArrowHelper(y, origin, 40, 0x00AA00);
var arrowZ = new THREE.ArrowHelper(z, origin, 40, 0x0000AA);

//Posición cámara
camera.position.x = 300;
camera.position.y = 300;
camera.position.z = 300;
camera.lookAt(scene.position);
document.body.appendChild(renderer.domElement);

//Luz
const luz = new THREE.DirectionalLight(0xffffff, 1);
luz.position.set(-5, 10, 10);
luz.target.position.set(0, 0, 0);
luz.color.set(0xffa500);
luz.intensity = 1;

scene.add(gridHelperXZ);
scene.add(arrowX);
scene.add(arrowY);
scene.add(arrowZ);
scene.add(luz);


// Función del poligono
function poligono(nlados, lbase) {
  const vertices = [];
  const angulo = (2 * Math.PI) / nlados;
  for (let i = 0; i < nlados; i++) {
    const x = Math.cos(i * angulo) * lbase / 2;
    const y = Math.sin(i * angulo) * lbase / 2;
    vertices.push(new THREE.Vector3(x, y, 0));
  }
  return vertices;
}

// Función de la piramide
function generatePiramide(nlados, lbaseAbajo, lbaseArriba, h) {
  const arrayPira = [];
  const separacion = lbaseAbajo > lbaseArriba ? 2 * lbaseAbajo : 3 * lbaseArriba; // Definir separación entre pirámides
  for (let i = 0; i < 8; i++) {
    const piramide = createPiramide(nlados, lbaseAbajo, lbaseArriba, h, separacion, i);
    arrayPira.push(piramide);
    scene.add(piramide);
  }
}

// Función para crear una pirámide
function createPiramide(nlados, lbaseAbajo, lbaseArriba, h, separacion, i) {
  const piramide = new THREE.Group();
  const body = createPiramideCuerpo(nlados, lbaseAbajo, lbaseArriba, h);
  const baseInf = createBase(nlados, lbaseAbajo);
  const baseSup = createBase(nlados, lbaseArriba);
  piramide.add(body);
  piramide.add(baseInf);
  piramide.add(baseSup);
  piramide.position.x = (i % 4) * separacion;
  piramide.position.z = (i - 4) * h * - 0.5;
  return piramide;
}

// Función para crear el cuerpo de la pirámide
function createPiramideCuerpo(nlados, lbaseAbajo, lbaseArriba, h) {
  const color = new THREE.Color(Math.random(255), Math.random(255), Math.random(255));
  const apotemaAbajo = lbaseAbajo / (2 * Math.tan(Math.PI / nlados));
  const apotemaArriba = lbaseArriba;
  const radioAbajo = apotemaAbajo / Math.tan(Math.PI / nlados);
  const radioArriba = apotemaArriba / Math.tan(Math.PI / nlados);
  const alturaPiramide = h - apotemaArriba;
  const geometry = new THREE.CylinderGeometry(radioAbajo, radioArriba, alturaPiramide, nlados);
  const material = new THREE.MeshPhongMaterial({ color: color, flatShading: true });
  const body = new THREE.Mesh(geometry, material);
  body.position.y = (h - apotemaArriba) / 2;
  body.rotation.z = Math.PI;
  return body;
}

// Función para crear la base de la pirámide
function createBase(nlados, lbase) {
  const vertices = poligono(nlados, lbase);
  const color = new THREE.Color(Math.random(255), Math.random(255), Math.random(255));
  const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
  const material = new THREE.MeshPhongMaterial({ color: color, flatShading: true });
  const base = new THREE.Mesh(geometry, material);
  return base;
}

//Poner piramides
const piramides = generatePiramide(5, 40, 10, 40);
render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}