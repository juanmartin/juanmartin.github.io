var textMesh, textGeo, helper;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(0, 0, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const scene = new THREE.Scene();

const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.zoomSpeed = 5.0;
controls.enablePan = false;

const loader = new THREE.FontLoader();
loader.load('../fonts/Comic_Sans_MS_Regular.json', onFontLoaded);

function onFontLoaded (font) {
    textGeo = new THREE.TextGeometry('AABB = :(', {
        font: font,
        size: 9.0,
        height: 0.5
    });
    textMesh = new THREE.Mesh(textGeo, material);
    // Need geometry bounding box to calculate rotation axis center
    textGeo.computeBoundingBox();
    const offset = (axis) => -0.5 * (textGeo.boundingBox.max[axis] - textGeo.boundingBox.min[axis]);
    // Use same rotation axis for rotation animation
    textGeo.applyMatrix(new THREE.Matrix4().makeTranslation(offset('x'), offset('y'), offset('z')));
    textMesh.position.x = 0;
    textMesh.position.y = 0;
    textMesh.position.z = 0;
    scene.add(textMesh);
    helper = new THREE.BoundingBoxHelper(textMesh, 0xff0000);
    scene.add(helper);
    animate();
}

function animate () {
    requestAnimationFrame(animate);
    textMesh.rotation.z -= 0.01;
    helper.update();
    render();
}

function render () {
    renderer.render(scene, camera);
}
