import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const initThree = {
	init: function () {
		const canvas = document.querySelector('.web-gl');
		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
		camera.position.set(20, 0, 0);
		scene.add(camera);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas,
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
		renderer.autoClear = false;
		renderer.setClearColor(0x000000, 0.0);

		const controls = new OrbitControls(camera, renderer.domElement);
		// controls.enableZoom = false;
		controls.rotateSpeed = -0.5;

		const geometry = new THREE.SphereGeometry(50, 64, 64);
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load('assets/bedroom.jpg');
		const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);

		function addHotspot(position) {
			let spriteMap = new THREE.TextureLoader().load('assets/information.svg');
			let spriteMaterial = new THREE.SpriteMaterial({
				map: spriteMap,
			});
			let sprite = new THREE.Sprite(spriteMaterial);
			sprite.position.copy(position.clone().normalize().multiplyScalar(49));
			sprite.scale.set(2, 2, 2);
			scene.add(sprite);
		}

		function animate() {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		}
		animate();

		function onResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}
		window.addEventListener('resize', onResize);

		function onClick(e) {
			let mouse = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
			let rayCaster = new THREE.Raycaster();
			rayCaster.setFromCamera(mouse, camera);
			let intersects = rayCaster.intersectObjects(scene.children);
			console.log(intersects);

			// when enabled, click is going to log the coordinates of the  hotspot position
			// let intersects = rayCaster.intersectObject(sphere);

			// if (intersects.length > 0) {
			// 	console.log(intersects[0].point);
			// }
		}
		document.body.addEventListener('click', onClick);

		addHotspot(new THREE.Vector3(-45.29023669563931, -13.333199294732875, -16.245877966630072));
		addHotspot(new THREE.Vector3(-27.967388868792103, 0.056428030970181675, -41.43167855278803));
		addHotspot(new THREE.Vector3(49.75266425271612, -0.43246674638371774, -4.818515001423708));
	},
};

export default initThree;
