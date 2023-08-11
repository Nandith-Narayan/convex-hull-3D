import * as THREE from 'three';
import {
    OrbitControls
}
from 'three/addons/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';

import {
    test,
    ConvexHull
}
from './convexhull.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('screen').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
const geometry = new THREE.BufferGeometry();

let positions = [
    0, 0, 15, // v1
    0, 5, 15, // v2
    5, 0, 5, // v3
    1, 0, 15, // v1
    1, 5, 15, // v2
    1, 0, 5 // v3
];
let hull = new ConvexHull();
hull.initPointList();
positions = hull.getPointsFromFaces();

console.log(positions)

geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.computeVertexNormals();
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff
}); // new THREE.MeshNormalMaterial()

const object = new THREE.Mesh(geometry, material);
const helper = new VertexNormalsHelper(object);

var geo = new THREE.EdgesGeometry( object.geometry ); // or WireframeGeometry
var mat = new THREE.LineBasicMaterial( { color: 0x000000 } );
var wireframe = new THREE.LineSegments( geo, mat );
object.add( wireframe );

scene.add(object);
scene.add(helper);

scene.needsUpdate = true
    //renderer.render(scene, camera);

camera.position.z = -10;
controls.update();

function render() {
    test()
    renderer.render(scene, camera);
    requestAnimationFrame(render);

}
render();
