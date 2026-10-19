import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'meshoptimizer/decoder';
import { timelineAt, STORY } from './timeline.mjs';

const stage = document.querySelector('#stage');
const track = document.querySelector('#buoy-story');
const canvas = document.querySelector('#buoy-canvas');
const motionToggle = document.querySelector('#reduce-motion');
const readout = document.querySelector('#scene-readout');
let renderer, scene, camera, buoy, water, frameId, staticMode = false, failed = false, cameraInitialized = false;
let renderStats = { ms: 0, calls: 0, triangles: 0 };
let lastFrame = performance.now(), reportAt = 0;
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

function createWater() {
  const geo = new THREE.PlaneGeometry(120, 120, 128, 128);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uUnder: { value: 0 } },
      vertexShader: `
      uniform float uTime; varying vec3 vWorld; varying vec3 vNormal;
      void main(){ vec3 p=position; float x=p.x, z=p.y; float a=x*.22+uTime*.7, b=z*.39-uTime*.5, c=(x+z)*.12+uTime*.31; float w=sin(a)*.045+sin(b)*.024+sin(c)*.018; float dx=cos(a)*.0099+cos(c)*.00216; float dz=cos(b)*.00936+cos(c)*.00216; p.z+=w; vec4 world=modelMatrix*vec4(p,1.); vWorld=world.xyz; vNormal=normalize(vec3(-dx,1.,-dz)); gl_Position=projectionMatrix*viewMatrix*world; }
    `,
    fragmentShader: `
      uniform float uTime; uniform float uUnder; varying vec3 vWorld; varying vec3 vNormal;
      void main(){ vec3 n=normalize(vNormal); vec3 viewDir=normalize(cameraPosition-vWorld); float fresnel=pow(1.-abs(dot(n,viewDir)),3.); float broad=sin(vWorld.x*.035+vWorld.z*.061+sin(vWorld.z*.019+vWorld.x*.014)*2.+uTime*.12)*.72; float fine=sin(vWorld.x*.12-vWorld.z*.08+uTime*.21)*.28; float glint=smoothstep(.78,.98,broad+fine+fresnel*.2); vec3 reflection=vec3(.62,.78,.73)+glint*.14; vec3 surface=mix(vec3(.12,.39,.47),reflection,fresnel*.58)+glint*.08; vec3 deep=vec3(.025,.14,.20)+glint*.018; vec3 col=mix(surface,deep,uUnder); float alpha=mix(.44,.65,fresnel)+glint*.1; gl_FragColor=vec4(col,alpha); }
    `,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.015;
  mesh.renderOrder = 2;
  scene.add(mesh);
  return mesh;
}

function startRenderer() {
  if (renderer || staticMode || failed) return;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.35 : 1.7));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    cameraInitialized = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a3140, 0.035);
    camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / Math.max(canvas.clientHeight, 1), 0.1, 180);
    scene.add(new THREE.HemisphereLight(0xc6eeee, 0x163648, 2.0));
    const sun = new THREE.DirectionalLight(0xfff4d8, 3.2); sun.position.set(-5, 9, 8); scene.add(sun);
    const fill = new THREE.DirectionalLight(0x63b9c8, 1.2); fill.position.set(6, -3, -6); scene.add(fill);
    const rim = new THREE.PointLight(0x9ee3da, 16, 14); rim.position.set(-1, -1.4, 3); scene.add(rim);
    water = createWater();
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load('/models/glhc002-buoy.glb', gltf => {
      buoy = gltf.scene;
      buoy.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; if (o.material) { o.material.side = THREE.DoubleSide; o.material.needsUpdate = true; } } });
      scene.add(buoy);
    }, undefined, () => activateFallback());
    frameId = requestAnimationFrame(frame);
  } catch { activateFallback(); }
}

function activateFallback() {
  failed = true;
  cancelAnimationFrame(frameId);
  if (renderer) renderer.dispose();
  renderer = null;
  motionToggle.checked = true;
  motionToggle.disabled = true;
  setStatic(true);
  stage.classList.add('webgl-failed');
  stage.dataset.panelVisible = 'true';
  stage.dataset.phase = 'fallback';
  document.querySelector('#stage-label').textContent = 'Static fallback';
  document.querySelector('#panel-one').setAttribute('aria-hidden', 'false');
  document.querySelector('#panel-two').setAttribute('aria-hidden', 'false');
  readout.dataset.render = 'FALLBACK';
  readout.dataset.phase = 'fallback';
  document.querySelector('#readout-render').textContent = 'STATIC FALLBACK';
  document.querySelector('#readout-phase').textContent = 'FALLBACK';
}

function resize() {
  if (!renderer || !camera) return;
  const w = Math.max(canvas.clientWidth, 1), h = Math.max(canvas.clientHeight, 1);
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}

