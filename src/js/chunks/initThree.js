import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

const initThree = {
	init: function () {
		const startingOverlay = document.querySelector('.js-starting-overlay');
		const startingButton = document.querySelector('.js-starting-button');
		const roomName = document.querySelector('.js-room-name');

		const removeStartingOverlay = () => {
			startingOverlay.classList.add('starting-overlay--inactive');
			setTimeout(() => {
				startingOverlay.style.display = 'none';
			}, 300);
			roomName.classList.add('room-name--active');
			gsap.to(camera, {
				zoom: 1,
				duration: 1,
				ease: 'Power4.easeOut',
				onUpdate: () => {
					camera.updateProjectionMatrix();
				},
			});
		};
		startingButton.addEventListener('click', removeStartingOverlay);

		const canvasWrap = document.querySelector('.js-canvas-wrap');
		const hotspot = document.querySelector('.js-hotspot-desc');
		let hotspotActive = false;

		const canvas = document.querySelector('.web-gl');
		const scene = new THREE.Scene();

		let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
		camera.position.set(20, 0, 0);
		camera.zoom = 20;
		camera.updateProjectionMatrix();
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
		controls.rotateSpeed = -0.5;

		const geometry = new THREE.SphereGeometry(50, 64, 64);
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load('assets/bedroom.jpg');
		const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);

		function addHotspot(position, name) {
			let spriteMap = new THREE.TextureLoader().load('assets/information.png');
			let spriteMaterial = new THREE.SpriteMaterial({
				map: spriteMap,
			});
			let sprite = new THREE.Sprite(spriteMaterial);
			sprite.name = name;
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

		let rayCaster = new THREE.Raycaster();

		function onClick(e) {
			let mouse = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
			rayCaster.setFromCamera(mouse, camera);
			let intersects = rayCaster.intersectObjects(scene.children);
			intersects.forEach((intersect) => {
				if (intersect.object.type === 'Sprite' && intersect.object.name) {
					console.log(intersect.object.name);
				}
			});
			// when enabled, click is going to log the coordinates of the  hotspot position
			// let intersects = rayCaster.intersectObject(sphere);

			// if (intersects.length > 0) {
			// 	console.log(intersects[0].point);
			// }
		}
		canvasWrap.addEventListener('click', onClick);

		function onMouseMove(e) {
			let mouse = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
			rayCaster.setFromCamera(mouse, camera);
			let foundSprite = false;
			let intersects = rayCaster.intersectObjects(scene.children);
			intersects.forEach((intersect) => {
				if (intersect.object.type === 'Sprite') {
					let p = intersect.object.position.clone().project(camera);
					hotspot.style.top = ((-1 * p.y + 1) * window.innerHeight) / 2 + 'px';
					hotspot.style.left = ((p.x + 1) * window.innerWidth) / 2 + 'px';
					hotspot.textContent = intersect.object.name;
					hotspot.classList.add('hotspot-desc--active');
					hotspotActive = true;
					foundSprite = true;
				}
			});
			if (foundSprite === false && hotspotActive) {
				hotspot.classList.remove('hotspot-desc--active');
			}
		}
		canvasWrap.addEventListener('mousemove', onMouseMove);

		addHotspot(new THREE.Vector3(-45.29023669563931, -13.333199294732875, -16.245877966630072), 'Huge TV');
		addHotspot(new THREE.Vector3(-27.967388868792103, 0.056428030970181675, -41.43167855278803), 'Go to Bedroom');
		addHotspot(new THREE.Vector3(49.75266425271612, -0.43246674638371774, -4.818515001423708), 'Pictures');
	},
};

export default initThree;
