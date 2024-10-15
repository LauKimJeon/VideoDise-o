let videoInicial = document.getElementById('videoInicial');
let videoFinal = document.getElementById('videoFinal');
let canvas3D = document.getElementById('canvas3D');
let scene, camera, renderer, model, controls;
let userInteracted = false;
let interactionTimeout;

// Función para cargar y mostrar el modelo 3D
function init3DModel() {
  // Inicializar la escena
  scene = new THREE.Scene();
  
  // Inicializar la cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 5); // Ajusta la posición de la cámara

  // Inicializar el renderizador
  renderer = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Añadir controles de órbita (OrbitControls)
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Suaviza el movimiento
  controls.dampingFactor = 0.05; // Factor de amortiguación
  controls.enableZoom = true; // Permite hacer zoom
  controls.enablePan = true; // Permite desplazar el modelo
  controls.enableRotate = true; // Permite rotar el modelo

  // Añadir luz a la escena
  const light = new THREE.AmbientLight(0xffffff, 1); // Luz blanca
  scene.add(light);

  // Cargar el modelo 3D (ruta al modelo en la carpeta /models)
  const loader = new THREE.GLTFLoader();
  loader.load(
    'models/Perfume1.glb',
    function(gltf) {
      model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5); // Ajusta la escala si es necesario
      scene.add(model);
      model.position.y = -2.5; // Asegúrate de que el modelo esté en la vista
      animate();
    },
    undefined, // Progreso (opcional)
    function (error) { // Error al cargar el modelo
      console.error('Error al cargar el modelo:', error);
    }
  );

  // Detectar interacción del usuario
  canvas3D.addEventListener('touchstart', userInteractedWith3D);
  canvas3D.addEventListener('mousemove', userInteractedWith3D);

  // Función para animar el modelo
  function animate() {
    requestAnimationFrame(animate);
    
    // Si el modelo se cargó correctamente
    if (model) {
      // Si el usuario no ha interactuado, el modelo rota automáticamente
      if (!userInteracted) {
        model.rotation.y += 0.01; // Rotación automática
      }
    }
    
    controls.update(); // Actualiza los controles de órbita en cada frame
    renderer.render(scene, camera); // Renderiza la escena
  }
}

// Función que maneja la interacción del usuario
function userInteractedWith3D() {
  clearTimeout(interactionTimeout); // Reinicia el temporizador si el usuario sigue interactuando
  userInteracted = true;
  interactionTimeout = setTimeout(playFinalVideo, 2000); // Inicia el temporizador de 2 segundos sin interacción
}

// Función que inicia el video final
function playFinalVideo() {
  canvas3D.style.display = 'none'; // Oculta el modelo 3D
  videoFinal.style.display = 'block'; // Muestra el video final
  videoFinal.play();
}

// Al tocar el video inicial, se muestra el modelo 3D
videoInicial.addEventListener('click', function() {
  videoInicial.style.display = 'none'; // Oculta el video inicial
  canvas3D.style.display = 'block'; // Muestra el canvas del modelo 3D
  init3DModel(); // Inicializa el modelo 3D
});
