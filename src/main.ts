import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const group = new THREE.Group();
new Array(5).fill(null).forEach((_, i) => {
  const geometry = new THREE.BoxGeometry( i*0.3, i*0.3, i*0.3 );
  const material = new THREE.MeshBasicMaterial( { color: new THREE.Color(255,120,0), transparent: true, opacity: 0.2 } );
  const cube = new THREE.Mesh( geometry, material );
  group.add( cube );
})
scene.add(group)
camera.position.z = 5;

const orbitControls = new OrbitControls(camera, document.body)
orbitControls.update();
function animate() {
	requestAnimationFrame( animate );
  orbitControls.update();
	renderer.render( scene, camera );
}
animate();