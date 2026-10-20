import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'meshoptimizer/decoder';
import { timelineAt, smooth, STORY } from './timeline.mjs';

const stage = document.querySelector('#stage');
const track = document.querySelector('#buoy-story');
const canvas = document.querySelector('#buoy-canvas');
const motionToggle = document.querySelector('#reduce-motion');
const readout = document.querySelector('#scene-readout');
let renderer, scene, camera, buoy, water, sun, fill, frameId, staticMode = false, failed = false, cameraInitialized = false;
let renderStats = { ms: 0, calls: 0, triangles: 0 };
let ready = false, shaderCompiled = false;
let shaderCompiledAt = null;
let onReadyCallback = () => {};
const navigationStart = performance.timeOrigin;
const timings = { sceneImportMs: null, modelMs: null, rendererShaderMs: null, firstFrameMs: null, readyMs: null, fallback: null };
let lastFrame = performance.now(), reportAt = 0;
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const surfaceHeightAt = (x, z, time) =>
  Math.sin(x * 0.045 + z * 0.035 + time * 0.24) * 0.16
  + Math.sin(x * -0.028 + z * 0.061 - time * 0.19) * 0.09
  + Math.sin(x * 0.16 + z * 0.11 + time * 0.34) * 0.081
  + Math.sin(x * -0.09 + z * 0.21 - time * 0.23) * 0.0432
  + Math.sin(x * 0.55 + z * -0.43 + time * 0.48) * 0.0144
  + Math.sin(x * 0.85 + z * 0.7 - time * 0.31) * 0.0072
  + Math.sin(x * 0.22 - z * 0.19 + time * 0.16) * 0.006
  + Math.sin(x * -0.31 - z * 0.12 - time * 0.21) * 0.004
  + Math.sin(x * 0.34 - z * 0.17 + time * 0.82) * 0.012
  + Math.sin(x * -0.28 - z * 0.43 - time * 0.67) * 0.008;

function sampleBuoySurface(time) {
  // The hull follows an area sample instead of a single point, so lift and
  // attitude respond to the slope under the flotation ring as it crosses waves.
  const radius = 1.18, step = 0.16;
  const heightAt = (x, z) => surfaceHeightAt(x, -z, time);
  const center = heightAt(0, 0);
  const north = heightAt(0, -radius), south = heightAt(0, radius);
  const east = heightAt(radius, 0), west = heightAt(-radius, 0);
  const lift = center * 0.4 + (north + south + east + west) * 0.15;
  const slopeX = (heightAt(step, 0) - heightAt(-step, 0)) / (2 * step);
  const slopeZ = (heightAt(0, step) - heightAt(0, -step)) / (2 * step);
  return { lift, slopeX, slopeZ };
}

