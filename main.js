import * as THREE from 'three';
import {
    OrbitControls
}
from 'three/addons/controls/OrbitControls.js';
import {
    VertexNormalsHelper
}
from 'three/addons/helpers/VertexNormalsHelper.js';

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


let hull = new ConvexHull();
hull.initPointList();
let positions = hull.getPointsFromFaces();
let uniquePoints = hull.getUniquePoints();


geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.computeVertexNormals();
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff
}); // new THREE.MeshNormalMaterial()

const object = new THREE.Mesh(geometry, material);
const helper = new VertexNormalsHelper(object);

var geo = new THREE.EdgesGeometry(object.geometry); // or WireframeGeometry
var mat = new THREE.LineBasicMaterial({
    color: 0xaaaaaa
});
var wireframe = new THREE.LineSegments(geo, mat);

let pointsGroup= new THREE.Group();;

const pointMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00
});

for(let i=0; i< uniquePoints.length; i+=3){
    let box = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), pointMaterial);
    box.position.set(uniquePoints[i],uniquePoints[i + 1],uniquePoints[i + 2]);
    pointsGroup.add(box)
}

scene.add(pointsGroup);

scene.add(wireframe);
scene.add(object);
scene.add(helper);

scene.needsUpdate = true
    //renderer.render(scene, camera);

    camera.position.z = -10;
controls.update();

object.visible = true;

function render() {
    test()
    renderer.render(scene, camera);
    requestAnimationFrame(render);

}

document.getElementById("wireframe").addEventListener('click', () => {
    let checked = document.getElementById("wireframe").checked;
    if (checked) {
        object.visible = false;
    } else {
        object.visible = true;
    }
    scene.needsUpdate = true

});

document.getElementById("normals").addEventListener('click', () => {
    let checked = document.getElementById("normals").checked;
    if (checked) {
        helper.visible = true;
    } else {
        helper.visible = false;
    }
    scene.needsUpdate = true

});

document.getElementById("points").addEventListener('click', () => {
    let checked = document.getElementById("points").checked;
    if (checked) {
        pointsGroup.visible = true;
    } else {
        pointsGroup.visible = false;
    }
    scene.needsUpdate = true

});

render();
