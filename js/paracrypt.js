var container;
const loader = new THREE.FontLoader();
var camera, scene, renderer, group, textMesh, controls;
const fontName = '../fonts/Courier New_Regular.json';

//char properties
const maxSize = 80;
const minSize = 20;
const ancho = 10;
const tracking = 100; // letter spacing

const cantLetras = 500;
const PI2 = Math.PI * 2;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

THREE.Cache.enabled = true;

init();
animate();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('input').focus(); //focus al form para escribir ni bien carga
});
document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('input').style.display = 'none'; //desaparecer
    document.getElementById('enterButton').style.display = 'none'; //el form al entrar un mensaje

    // Randomize existing positions
    scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.position.x = Math.random() * 2000 - 1000;
            node.position.y = Math.random() * 2000 - 1000;
            node.position.z = Math.random() * 2000 - 1000;
            node.rotation.x = Math.random() * PI2;
            node.rotation.y = Math.random() * PI2;
            node.rotation.z = Math.random() * PI2;
        }
    });

    const message = document.getElementById('input').value; //captura el msj
    const rand = () => Math.random() * 2 - 1; //random de -1 a 1
    const randVector = () => new THREE.Vector3(rand(), rand(), rand());
    //para construir la matriz de rotacion
    const eye = randVector();
    //const center = new THREE.Vector3();
    const center = randVector();
    const up = randVector();


    const rotationMatrix = new THREE.Matrix4().lookAt(eye, center, up);

    //HIDDEN MESSAGE
    loader.load(fontName, function (font) {
        message.split('').forEach(function (char, i) {
            const depthDistance = Math.random() * 500;
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() * 0x808008 + 0x808080,
                side: THREE.DoubleSide
            });
            const textGeo = new THREE.TextGeometry(char, {
                font: font,
//                size: Math.random() * maxSize + minSize,
                size: 30,
                height: ancho
            });
            const textMesh = new THREE.Mesh(textGeo, material);
            const lineVector = new THREE.Vector3(i * tracking + 1, 0, depthDistance); //linea de escritura en x --  *letter spacing
            const positionVector = lineVector.applyMatrix4(rotationMatrix); //torcer linea de escritura segun la matriz

            //POSICION
            textMesh.position.x = positionVector.x;
            textMesh.position.y = positionVector.y;
            textMesh.position.z = positionVector.z;
            //ROTACION
            textMesh.quaternion.setFromRotationMatrix(rotationMatrix);



            group.add(textMesh);
        });
    });
}, false);

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

//    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();

    var program = function (context) {

        context.beginPath();
        context.arc(0, 0, 0.5, 0, PI2, true);
        context.fill();

    };

    group = new THREE.Group();
    scene.add(group);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    //CONTROLES DE CAMARA
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.noPan = false;
    controls.minDistance = 0;
    controls.maxDistance = Infinity;
    controls.addEventListener('change', render);

    window.addEventListener('resize', onWindowResize, false);

    //LETTER GALAXY
    loader.load(fontName, function (font) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (var i = 0; i < cantLetras; i++) {
            const char = charset.charAt(Math.floor(Math.random() * charset.length));
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() * 0x808008 + 0x808080,
                side: THREE.DoubleSide
            });
            const textGeo = new THREE.TextGeometry(char, {
                font: font,
                size: Math.random() * maxSize + minSize,
                height: ancho
            });
            const textMesh = new THREE.Mesh(textGeo, material);
            textMesh.position.x = Math.random() * 2000 - 1000;
            textMesh.position.y = Math.random() * 2000 - 1000;
            textMesh.position.z = Math.random() * 2000 - 1000;
            textMesh.rotation.x = Math.random() * PI2;
            textMesh.rotation.y = Math.random() * PI2;
            textMesh.rotation.z = Math.random() * PI2;
            group.add(textMesh);
        }
    });

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    //update de camara controls
    var clock = new THREE.Clock();
    var delta = clock.getDelta();
    controls.update(delta);

    render();
}

function render() {

    // camera.position.x += ( mouseX - camera.position.x ) * 0.0005;
    // camera.position.y += ( - mouseY - camera.position.y ) * 0.0005;
    //camera.lookAt(scene.position);

    // group.rotation.x += 0.0001;
    // group.rotation.y += 0.0002;

    renderer.render(scene, camera);
}
