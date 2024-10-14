import * as THREE from "three";

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

function getRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

const objects = [];

function addSphere() {
  const geometry = new THREE.SphereGeometry(Math.random() + 0.5, 10, 10);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: getRandomColor(),
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50
  );
  //sphere.position.set((objects.length % 10) * 2, (objects.length / 10) * 2);
  objects.push(sphere);
  scene.add(sphere);
  console.log(renderer.info.memory);
}
function removeSphere() {
  const randomIndex = Math.floor(Math.random() * objects.length);
  const object = objects.splice(randomIndex, 1)[0];
  scene.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  console.log(renderer.info.memory);
}

let radius = 50; // 공전할 반지름
let theta = 0; // 각도 (라디안 값)

// 카메라가 (0,0,0)을 주시하면서 공전하는 함수
function updateCameraPosition() {
  theta += 0.01; // 공전 속도 (값을 조절하여 속도를 변경 가능)

  // 삼각함수를 이용해 카메라의 x, z 좌표를 업데이트 (y 좌표는 고정)
  camera.position.x = radius * Math.cos(theta);
  camera.position.z = radius * Math.sin(theta);

  // 카메라가 항상 (0, 0, 0)을 바라보도록 설정
  camera.lookAt(0, 0, 0);
}

const MAX = 200;
let addPhase = true;
let count = 0;

function animate() {
  requestAnimationFrame(animate);
  if (count++ % 2) {
    if (objects.length === MAX) {
      addPhase = false;
    }
    if (objects.length === 0) {
      addPhase = true;
    }
    if (addPhase) addSphere();
    else removeSphere();
  }
  updateCameraPosition();
  renderer.render(scene, camera);
}
animate();