function createWater() {
  const geo = new THREE.PlaneGeometry(120, 120, 128, 128);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: true, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uUnder: { value: 0 }, uWaveIntensity: { value: 1 }, uFar: { value: 0 }, uSunDirection: { value: new THREE.Vector3(-5, 9, 8).normalize() } },
      vertexShader: `
      uniform float uTime; uniform float uWaveIntensity; uniform float uFar; varying vec3 vWorld; varying vec3 vNormal; varying float vWave; varying float vRippleFade;
      void main(){
        vec3 p=position; float x=p.x, z=p.y;
        float a=x*.16+z*.11+uTime*.34;
        float b=x*-.09+z*.21-uTime*.23;
        float c=x*.55-z*.43+uTime*.48;
        float d=x*.85+z*.7-uTime*.31;
        float e=x*.22-z*.19+uTime*.16;
        float f=x*-.31-z*.12-uTime*.21;
        float g=x*.045+z*.035+uTime*.24;
        float h=x*-.028+z*.061-uTime*.19;
        float i=x*.34-z*.17+uTime*.82;
        float j=x*-.28-z*.43-uTime*.67;
        float base=sin(g)*.16+sin(h)*.09+sin(a)*.081+sin(b)*.0432+sin(c)*.0144+sin(d)*.0072+sin(e)*.006+sin(f)*.004+sin(i)*.012+sin(j)*.008;
        float baseDx=cos(g)*.045*.16-cos(h)*.028*.09+cos(a)*.16*.081-cos(b)*.09*.0432+cos(c)*.55*.0144+cos(d)*.85*.0072+cos(e)*.22*.006-cos(f)*.31*.004+cos(i)*.34*.012-cos(j)*.28*.008;
        float baseDz=cos(g)*.035*.16+cos(h)*.061*.09+cos(a)*.11*.081+cos(b)*.21*.0432-cos(c)*.43*.0144+cos(d)*.7*.0072-cos(e)*.19*.006-cos(f)*.12*.004-cos(i)*.17*.012-cos(j)*.43*.008;
        float edge=max(abs(x),abs(z));
        float edgeT=clamp((edge-42.)/18.,0.,1.);
        float edgeFade=1.-edgeT*edgeT*(3.-2.*edgeT);
        float edgeSlope=edgeT>0.&&edgeT<1.?-6.*edgeT*(1.-edgeT)/18.:0.;
        float edgeDx=abs(x)>=abs(z)?sign(x)*edgeSlope:0.;
        float edgeDz=abs(z)>abs(x)?sign(z)*edgeSlope:0.;
        float farA=x*.0011+z*.0007+uTime*.08;
        float farB=x*-.0008+z*.0013-uTime*.06;
        float farC=(x+z)*.0022+uTime*.04;
        float farBase=sin(farA)*.14+sin(farB)*.08+sin(farC)*.035;
        float farDx=cos(farA)*.0011*.14-cos(farB)*.0008*.08+cos(farC)*.0022*.035;
        float farDz=cos(farA)*.0007*.14+cos(farB)*.0013*.08+cos(farC)*.0022*.035;
        float farT=clamp((edge-60.)/120.,0.,1.);
        float farFade=farT*farT*(3.-2.*farT);
        float farSlope=farT>0.&&farT<1.?6.*farT*(1.-farT)/120.:0.;
        float farDxEdge=abs(x)>=abs(z)?sign(x)*farSlope:0.;
        float farDzEdge=abs(z)>abs(x)?sign(z)*farSlope:0.;
        float w=mix(base*uWaveIntensity*edgeFade,farBase*farFade,uFar);
        float dx=mix(uWaveIntensity*(baseDx*edgeFade+base*edgeDx),(farDx*farFade+farBase*farDxEdge),uFar);
        float dz=mix(uWaveIntensity*(baseDz*edgeFade+base*edgeDz),(farDz*farFade+farBase*farDzEdge),uFar);
        p.z+=w;
        vec4 world=modelMatrix*vec4(p,1.);
        vWorld=world.xyz;
        vNormal=normalize(mat3(modelMatrix)*vec3(-dx,-dz,1.));
        vWave=w;
        vRippleFade=mix(edgeFade,farFade,uFar);
        gl_Position=projectionMatrix*viewMatrix*world;
      }
    `,
    fragmentShader: `
      uniform float uTime; uniform float uUnder; uniform float uWaveIntensity; uniform vec3 uSunDirection;
      varying vec3 vWorld; varying vec3 vNormal; varying float vWave; varying float vRippleFade;
      void main(){
        float radius=length(vWorld.xz);
        vec2 rippleNormal=vec2(
          cos(vWorld.x*.72+vWorld.z*.48+uTime*.58)*.024+cos(vWorld.x*.31-vWorld.z*.69-uTime*.27)*.017,
          sin(vWorld.x*.51-vWorld.z*.62+uTime*.43)*.023+sin(vWorld.x*.82+vWorld.z*.37-uTime*.32)*.014
        )*uWaveIntensity*vRippleFade;
        // A small, buoy-centered ring field borrows the reference's interactive
        // ripples without a heightfield simulation or extra render pass.
        float bobPhase=sin(uTime*.72);
        float angle=atan(vWorld.z,vWorld.x);
        float uneven=sin(angle*3.+uTime*.29)*.11+sin(angle*5.-uTime*.21)*.055;
        float ringRadius=radius*(1.+uneven);
        float ringA=cos(ringRadius*5.4-uTime*2.55+bobPhase*.28+sin(angle*2.3+uTime*.31)*.12);
        float ringB=cos(ringRadius*8.1-uTime*1.82+sin(angle*2.+uTime*.25)*.17);
        float ringFade=smoothstep(.3,.62,radius)*exp(-max(radius-.64,0.)*.83)*vRippleFade;
        vec2 ringNormal=normalize(vWorld.xz+vec2(.0001))*(ringA*.074+ringB*.027)*ringFade;
        float contact=smoothstep(.22,.62,radius)*(1.-smoothstep(.82,1.42,radius))*vRippleFade;
        vec3 n=normalize(vec3(vNormal.x*2.8+rippleNormal.x+ringNormal.x,vNormal.y,vNormal.z*2.8+rippleNormal.y+ringNormal.y));
        vec3 viewDir=normalize(cameraPosition-vWorld);
        float facing=max(dot(n,viewDir),0.);
        float fresnel=pow(1.-facing,5.);
        vec3 reflected=reflect(-normalize(uSunDirection),n);
        float sunGlint=pow(max(dot(reflected,viewDir),0.),34.);
        float contactHighlight=pow(max(dot(reflected,viewDir),0.),28.)*contact;
        float broadA=sin(vWorld.x*.11+vWorld.z*.17+sin(vWorld.z*.07-uTime*.12)*.7+uTime*.18);
        float broadB=sin(vWorld.x*-.15+vWorld.z*.23+sin(vWorld.x*.06+uTime*.09)*.5-uTime*.15);
        float fineA=sin(vWorld.x*.43-vWorld.z*.31+sin(vWorld.x*.11+vWorld.z*.09)*.4-uTime*.28);
        float fineB=sin(vWorld.x*.22+vWorld.z*.39+sin(vWorld.z*.13-vWorld.x*.04)*.35+uTime*.24);
        float shimmer=smoothstep(.26,.9,(broadA+broadB)*.19+(fineA+fineB)*.13+fresnel*.30+sunGlint*.16+contactHighlight*.22);
        // Soft animated interference suggests underwater caustics while keeping
        // the lake dark and avoiding the reference demo's costly ray tracing.
        float causticA=sin(vWorld.x*1.6+sin(vWorld.z*1.3+uTime*.45)*.8+uTime*.32);
        float causticB=sin(vWorld.z*1.9-sin(vWorld.x*1.1-uTime*.38)*.6-uTime*.27);
        float caustic=pow(max(causticA*causticB,0.),7.)*uUnder;
        vec3 horizonReflection=vec3(.32,.43,.40)+vec3(.25,.29,.24)*fresnel;
        vec3 lakeTransmission=vec3(.19,.33,.36)+vec3(.025,.055,.055)*shimmer;
        vec3 underwaterHaze=vec3(.045,.17,.21);
        vec3 underside=underwaterHaze+vec3(.09,.12,.12)*fresnel+vec3(.025,.04,.035)*caustic;
        vec3 surface=mix(lakeTransmission,horizonReflection,fresnel*.76)+shimmer*.055+sunGlint*.16+contactHighlight*.055;
        vec3 col=mix(surface,underside,uUnder);
        float underwaterDistance=distance(cameraPosition,vWorld);
        float horizonHaze=smoothstep(2.,26.,underwaterDistance)*uUnder*.98;
        col=mix(col,underwaterHaze,horizonHaze);
        // Keep the surface legible overhead while using more body and lower
        // color contrast below the lake plane to dissolve the photo-horizon edge.
        float underwaterAlpha=.77+fresnel*.16;
        float alpha=mix(.78+fresnel*.08,underwaterAlpha,uUnder)+sunGlint*.035;
        // Let the distant underwater surface dissolve into the CSS lake haze;
        // this removes the hard projected edge while preserving near overhead waves.
        alpha*=1.-horizonHaze*.72;
        col+=vec3(.006,.009,.01)*shimmer*horizonHaze;
        gl_FragColor=vec4(col,clamp(alpha,.04,.96));
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0;
  mesh.renderOrder = 2;
  scene.add(mesh);

  // A single flat low-poly annulus continues the lake to the horizon. The
  // detailed grid tapers to its plane edge so the join does not form a seam.
  const half = 2500, edge = 58;
  const tiles = [
    [-half, half, edge, half], [-half, half, -half, -edge],
    [-half, -edge, -edge, edge], [edge, half, -edge, edge],
  ];
  const positions = [], indices = [];
  for (const [x0, x1, z0, z1] of tiles) {
    const sx = Math.max(1, Math.ceil((x1 - x0) / 120));
    const sz = Math.max(1, Math.ceil((z1 - z0) / 120));
    const start = positions.length / 3;
    for (let row = 0; row <= sz; row++) for (let col = 0; col <= sx; col++) {
      positions.push(x0 + (x1 - x0) * col / sx, z0 + (z1 - z0) * row / sz, 0);
    }
    for (let row = 0; row < sz; row++) for (let col = 0; col < sx; col++) {
      const a = start + row * (sx + 1) + col, b = a + 1, d = a + sx + 1, c = d + 1;
      indices.push(a,b,c, a,c,d);
    }
  }
  const farGeo = new THREE.BufferGeometry();
  farGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  farGeo.setIndex(indices);
  const farMat = mat.clone();
  farMat.uniforms = THREE.UniformsUtils.clone(mat.uniforms);
  farMat.uniforms.uWaveIntensity.value = 0;
  farMat.uniforms.uFar.value = 1;
  const farMesh = new THREE.Mesh(farGeo, farMat);
  farMesh.rotation.x = -Math.PI / 2;
  // Slight overlap avoids a sub-pixel crack between two coplanar water meshes.
  farMesh.position.y = 0.006;
  farMesh.renderOrder = 1;
  scene.add(farMesh);
  return [farMesh, mesh];
}

function startRenderer() {
  if (renderer || staticMode || failed) return;
  try {
    const loading = document.querySelector('#scene-loading');
    loading.hidden = false;
    document.querySelector('#loading-label').textContent = 'Preparing the 3D scene…';
    document.querySelector('#scene-retry').hidden = true;
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.35 : 1.7));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    cameraInitialized = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x8ba09b, 0.006);
    camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / Math.max(canvas.clientHeight, 1), 0.1, 180);
    scene.add(new THREE.HemisphereLight(0xd7e1d7, 0x18303a, 1.35));
    sun = new THREE.DirectionalLight(0xfff0d6, 2.15); sun.position.set(-5, 9, 8); scene.add(sun);
    fill = new THREE.DirectionalLight(0x79a6a5, 0.62); fill.position.set(6, -3, -6); scene.add(fill);
    const rim = new THREE.PointLight(0xa8c9bb, 4.5, 14); rim.position.set(-1, -1.4, 3); scene.add(rim);
    water = createWater();
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    const modelStarted = performance.now();
    loader.load('/models/glhc002-buoy.glb', gltf => {
      timings.modelMs = performance.now() - modelStarted;
      readout.dataset.modelLoadMs = timings.modelMs.toFixed(1);
      buoy = gltf.scene;
      buoy.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; if (o.material) { o.material.side = THREE.DoubleSide; o.material.needsUpdate = true; } } });
      scene.add(buoy);
    }, undefined, error => activateFallback(error?.message ?? 'Buoy model failed to load'));
    frameId = requestAnimationFrame(frame);
  } catch (error) { activateFallback(error?.message ?? 'Renderer initialization failed'); }
}

function activateFallback(reason = 'WebGL initialization failed') {
  failed = true;
  timings.fallback = reason;
  reportTimings('fallback');
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
  document.querySelector('#scene-loading').hidden = false;
  document.querySelector('#loading-label').textContent = 'The 3D view is unavailable. The full story remains readable.';
  document.querySelector('#scene-retry').hidden = false;
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
  stage.style.setProperty('--surface-image-opacity', String((1 - t.waterMix) ** 7));
  stage.dataset.underwater = String(t.waterMix > 0.86);
  stage.dataset.panelVisible = String(panelVisible);
  stage.dataset.phase = phase[0];
  document.querySelector('#stage-label').textContent = phase[1];
  const panelTrack = document.querySelector('#panel-track');
  panelTrack.style.transform = `translateX(${-t.panel * 50}%)`;
  panelTrack.style.setProperty('--panel-progress', String(t.panel));
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
    const delta = Math.min(Math.max(elapsed, 0), 50) * 0.001;
    const buoyDamping = 1 - Math.exp(-5.2 * delta);
    const rotationDamping = 1 - Math.exp(-3.8 * delta);
    if (buoy) {
      const { lift, slopeX, slopeZ } = sampleBuoySurface(time);
      buoy.position.y += (lift - buoy.position.y) * buoyDamping;
      // Follow the changing wave plane gently; the amplitude comes from the
      // existing overlapping lake waves, while damping removes mechanical snap.
      buoy.rotation.z += (Math.atan(slopeX) * 0.72 - buoy.rotation.z) * rotationDamping;
      buoy.rotation.x += (-Math.atan(slopeZ) * 0.72 - buoy.rotation.x) * rotationDamping;
    }
    const targetX = innerWidth > 760 ? -1.4 : 0;
    const sensorProgress = smooth(STORY.crossStart, STORY.sensorPark, p);
    const sensorPullback = (innerWidth < 760 ? 3.1 : 4.0) * sensorProgress;
    const desired = new THREE.Vector3(targetX + t.cameraX, t.cameraY, t.cameraZ - sensorPullback);
    const targetY = t.targetY + 0.55 * sensorProgress - (innerWidth < 760 ? t.waterMix * 0.3 : 0);
    const target = new THREE.Vector3(targetX, targetY, 0);
    if (cameraInitialized) camera.position.lerp(desired, 0.095);
    else { camera.position.copy(desired); cameraInitialized = true; }
    camera.lookAt(target);
    scene.fog.color.copy(new THREE.Color(0x91a49e).lerp(new THREE.Color(0x17414a), t.waterMix));
    scene.fog.density = THREE.MathUtils.lerp(0.006, 0.024, t.waterMix);
    sun.intensity = THREE.MathUtils.lerp(2.15, 1.45, t.waterMix);
    fill.intensity = THREE.MathUtils.lerp(0.62, 0.82, t.waterMix);
    scene.background = null;
    for (const surface of water) {
      surface.material.uniforms.uTime.value = time;
      surface.material.uniforms.uUnder.value = t.waterMix;
    }
    try {
      const compileStarted = performance.now();
      if (!ready && buoy && !shaderCompiled) {
        renderer.compile(scene, camera);
        shaderCompiledAt = performance.now();
        shaderCompiled = true;
      }
      renderer.render(scene, camera);
      if (!ready && buoy) {
        timings.rendererShaderMs = shaderCompiledAt === null ? null : shaderCompiledAt - compileStarted;
        timings.firstFrameMs = performance.now();
        timings.readyMs = performance.now();
        ready = true;
        readout.dataset.sceneReadyMs = timings.readyMs.toFixed(1);
        readout.dataset.rendererShaderMs = timings.rendererShaderMs?.toFixed(1) ?? '';
        readout.dataset.firstFrameMs = timings.firstFrameMs.toFixed(1);
        document.querySelector('#scene-loading').hidden = true;
        document.querySelector('#scene-retry').hidden = true;
        document.documentElement.classList.remove('scene-pending');
        onReadyCallback();
        reportTimings('ready');
      }
    }
    catch (error) { activateFallback(error?.message ?? 'Scene rendering failed'); return; }
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
/* Restart is exposed to the lightweight bootstrap for its visible retry button. */
export function retryScene() {
  failed = false;
  ready = false;
  shaderCompiled = false;
  staticMode = false;
  document.documentElement.classList.remove('static-motion');
  stage.classList.remove('webgl-failed');
  startRenderer();
}
window.addEventListener('resize', resize, { passive: true });
window.addEventListener('scroll', () => {}, { passive: true });
function reportTimings(outcome) {
  if (!import.meta.env.DEV) return;
  const resources = performance.getEntriesByType('resource');
  const modelResource = resources.find(item => item.name.includes('glhc002-buoy.glb'));
  console.info('[GLHC scene timing]', {
    cache: modelResource ? (modelResource.transferSize === 0 ? 'warm-cache' : 'cold/network') : 'resource-timing-unavailable',
    navigationStartEpochMs: navigationStart,
    sceneModuleMs: Number(document.documentElement.dataset.sceneModuleMs) || null,
    modelDownloadAndDecodeMs: timings.modelMs,
    modelTransferBytes: modelResource?.transferSize ?? null,
    rendererAndShaderInitMs: timings.rendererShaderMs,
    firstUsableFrameMs: timings.firstFrameMs,
    interactiveReadyMs: timings.readyMs,
    outcome,
    error: timings.fallback,
  });
}

if (new URLSearchParams(location.search).has('fallback')) activateFallback('Forced fallback preview');
else if (!staticMode) startRenderer();

export function onSceneReady(callback) {
  onReadyCallback = callback;
  if (ready) callback();
}
