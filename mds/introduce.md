# 장면 만들기

[Scene 만들기](https://threejs.org/docs/index.html#manual/ko/introduction/Creating-a-scene)

## 초기세팅

threejs로 무언가를 표현하려면 **scene, camera, renderer** 세 가지 필요

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

이런 식의 boilerplate를 작성할 수 있다

**카메라** : PerspectiveCamera(이외에도 다른 몇 가지 종류가 있다)
속성

- 시야각(field of view). 각도 값으로 설정(75$\degree$ 등.)
- 종횡비(aspect ratio). 보통 요소의 높이와 너비에 맞추어 표시함. innerwidth/innerheight처럼
- near 절단면. 이보다 가까이 있는 물체는 렌더링하지 않음
- far 절단면. 이보다 멀리 있는 물체는 렌더링하지 않음

**렌더러** : WebGLRenderer, 외에도 다른 종류가 있는데, WebGL이 지원되지 않을 때 다른거 쓰고, 보통 WebGLRenderer 쓴다
렌더러 인스턴스 생성 후 **렌더링 크기**를 설정. innerWidth x innerHeight처럼
사이즈는 유지하되 해상도를 낮추고 싶다면 : `setSize` 에서 세 번째 인자가 `updateStyle`이라서, 이걸 false로 꺼준다.  
만약 `setSize(window.innerWidth/2, window.innerHeight/2, false)`라고 쓰면, `<canvas>` 높이너비가 100%면 절반 해상도로 렌더링됨

마지막으로, **renderer** 엘리먼트를 HTML문서에 삽입.
=> `<canvas>` 엘리먼트임. renderer가 scene을 나타내는 구역

## 큐브 추가하기

```js
const geometry = new THREE.BoxGeomery(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;
```

1. `BoxGeometry`로 큐브 추가

- 큐브에 필요한 모든 vertices(꼭짓점)과 faces(면)이 포함됨. 나중에 이에 대해 알아보겠습니다.

2. 그리고 색칠해줄 요소가 필요함.
   여러 방법이 고려되었지만, 지금 가장 권장은 `MeshBasicMaterial`
   이 속성이 적용된 오브젝트들은 이에 의해 영향받게 된다  
   약간.. 물체에 대한 CSS같은 느낌임

3. 이제 `Mesh`가 필요한데, **기하학**(geometry)와 **재질**(material)을 받아 물체가 되고, 화면에 삽입되어 자유롭게 움직일 수 있게 된다.

이제 물체를 `scene.add()`로 추가하는데, 기본적으로 (0,0,0)에 감
그럼 카메라와 큐브가 겹치게되니까, 카메라를 움직였다.

## scene 렌더링

아직 렌더링하지 않아서 아무것도 안 보일거임

**render or animate loop**로 렌더링하자.

```js
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

game-loop가 생각나네
입력을 받고 -> 적절히 update하고 -> render하는 것을 무한반복하는거였음

아무튼 이렇게 하면, 화면이 새로고침될때마다,기본적으로 1초에 60번, 계속해서 렌더링해준다.
_왜 setInterval 안 씀?_ => 브라우저 창에서 이탈한 경우 멈추거나 등의 이점을 제공한다.

## 큐브 움직이기

**animate**함수에서, `renderer.render()` 바로 위에서 큐브를 업데이트하자.
`cube.rotation.x += 0.01; cube.rotation.y += 0.01`;
이렇게 기본적으로 뭔가를 움직이거나 변형시키려면, animate loop를 사용.

# 선 그리기

[선 그리기](https://threejs.org/docs/index.html#api/en/objects/Mesh)
아까는 와이어프레임 [Mesh](https://threejs.org/docs/index.html#api/en/objects/Mesh)였음
이거 없이 선이나 원을 그려봅시다.

먼저 아까처럼 씬 카메라 랜더러를 설정하자.

```js
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  500
);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
```

이제 재질을 정의하자. 선을 그리려면 `LineBasicMaterial, LineDashedMaterial`

```js
const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
```

이제 꼭짓점에 대한 기하학을 정의 :

```js
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const geometry = new THREE.BufferGeometry().setFromPoints(points);
```

선은 연속된 꼭지점 쌍 사이에 그려지고, 첫번째와 마지막 사이에는 그려지지 않음. (= 닫혀있지 않다.)

이제 재질과 기하학을 합쳐서 선을 만든다.

```js
const line = new THREE.Line(geometry, material);
```

이제 렌더하면 됨.

```js
scene.add(line);
renderer.render(scene, camera);
```

# 텍스트 만들기

https://threejs.org/docs/index.html#manual/ko/introduction/Creating-text

1. DOM + CSS : 그냥 HTML요소로 텍스트 추가하기. (오버레이 설명 등)
2. [Texture](https://threejs.org/docs/index.html#api/en/textures/Texture)로 캔버스에 텍스트 그리기
3. 3D 작업 앱으로 만들고 import하기 : [3D 모델 불러오기](https://threejs.org/docs/index.html#manual/ko/introduction/Loading-3D-models)
4. 절체적 텍스트 geometry : `THREE.TextGeometry` 인스턴스인 mesh를 사용하여 절차적으로 사용하기.
   - 이 때, TextGeometry의 font 파라미터가 `THREE.Font`인스턴스로 설정되어야 함
   - [여기](https://threejs.org/docs/index.html#examples/en/geometries/TextGeometry)참고
5. 비트맵 글꼴

---

# 심화

[오브젝트 업데이트하기](https://threejs.org/docs/index.html#manual/ko/introduction/How-to-update-things)

```js
const object = new THREE.Object3D();
scene.add(object);
```

이런 식으로 장면에 추가되거나

```js
const object1 = new THREE.Object3D();
const object2 = new THREE.Object3D();