function phaseFor(p) {
  if (p < STORY.crossStart) return ['surface', 'Surface view'];
  if (p < STORY.sensorPark) return ['crossing', 'Passing the waterline'];
  if (p <= STORY.panelEnd) return ['sensors', 'Beside the sensors'];
  return ['descent', 'Continuing below'];
}

function frame(now) {
  frameId = requestAnimationFrame(frame);
  const elapsed = now - lastFrame; lastFrame = now;
  const p = clamp((-track.getBoundingClientRect().top) / Math.max(track.offsetHeight - stage.offsetHeight, 1));
  const t = timelineAt(p), phase = phaseFor(p);
  const panelVisible = p >= STORY.sensorPark;
  stage.style.setProperty('--underwater', String(t.waterMix));
  stage.dataset.underwater = String(t.waterMix > 0.86);
  stage.dataset.panelVisible = String(panelVisible);
  stage.dataset.phase = phase[0];
  document.querySelector('#stage-label').textContent = phase[1];
  document.querySelector('#panel-track').style.transform = `translateX(${-t.panel * 50}%)`;
  document.querySelector('#panel-one').setAttribute('aria-hidden', String(t.panelIndex !== 0));
  document.querySelector('#panel-two').setAttribute('aria-hidden', String(t.panelIndex !== 1));
  const percentage = String(Math.round(p * 100)).padStart(2, '0');
  document.querySelector('#readout-progress').textContent = `${percentage}%`;
  document.querySelector('#readout-phase').textContent = phase[0].toUpperCase();
  readout.dataset.progress = p.toFixed(4);
  readout.dataset.phase = phase[0];
  readout.dataset.cameraParked = String(t.cameraParked);

  if (renderer && camera && !staticMode) {
    const time = now * 0.001;
    const bob = p < STORY.sensorPark ? Math.sin(time * 0.72) * 0.025 : Math.sin(time * 0.72) * 0.008;
    if (buoy) buoy.position.y += (bob - buoy.position.y) * 0.16;
    const targetX = innerWidth > 760 ? -1.4 : 0;
    const desired = new THREE.Vector3(targetX + t.cameraX, t.cameraY, t.cameraZ);
    const targetY = t.targetY - (innerWidth < 760 ? t.waterMix * 1.25 : 0);
    const target = new THREE.Vector3(targetX, targetY, 0);
    if (cameraInitialized) camera.position.lerp(desired, 0.095);
    else { camera.position.copy(desired); cameraInitialized = true; }
    camera.lookAt(target);
    scene.fog.color.set(new THREE.Color(0x315a60).lerp(new THREE.Color(0x0a2634), t.waterMix));
    scene.background = null;
    water.material.uniforms.uTime.value = time;
    water.material.uniforms.uUnder.value = t.waterMix;
    renderer.render(scene, camera);
    const waterline = new THREE.Vector3(0, 0, 0).project(camera);
    const waterlineTop = clamp((1 - waterline.y) * 50, -5, 105);
    document.querySelector('.water-glass').style.top = `${waterlineTop}%`;
    renderStats = { ms: elapsed, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
    readout.dataset.drawCalls = String(renderStats.calls);
    readout.dataset.triangles = String(renderStats.triangles);
    readout.dataset.frameMs = renderStats.ms.toFixed(2);
    if (now - reportAt > 400) {
      document.querySelector('#readout-render').textContent = `${renderStats.calls} CALLS · ${renderStats.triangles} TRI`;
      reportAt = now;
    }
  }
}

function setStatic(enabled) {
  if (failed && !enabled) return;
  staticMode = enabled;
  document.documentElement.classList.toggle('static-motion', enabled);
  if (enabled) {
    cancelAnimationFrame(frameId);
    stage.dataset.phase = 'static';
    stage.dataset.panelVisible = 'true';
    document.querySelector('#panel-one').setAttribute('aria-hidden', 'false');
    document.querySelector('#panel-two').setAttribute('aria-hidden', 'false');
    readout.dataset.phase = 'static';
    document.querySelector('#stage-label').textContent = 'Static reading view';
    document.querySelector('#readout-phase').textContent = 'STATIC';
  } else {
    if (failed) return;
    if (!renderer) startRenderer();
    else frameId = requestAnimationFrame(frame);
    lastFrame = performance.now();
  }
}

staticMode = motionToggle.checked;
setStatic(staticMode);
motionToggle.addEventListener('change', () => setStatic(motionToggle.checked));
canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); activateFallback(); }, { once: true });
window.addEventListener('resize', resize, { passive: true });
window.addEventListener('scroll', () => {}, { passive: true });
if (new URLSearchParams(location.search).has('fallback')) activateFallback();
else if (!staticMode) startRenderer();
