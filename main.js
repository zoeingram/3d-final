var renderer, contain, camera, scene, material, mesh, cube;
var shape;

var shapesArr = [];
var cube1;
var shape1;
var a, b, c, d, e;

var width = window.innerWidth;
var height = window.innerHeight;
var controls;
var uniforms = {
    time: {
        type: "f",
        value: 1.0
    },
    size: {
        type: "v2",
        value: new THREE.Vector2(width, height)
    }
};
var paused = false;
var date = new Date().getTime();


var fragmentShader;
var vertexShader;

function writeFragmentShader(value1, value2) {
  fragmentShader = "varying float vZ;"+
  "uniform float time;"+
  "uniform vec2 size;"+
  "void main() {" +
    "vec2 d = gl_FragCoord.xy - (0.5+0.01*sin(time))*size;" +
    "float a = sin(time*0.2)*1.0*3.14159;" +
    "d = vec2( d.x*cos(a) + d.y*sin(a)," +
      "-d.x*sin(a) + d.y*cos(a));"+
      "vec2 rg = vec2(1.0)-abs(d)/(0.6*size.xx);"+
      "float b = abs(vZ)/ 180.0;"+
      "gl_FragColor = vec4(b,rg +" +value1+ ", "+value2+");"+
  "}";
}

function writeVertexShader(value1, value2, value3, value4) {
  vertexShader =
  "varying float vZ;"+
  "uniform float time;"+
  "void main() {"+
    "vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);"+
    "mvPosition.y += "+value3+"*sin(time*0.1+mvPosition.x/"+value4+");"+
    "mvPosition.x += "+value1+"*cos(time*0.1+mvPosition.y/"+value2+");"+
    "vec4 p = projectionMatrix * mvPosition;"+
    "vZ = p.z;"+
    "gl_Position = p;"+
  "}"
}

function generateValue(min, max) {
  return  Math.random() * (max - min) + min;
}


window.addEventListener('load', init);
function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, width / height, 10, 1000);
    camera.position.z = 100;
    controls = new THREE.OrbitControls(camera);
    controls.update();

    scene.add(camera);
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff);
    contain = renderer.domElement;
    document.body.appendChild(contain);

    $.get("small-data.csv")
        .pipe(CSV.parse)
        .done(function(rows) {
            for (var i = 1; i < rows.length; i++) {
                a = rows[i][0];
                b = rows[i][1];
                c = rows[i][2];
                d = rows[i][3];
                d = (d + generateValue(100, 400)) / 1000;
                e = (b + generateValue(10, 30)) / 100;


                if(i % 2 == 0) { //if even iteration
                  writeVertexShader(a,b,c -4,b);
                  writeFragmentShader(d, e);
                  shape = new THREE.Mesh(
                      new THREE.SphereGeometry(b, a, c),
                      new THREE.ShaderMaterial({
                          uniforms: uniforms,
                          vertexShader: vertexShader,
                          fragmentShader: fragmentShader
                      }));
                } else {
                  writeVertexShader(a,b,c,b);
                  writeFragmentShader(e, d);
                  shape = new THREE.Mesh(
                      new THREE.SphereGeometry(a, b, c),
                      new THREE.ShaderMaterial({
                          uniforms: uniforms,
                          vertexShader: vertexShader,
                          fragmentShader: fragmentShader
                      }));
                }

                shapesArr.push(shape);
            }
            for (var j = 0; j < shapesArr.length; j++) {
                scene.add(shapesArr[j]);
            }
        });
    render();
}


function render(t) {
    if (!paused) {
        last = t;
        uniforms.time.value += 0.05;
        renderer.clear();
    }
    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

$(document).ready(function() {

  $('.ui-dialog').css('background-color', 'rgba(255,255,255,0.5)');
    $('#modal').on('click', function() {
        $('#info').dialog({
            show: 'fade'
        });
    });
});
