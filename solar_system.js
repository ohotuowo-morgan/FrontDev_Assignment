// === Basic Scene Setup ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 60;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// === Lights ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 1.5, 200);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// === Background Stars ===
function createStars(count = 500) {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  const positions = [];

  for (let i = 0; i < count; i++) {
    const x = THREE.MathUtils.randFloatSpread(400);
    const y = THREE.MathUtils.randFloatSpread(400);
    const z = THREE.MathUtils.randFloatSpread(400);
    positions.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}
createStars();

// === Sun ===
const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffaa00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// === Planet Data ===
const planetData = [
  { name: "Mercury", color: 0xaaaaaa, distance: 8, size: 0.8, speed: 0.01 },
  { name: "Venus", color: 0xffddaa, distance: 11, size: 1.2, speed: 0.008 },
  { name: "Earth", color: 0x3366ff, distance: 14, size: 1.3, speed: 0.007 },
  { name: "Mars", color: 0xff4422, distance: 17, size: 1.0, speed: 0.006 },
  { name: "Jupiter", color: 0xffaa66, distance: 22, size: 2.5, speed: 0.004 },
  { name: "Saturn", color: 0xffcc99, distance: 27, size: 2.2, speed: 0.0035 },
  { name: "Uranus", color: 0x66ffff, distance: 32, size: 1.9, speed: 0.0025 },
  { name: "Neptune", color: 0x3366cc, distance: 36, size: 1.8, speed: 0.002 }
];

// === Create Planets and Orbits ===
const planetGroups = [];
const controlsDiv = document.getElementById('controls');

planetData.forEach(data => {
  // Create orbit group
  const orbitGroup = new THREE.Object3D();

  // Create planet
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: data.color });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = data.distance;
  orbitGroup.add(planet);
  scene.add(orbitGroup);

  // Store and add to UI
  const planetObj = { group: orbitGroup, mesh: planet, ...data };
  planetGroups.push(planetObj);

  // === Slider UI ===
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <label for="${data.name}">${data.name}</label><br>
    <input type="range" id="${data.name}" min="0" max="0.03" step="0.001" value="${data.speed}">
    <span id="${data.name}-val">${data.speed}</span>
    <br><br>
  `;
  controlsDiv.appendChild(wrapper);

  const slider = wrapper.querySelector(`#${data.name}`);
  const label = wrapper.querySelector(`#${data.name}-val`);
  slider.addEventListener('input', e => {
    planetObj.speed = parseFloat(e.target.value);
    label.textContent = e.target.value;
  });
});

// === Pause/Resume Animation ===
let paused = false;
const pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
});

// === Dark/Light Theme Toggle ===
document.body.classList.add('dark'); // Default mode
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
  renderer.setClearColor(document.body.classList.contains('light') ? 0xf0f0f0 : 0x000000);
});

// === Animate Loop ===
function animate() {
  requestAnimationFrame(animate);

  if (!paused) {
    planetGroups.forEach(planet => {
      planet.group.rotation.y += planet.speed;      // Orbit
      planet.mesh.rotation.y += 0.01;               // Axial spin
    });
  }

  renderer.render(scene, camera);
}
animate();

// === Responsive Resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById("toggleSidebar");
    const controls = document.getElementById("controls");

    toggleBtn.addEventListener("click", () => {
        controls.classList.toggle("open");
    });
});
