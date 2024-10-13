import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 500;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const MAX_POINTS = 500;

const geometry = new THREE.BufferGeometry();

const positions = new Float32Array(MAX_POINTS * 3);
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

let drawCount = 0;
geometry.setDrawRange(0, drawCount); // 0~2까지

const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

const line = new THREE.Line(geometry, material);
scene.add(line);

function updatePositions() {
  const positionsAttribute = line.geometry.getAttribute("position");
  if (drawCount + 1 < MAX_POINTS) {
    let x = drawCount
      ? positionsAttribute.getX(drawCount - 1) + (Math.random() - 0.5) * 20
      : 0;
    let y = drawCount
      ? positionsAttribute.getY(drawCount - 1) + (Math.random() - 0.5) * 20
      : 0;
    let z = drawCount
      ? positionsAttribute.getZ(drawCount - 1) + (Math.random() - 0.5) * 20
      : 0;

    positionsAttribute.setXYZ(drawCount, x, y, z);
    drawCount++;
  } else {
    updateColors();
    drawCount = 0;
  }
  line.geometry.setDrawRange(0, drawCount);
  positionsAttribute.needsUpdate = true;
}

function updateColors() {
  line.material.color.setRGB(Math.random(), Math.random(), Math.random());
  //line.material.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);

  updatePositions();

  renderer.render(scene, camera);
}
animate();
