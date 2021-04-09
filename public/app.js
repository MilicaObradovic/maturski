
// promenljive
let camera, scene, renderer, container;
let orbitControl, dragControl, transformControl;

// const
const mouse = new THREE.Vector2();

// niz u koji dodajemo sve objekte
var objects = [];

// uzimamo id-jeve slika i smestamo u promenljive
var kuca = document.getElementById("kuca");
var drvo = document.getElementById("drvo");
var putic = document.getElementById("putic");

// EventListener-i za slike
kuca.addEventListener("click", loadKuca, false);
drvo.addEventListener("click", loadDrvo, false);
putic.addEventListener("click", loadPutic, false);

function loadKuca(){
    loadModel("kuca");
}
function loadDrvo(){
    loadModel("drvo");
}
function loadPutic(){
    loadModel("putic");
}

// funkcija za ucitavanje modela
function loadModel(naziv) {
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./'+naziv+'.mtl',
        (materials) => {
            materials.preload();

            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(
                './'+naziv+'.obj',
                (object) => {
                    object.scale.set(10, 10, 10);
                    object.position.y = -250;
                    scene.add(object);
                    objects.push(object);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.log('An error happened');
                }
            );
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.log('An error happened');
        }
    )
}


function init() {
    // dodavanje container-a
    container = document.createElement('div');
    document.body.appendChild(container);

    // dodavanje renderer-a
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.shadowMap.enabled = true;

    // podesavanje kamere
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(1000, 50, 1500);

    // podesavanje scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcce0ff);
    // dodavanje magle
    scene.fog = new THREE.Fog(0xcce0ff, 100, 10000);

    // podesavanje svetla
    const light = new THREE.AmbientLight(0x666666); // soft white light
    scene.add(light);

    // dodavanje OrbitControls (pomeranje kamere)
    orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.maxPolarAngle = Math.PI * 0.45;
    orbitControl.minDistance = 500;
    orbitControl.maxDistance = 5000;

    // dodavanje podloge
    const loader = new THREE.TextureLoader();
    const groundTexture = loader.load('./slike/grass.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });

    let ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
    ground.position.y = - 250;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // dodavanje DragControls (pomeranje modela po sceni)
    dragControl = new THREE.DragControls(objects, camera, renderer.domElement);
    dragControl.addEventListener('dragstart', function () { orbitControl.enabled = false; });
    dragControl.addEventListener('dragend', function () { orbitControl.enabled = true; });
    dragControl.addEventListener('drag', function (event) {

        event.object.position.y = 0;
    })

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    animate();

}

function animate() {

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
animate();