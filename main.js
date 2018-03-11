


var renderer, container, camera, scene, material, mesh, cube;
var shape;

var shapesArr = [];
var cube1;
var shape1;
var a, b, c;

var width = window.innerWidth;
var height = window.innerHeight;

var uniforms = {
  time : {type: "f", value: 1.0},
  size : {type: "v2", value: new THREE.Vector2(width, height)}
};
var paused = false;
var date = new Date().getTime();


window.addEventListener('load', init);

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, width / height, 10, 1000);
  camera.position.z = 100;

  scene.add(camera);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width, height);
  renderer.setClearColor(0xffffff);

  container = renderer.domElement;
  document.body.appendChild(container);


  material = new THREE.MeshNormalMaterial({
    shading: THREE.FlatShading
  });

  var geometry = new THREE.IcosahedronGeometry(40, 3);
  mesh = new THREE.Mesh(geometry, material);

     $.get("small-data.csv")
         .pipe(CSV.parse)
         .done(function(rows) {
            for( var i =1; i < rows.length -6; i++){
              a = rows[i][0];
              b = rows[i][1];
              c = rows[i][2];
              console.log(a,b,c)
              shape = new THREE.Mesh(
                new THREE.SphereGeometry( a, b, c ),
                new THREE.ShaderMaterial({
                  uniforms: uniforms,
                  vertexShader: document.getElementById('vertex' + i).textContent,
                  fragmentShader: document.getElementById('fragment'+ i).textContent
                }));
              shapesArr.push(shape);
           }
           for(var j = 0; j < shapesArr.length; j++) {
             console.log(shapesArr[j])
             scene.add(shapesArr[j]);
           }
      });
  render();
}


function render(t) {
  if(!paused) {
      last = t;
      uniforms.time.value +=0.05;
      // cube1.rotation.y +=0.04;
      // cube1.rotation.x +=0.02;
      // shape1.rotation.y +=0.02;
      // shape1.rotation.x +=0.01;
      renderer.clear();
    }

  requestAnimationFrame(render);
  mesh.rotation.y +=0.02;
  renderer.render(scene, camera);
}

$(document).ready(function() {
  $('#modal').on('click', function() {
    $('#info').dialog({show: 'fade'});
  });
});
