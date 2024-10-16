import * as THREE from "three";

export function getRandomColor() {
    return (
        "#" +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
    );
}

export function addSphere(objects, scene, renderer) {
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
export function removeSphere(objects, scene, renderer) {
    const randomIndex = Math.floor(Math.random() * objects.length);
    const object = objects.splice(randomIndex, 1)[0];
    scene.remove(object);
    object.geometry.dispose();
    object.material.dispose();
    console.log(renderer.info.memory);
}

let theta = 0; // 각도 (라디안 값)
export function orbitCamera(camera, x, y, z, radius) {
    theta += 0.01; // 공전 속도 (값을 조절하여 속도를 변경 가능)

    // 삼각함수를 이용해 카메라의 x, z 좌표를 업데이트 (y 좌표는 고정)
    camera.position.x = radius * Math.cos(theta);
    camera.position.z = radius * Math.sin(theta);

    // 카메라가 항상 (x, y, z)을 바라보도록 설정
    camera.lookAt(x, y, z);
}