object1.add(object2);
scene.add(object1); //object1과 object2는 자동으로 자신들의 행렬구조를 업데이트할 것입니다.
```

혹은 다른 오브젝트의 자식으로 장면에 추가되면  
기본적으로 자신의 행렬구조를 업데이트하게 됨

그런데 오브젝트가 고정되어야 한다면, 이러한 설정을 풀고 수동으로 행렬구조를 업데이트하게 할 수 있다.

```js
object.matrixAutoUpdate = false;
object.updateMatrix();
```

## BufferGeometry

`BufferGeometry`는 꼭짓점 위치, 면 순서, 법선, 색 등 다양한 정보를 [buffers](https://threejs.org/docs/index.html#api/ko/core/BufferAttribute)에 저장하여 GPU에 보다 효율적으로 데이터를 전송할 수 있게 합니다.
이 `buffers`는 [typed arrays](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Typed_arrays)입니다.

- [[JavaScript Typed Array]]

`buffers`가 typed array이기 때문에, `buffers`의 크기를 동적으로 조절하기 어렵습니다. 대신에 배열에 담은 내용을 변경합니다.  
이는 곧.. `BufferGemoetry`에 원소들을 새로 넣을 것이 예상된다면, 그만큼 충분한 크기의 buffer를 확보해두어야 한다는 뜻입니다.

### 매 렌더링마다 랜덤하게 확장되는 선을 그리기

buffer에 최대 500개의 꼭짓점을 할당하고, 0개 점부터 시작

```js
/*
boiler plate (scene, camera) 생성
*/
const MAX_POINTS = 500; //500개 꼭짓점으로 한정하기.

const geometry = new THREE.BufferGeometry(); //BufferGeometry를 생성

const positions = new Float32Array(MAX_POINTS * 3); //x,y,z 담아야하니 3배
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); //position이라는 속성을 설정하고, BufferAttribute를 생성

let drawCount = 0; //0에서부터 시작
geometry.setDrawRange(0, drawCount); // 0~drawCount까지

// 빨간색 재질 생성
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

