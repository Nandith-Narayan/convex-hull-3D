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

// Create three.js scene, camera, renderer, and controls
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('screen').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

// Compute convex hull
let hull = new ConvexHull();
hull.initPointList(20);
let positions = hull.getPointsFromFaces();
let uniquePoints = hull.getUniquePoints();
let uniqueHullPoints = hull.getUniqueHullPoints();

// Create mesh
let geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.computeVertexNormals();
const objectMaterial = new THREE.MeshNormalMaterial();
let object = new THREE.Mesh(geometry, objectMaterial);

// Create vertex normal helper, wireframe, points, and face normals
let helper = new VertexNormalsHelper(object);
let wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(object.geometry), new THREE.LineBasicMaterial({
            color: 0xffffff
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
let hullPointsGroup = new THREE.Group(); ;
const hullPointMaterial = new THREE.MeshBasicMaterial({
    color: 0x00bb00
});
for (let i = 0; i < uniqueHullPoints.length; i += 3) {
    let box = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), hullPointMaterial);
    box.position.set(uniqueHullPoints[i], uniqueHullPoints[i + 1], uniqueHullPoints[i + 2]);
    hullPointsGroup.add(box)
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

// Add everything to the scene
scene.add(wireframe);
scene.add(object);
scene.add(helper);
scene.add(normalsGroup);
scene.add(pointsGroup);
scene.add(hullPointsGroup);

helper.visible = false;

scene.needsUpdate = true;

camera.position.z = -10;
controls.update();

let pointsCaptured = hull.points.length;
const display = document.getElementById("point-display");
display.innerText = "Points: " + pointsCaptured + "/" + hull.points.length;

function doNextHullStep() {

    if (pointsCaptured >= hull.points.length) {
        pointsCaptured = 4;
    } else {
        pointsCaptured++;
    }

    hull.initHull();

    for (let i = 4; i < pointsCaptured && i < hull.points.length; i++) {
        hull.iterateHull(i);
    }

    const display = document.getElementById("point-display");
    display.innerText = "Points: " + pointsCaptured + "/" + hull.points.length;

    recreateScene();
}

function recreateScene() {
    positions = hull.getPointsFromFaces();
    uniquePoints = hull.getUniquePoints();
    uniqueHullPoints = hull.getUniqueHullPoints();

    scene.remove(object);
    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();

    geometry.needsUpdate = true;
    object = new THREE.Mesh(geometry, objectMaterial);
    scene.add(object);

    scene.remove(helper);
    helper = new VertexNormalsHelper(object);
    scene.add(helper);

    scene.remove(wireframe);

    wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(object.geometry), new THREE.LineBasicMaterial({
                color: 0xffffff
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
    scene.add(normalsGroup);

    scene.remove(pointsGroup);
    pointsGroup = new THREE.Group(); ;
    for (let i = 0; i < uniquePoints.length; i += 3) {
        let box = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), pointMaterial);
        box.position.set(uniquePoints[i], uniquePoints[i + 1], uniquePoints[i + 2]);
        pointsGroup.add(box)
    }
    scene.add(pointsGroup);

    scene.remove(hullPointsGroup);
    hullPointsGroup = new THREE.Group(); ;
    for (let i = 0; i < uniqueHullPoints.length; i += 3) {
        let box = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), hullPointMaterial);
        box.position.set(uniqueHullPoints[i], uniqueHullPoints[i + 1], uniqueHullPoints[i + 2]);
        hullPointsGroup.add(box)
    }
    scene.add(hullPointsGroup);

    if (document.getElementById("wireframe").checked) {
        object.visible = false;
    }
    if (!document.getElementById("points").checked) {
        pointsGroup.visible = false;
        hullPointsGroup.visible = false;
    }
    if (!document.getElementById("vertex-normals").checked) {
        helper.visible = false;
    }
    if (!document.getElementById("face-normals").checked) {
        normalsGroup.visible = false;
    }

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
        hullPointsGroup.visible = true;
    } else {
        pointsGroup.visible = false;
        hullPointsGroup.visible = false;
    }
    scene.needsUpdate = true

});

document.getElementById("step-button").addEventListener('click', () => {
    doNextHullStep();
});
document.getElementById("rand-button").addEventListener('click', () => {
    hull.initPointList(parseInt(document.getElementById("point-range").value));
    const display = document.getElementById("point-display");
    pointsCaptured = hull.points.length;
    display.innerText = "Points: " + pointsCaptured + "/" + hull.points.length;
    pointsCaptured = hull.points.length;
    recreateScene();
});
document.getElementById("point-range").addEventListener('input', () => {
    hull.initPointList(parseInt(document.getElementById("point-range").value));
    const display = document.getElementById("point-display");
    pointsCaptured = hull.points.length;
    display.innerText = "Points: " + pointsCaptured + "/" + hull.points.length;
    pointsCaptured = hull.points.length;
    recreateScene();
});

render();
