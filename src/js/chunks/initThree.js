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
		controls.enableZoom = false;
		controls.rotateSpeed = 0.5;

		const geometry = new THREE.SphereGeometry(50, 64, 64);
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load('assets/bedroom.jpg');
		const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);

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
	},
};

export default initThree;