//기하학과 재질로 line 생성하고, 추가
const line = new THREE.Line(geometry, material);
scene.add(line);
```

이제 아래처럼, 무작위 패턴을 추가하여 업데이트하는 함수를 만들자.

```js
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
    drawCount = 0;
  }
  line.geometry.setDrawRange(0, drawCount); // 첫 렌더링 이후 그려낼 점의 갯수를 변경.
  positionsAttribute.needsUpdate = true; // 첫 렌더링 이후 position 데이터 수치를 변경하게 함.
}
```

`drawCount % MAX_POINTS`로 단순하게 해도 좋긴할듯
아무튼, MAX_POINTS보다 drawCount가 작은 동안은, 이전 위치로부터 랜덤하게 뻗어나가는 위치를 생성(`let x, y, z`)하고,  
`positionsAttribute.setXYZ(drawCount, x, y, z)`로, 새 꼭짓점을 추가.

**position 데이터의 변경이 적용되게 하려면, `positionAttribute.needsUpdate=true`로 선언**

> 첫 렌더링 이후에 position 데이터 수치를 변경한다면, bounding volumes를 재계산해서 다른 엔진의 절두체 컬링 혹은 헬퍼같은 특성들이 적절히 작동하도록 해야합니다.  
>  `line.geometry.computeBoundingBox();`  
>  `line.geometry.computeBoundingSphere();`

전체 코드

```js
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
    drawCount = 0;
  }
  line.geometry.setDrawRange(0, drawCount);
  positionsAttribute.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);

  updatePositions();

  renderer.render(scene, camera);
}
animate();
```

## 재질 Materials

모든 uniforms 값들은 자유롭게 변경 가능. 예를 들어, colors, textures, opacity ..  
이 값들은 매 프레임마다 shader에 전송됩니다.  
또한 depthTest, blending, polygonOffset처럼 GLstate관련 파라미터 또한 언제나 변경할 수 있습니다.

런타임(재질이 최소 한 번 렌더링 된 이후)에 쉽게 변경할 수 없는 속성들

- uniforms의 갯수와 타입.
- 아래 속성들의 사용/비사용 여부
  - texture, fog, vertex colors, morphing, shadow map, alpha test, transparent

이러한 요소들을 변경하려면 아래처럼 선언하여 새로운 shader 프로그램을 생성하게 해야 합니다.

```js
material.needsUpdate = true;
```

근데 이건 매우 느리고 프레임이 끊겨보일 수 있습니다. (특히 shader 편집이 DirectX에서 OpenGL보다 느린, Windows같은 경우)

좀 더 부드럽게 하려면, 밝기 0인 빛, 흰 텍스처, 밀도 0인 안개 등의 "가상 값"을 가지도록 특성을 변경하는 방법이 있습니다.

이렇듯, 어떤 기하학 블록에 사용되는 재질은 자유롭게 바꿀 수 있지만, 오브젝트를 블록으로 나누는 구성은 변경할 수 없습니다.  
라는 말의 뜻이 잘 와닿지 않았는데, 오브젝트의 기하학적 구조 또는 특성(면을 나누는 방식, 꼭짓점의 연결 구성 등)을 변경할 수 없다는 말 같네요

### 런타임 중에 재질을 서로 다르게 설정해야 할 때

재질과 블록 수가 적은 경우, 오브젝트를 미리 분리해둘 수 있습니다.  
예를 들어, 사람을 머리/얼굴/상의/바지, .. 이렇게

그러나 모든 얼굴들이 조금씩 다른 경우처럼 그 수가 너무 많다면, 속성/텍스처를 사용하여 얼굴마다 다른 형태를 입히는 방법 등을 생각해볼 수 있습니다.

## 텍스처

사진, 그림, 영상 및 데이터 텍스처를 변경했으면, 이 경우에도 플래그를 설정해야합니다.

```js
texture.needsUpdate = true;
```

## 카메라

카메라의 위치와 대상은 자동으로 업데이트됩니다.  
만약 변경을 원하는 경우

- fov
- aspect
- near
- far

이러한 속성을 변경한 직후, 행렬구조를 다시 계산하게 합니다.  
예를 들어:

```js
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
```

---

# 오브젝트를 폐기하는 방법

[오브젝트를 폐기하는 방법](https://threejs.org/docs/index.html#manual/ko/introduction/How-to-dispose-of-objects)

three.js의 인스턴스는 생성될 때마다 일정량의 메모리를 할당합니다.  
이들은 특정 개체에 대한 기하학적 구조나 WebGL 재질(버퍼 또는 쉐이더) 개체의 렌더링에 필요한 것입니다.  
그러나 이러한 오브젝트들은 자동으로 폐기되지 않습니다.

## 기하학

기하학은 속성 집합으로 정의된 꼭짓점 정보를 표시합니다.  
three.js는 속성마다 하나의 [WebGLBuffer](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer) 유형의 객체를 만들어 내부에 저장합니다.  
이러한 객체는 [BufferGeometry.dispose](https://threejs.org/docs/index.html#api/ko/core/BufferGeometry.dispose)를 호출할 때만 폐기됩니다.  
그러니 만약 어플리케이션에서 기하학 객체가 더이상 사용되지 않는다면, 이를 호출하여 폐기하세요.

## 재질

재질은 오브젝트가 어떻게 랜더링되는지를 정의합니다. three.js는 재질에 정의된 정보를 사용하여 렌더링을 위한 하나의 쉐이더 프로그램을 구축합니다.  
이 쉐이더 프로그램은 해당 재질이 폐기된 후에만 삭제 가능합니다.  
성능상의 이유로, three.js는 가능하다면 활용 가능한 쉐이더 프로그램을 재사용하게 되어있습니다.  
따라서 쉐이더 프로그램은 모든 관련 재질들이 사라진 후에야 삭제될 수 있으며, `Material.dispose()`를 호출하여 재질을 폐기할 수 있습니다.

## 텍스처

재질의 폐기는 텍스처에 영향을 미치지 않습니다. 이들은 분리되어있고, 따라서 하나의 텍스처를 여러 재질에 동시에 사용할 수 있습니다.  
`Texture` 인스턴스를 만들 때마다 three.js는 내부에서 [WebGLTexture](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) 인스턴스를 만듭니다.  
이는 기하학의 `WebGLBuffer`에서와 비슷하게, `Texture.dispose()`를 호출하여 삭제합니다.

근데 만약 texture가 `ImageBitmap`을 사용하는데, 이제 폐기해야 한다면, `ImageBitmap.close()`를 호출하여 어플리케이션 레벨에서 모든 CPU 자원을 폐기하도록 해야 합니다.  
`Texture.dispose()`에 의해 자동으로 `ImageBitmap.close()`가 트리거되게 할 수는 없는게, 엔진은 이미지 비트맵이 다른 어디서 쓰이는지 아닌지를 알 수 없습니다.

## 렌더링 대상

`WebGLRendererTarget` 타입의 오브젝트는 [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)의 인스턴스가 할당되어 있으며, 이 뿐만 아니라 [`WebGLFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer)와 [`WebGLRendererbuffer`](https://developer.mozilla.org/ko/docs/Web/API/WebGLRenderbuffer)도 할당되어 커스텀 렌더링 타겟을 실체화합니다.  
이러한 오브젝트는 `WebGLRenderingTarget.dispose()`를 실행하여 폐기합니다.

## 그 외

컨트롤러나 후기 처리 프로세스처럼 `dispose()`메서드가 제공되어 내부 이벤트리스너나 렌더링 타겟을 폐기할 수 있는 친구들이 있습니다.  
일반적으로, API나 파일을 열람하여 `dispose()`가능한지 확인하는 것이 좋습니다.  
이 메서드가 존재한다면 당연히 그 메서드를 이용하여 폐기해야 합니다.

# 삭제 샘플

```js
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

let addPhase = true;
let count = 0;

function animate() {
  requestAnimationFrame(animate);
  if (count++ % 2) {
    if (objects.length === 100) {
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
```

<iframe src="https://codesandbox.io/embed/x32ht8?view=preview&module=%2Fsrc%2Findex.js&hidenavigation=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Three.js playground (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
   
잘 폐기되었는지는 렌더러 객체의 info 속성에서 확인할 수 있습니다.  
예를 들어, `texture`와 `geometry`는 `console.log(renderer.info.memory);`와 같이 로그를 찍어 확인해볼 수 있습니다.
