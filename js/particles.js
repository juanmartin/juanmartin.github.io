var container;
const loader = new THREE.FontLoader();
var camera, scene, renderer, group, textMesh;
const fontName = '../fonts/Courier New_Regular.json';

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

THREE.Cache.enabled = true;

init();
animate();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('input').focus();
});
document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('input').style.display = 'none';
    document.getElementById('enterButton').style.display = 'none';
    const message = document.getElementById('input').value;
    const rand = () => Math.random() * 2 - 1;
    const randVector = () => new THREE.Vector3(rand(), rand(), rand());
    const eye = randVector();
    const center = new THREE.Vector3();
    const up = randVector();
    const rotationMatrix = new THREE.Matrix4().lookAt(eye, center, up);

    loader.load(fontName, function (font) {
        message.split('').forEach(function (char, i) {
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide
            });
            const textGeo = new THREE.TextGeometry(char, {
                font: font,
                size: 30,
                height: 6
            });
            const textMesh = new THREE.Mesh(textGeo, material);
            const lineVector = new THREE.Vector3(i * 50, 0, 0);
            const positionVector = lineVector.applyMatrix4(rotationMatrix);
            textMesh.position.x = positionVector.x;
            textMesh.position.y = positionVector.y;
            textMesh.position.z = positionVector.z;
            // textMesh.position.y = Math.random() * 2000 - 1000;
            // textMesh.position.z = Math.random() * 2000 - 1000;
            // textMesh.rotation.x = Math.random() * PI2;
            // textMesh.rotation.y = Math.random() * PI2;
            // textMesh.rotation.z = Math.random() * PI2;
            group.add(textMesh);
        });
    });
}, false);

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();

    var PI2 = Math.PI * 2;
    var program = function ( context ) {

        context.beginPath();
        context.arc( 0, 0, 0.5, 0, PI2, true );
        context.fill();

    };

    group = new THREE.Group();
    scene.add( group );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.zoomSpeed = 5.0;
    controls.enablePan = false;
    controls.maxDistance = 1500;

    window.addEventListener( 'resize', onWindowResize, false );

    loader.load(fontName, function (font) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (var i = 0; i < 0; i++) {
            const char = charset.charAt(Math.floor(Math.random() * charset.length));
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() * 0x808008 + 0x808080,
                side: THREE.DoubleSide
            });
            const textGeo = new THREE.TextGeometry(char, {
                font: font,
                size: Math.random() * 50 + 20,
                height: 6
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

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();
}

function render() {

    // camera.position.x += ( mouseX - camera.position.x ) * 0.0005;
    // camera.position.y += ( - mouseY - camera.position.y ) * 0.0005;
    camera.lookAt( scene.position );

    // group.rotation.x += 0.0001;
    // group.rotation.y += 0.0002;

    renderer.render( scene, camera );
}


