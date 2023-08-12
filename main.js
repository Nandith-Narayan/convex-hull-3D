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

const object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            color: 0x00ffff
        }));
let helper = new VertexNormalsHelper(object);

var geo = new THREE.EdgesGeometry(object.geometry); // or WireframeGeometry
var wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(object.geometry), new THREE.LineBasicMaterial({
            color: 0xaaaaaa
        }));

let pointsGroup = new THREE.Group(); ;

const pointMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00
});

for (let i = 0; i < uniquePoints.length; i += 3) {
    let box = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), pointMaterial);
    box.position.set(uniquePoints[i], uniquePoints[i + 1], uniquePoints[i + 2]);
    pointsGroup.add(box)
}

let normalsGroup = new THREE.Group();
const normalMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff
});

let normalList = hull.computeNormals();

for (let i = 0; i < normalList.length; i++) {
    const n = normalList[i];
    const points = [];
    points.push(new THREE.Vector3(n.x1, n.y1, n.z1));
    points.push(new THREE.Vector3(n.x2, n.y2, n.z2));
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    let line = new THREE.Line(lineGeometry, normalMaterial);
    normalsGroup.add(line);
}

scene.add(wireframe);
scene.add(object);
scene.add(helper);
scene.add(normalsGroup);
scene.add(pointsGroup);

helper.visible = false;

scene.needsUpdate = true
    //renderer.render(scene, camera);

    camera.position.z = -10;
controls.update();

object.visible = true;

let idx = 4;
function doNextHullStep() {
    if (idx >= hull.points.length) {
        return;
    }

    hull.iterateHull(hull.points[idx]);
    idx++;
}

function recreateScene() {
    positions = hull.getPointsFromFaces();
    uniquePoints = hull.getUniquePoints();

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();

    geometry.needsUpdate = true;
    scene.remove(helper);
    helper = new VertexNormalsHelper(object);
    scene.add(helper);
    if (!document.getElementById("vertex-normals").checked) {
        helper.visible = false;
    }

    scene.remove(wireframe);

    wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(object.geometry), new THREE.LineBasicMaterial({
                color: 0xaaaaaa
            }));

    scene.add(wireframe);

    let normalList = hull.computeNormals();

    scene.remove(normalsGroup);
    normalsGroup = new THREE.Group();

    for (let i = 0; i < normalList.length; i++) {
        const n = normalList[i];
        const points = [];
        points.push(new THREE.Vector3(n.x1, n.y1, n.z1));
        points.push(new THREE.Vector3(n.x2, n.y2, n.z2));
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        let line = new THREE.Line(lineGeometry, normalMaterial);
        normalsGroup.add(line);
    }

    if (!document.getElementById("face-normals").checked) {
        normalsGroup.visible = false;
    }

    scene.add(normalsGroup);

    scene.needsUpdate = true;

}

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

document.getElementById("face-normals").addEventListener('click', () => {
    let checked = document.getElementById("face-normals").checked;
    if (checked) {
        normalsGroup.visible = true;
    } else {
        normalsGroup.visible = false;
    }
    scene.needsUpdate = true

});

document.getElementById("vertex-normals").addEventListener('click', () => {
    let checked = document.getElementById("vertex-normals").checked;
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

document.getElementById("step-button").addEventListener('click', () => {

    doNextHullStep();

});

render();