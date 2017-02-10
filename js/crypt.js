var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;


//aca levanto lo que entra
var data = document.getElementById('input').value;


//------------------------PRIMERA PARTE
//Drawing multiple objects using a single draw call

var geo = new THREE.Geometry();
for (var i=0; i<objects.length; i++) {
  // bundle the objects into a single geometry
  // so that they can be drawn with a single draw call
  addObjectToGeometry(geo, objects[i]);
}
// GOOD! Only one object to add to the scene!
scene.add(new THREE.Mesh(geo, material));
renderer.render(scene, camera);


//------------------------SEGUNDA PARTE
//Setting up the geometry and textures

var fontSize = 16;

// The square letter texture will have 16 * 16 = 256 letters, enough for all 8-bit characters.
var lettersPerSide = 16;

var c = document.createElement('canvas');
c.width = c.height = fontSize*lettersPerSide;
var ctx = c.getContext('2d');
ctx.font = fontSize+'px Monospace';

// This is a magic number for aligning the letters on rows. YMMV.
var yOffset = -0.25;

// Draw all the letters to the canvas.
for (var i=0,y=0; y<lettersPerSide; y++) {
  for (var x=0; x<lettersPerSide; x++,i++) {
    var ch = String.fromCharCode(i);
    ctx.fillText(ch, x*fontSize, yOffset*fontSize+(y+1)*fontSize);
  }
}

// Create a texture from the letter canvas.
var tex = new THREE.Texture(c);
// Tell Three.js not to flip the texture.
tex.flipY = false;
// And tell Three.js that it needs to update the texture.
tex.needsUpdate = true;


//--------------------------------

var geo = new THREE.Geometry();

var i=0, x=0, line=0;
for (i=0; i lettersPerSide * lettersPerSide) {
    code = 0; // Clamp character codes to letter map size.
  }
  var cx = code % lettersPerSide; // Cx is the x-index of the letter in the map.
  var cy = Math.floor(code / lettersPerSide); // Cy is the y-index of the letter in the map.

  // Add letter vertices to the geometry.
  var v,t;
  geo.vertices.push(
    new THREE.Vector3( x*1.1+0.05, line*1.1+0.05, 0 ),
    new THREE.Vector3( x*1.1+1.05, line*1.1+0.05, 0 ),
    new THREE.Vector3( x*1.1+1.05, line*1.1+1.05, 0 ),
    new THREE.Vector3( x*1.1+0.05, line*1.1+1.05, 0 )
  );
  // Create faces for the letter.
  var face = new THREE.Face3(i*4+0, i*4+1, i*4+2);
  geo.faces.push(face);
  face = new THREE.Face3(i*4+0, i*4+2, i*4+3);
  geo.faces.push(face);

  // Compute texture coordinates for the letters.
  var tx = cx/lettersPerSide, 
      ty = cy/lettersPerSide,
      off = 1/lettersPerSide;
  var sz = lettersPerSide*fontSize;
  geo.faceVertexUvs[0].push([
    new THREE.Vector2( tx, ty+off ),
    new THREE.Vector2( tx+off, ty+off ),
    new THREE.Vector2( tx+off, ty )
  ]);
  geo.faceVertexUvs[0].push([
    new THREE.Vector2( tx, ty+off ),
    new THREE.Vector2( tx+off, ty ),
    new THREE.Vector2( tx, ty )
  ]);

  // On newline, move to the line below and move the cursor to the start of the line.
  // Otherwise move the cursor to the right.
  if (code == 10) {
    line--;
    x=0;
  } else {
    x++;
  }
}

//-----------------------------------