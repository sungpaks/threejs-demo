import * as THREE from "three";
import { getRandomColor, addSphere, removeSphere, orbitCamera } from "./utils";
import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { OutputPass } from "three/examples/jsm/Addons.js";
import { RenderPixelatedPass } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.x = 25;
camera.position.y = 25;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const objects = [];

let radius = 50; // 공전할 반지름

const MAX = 200;
let addPhase = true;
let count = 0;

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
const renderPixelatedPass = new RenderPixelatedPass(5, scene, camera);
const outputPass = new OutputPass();
composer.addPass(renderPass);
composer.addPass(renderPixelatedPass);
composer.addPass(outputPass);

function animate() {
    requestAnimationFrame(animate);
    if (count++ % 2) {
        if (objects.length === MAX) {
            addPhase = false;
        }
        if (objects.length === 0) {
            addPhase = true;
        }
        if (addPhase) addSphere(objects, scene, renderer);
        else removeSphere(objects, scene, renderer);
    }
    orbitCamera(camera, 0, 0, 0, radius);
    composer.render();
}
animate();
