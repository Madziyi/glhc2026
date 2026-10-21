import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'meshoptimizer/decoder';
import { timelineAt, smooth, STORY } from './timeline.mjs';
import { MOTION_SPEED, surfaceHeightAt, rippleHeight, waveGLSL } from './waves.mjs';
import { storyAt } from '../glhc003/timeline.mjs';

const stage = document.querySelector('#stage');
const integrated = !!document.querySelector('#invitation');
const track = document.querySelector('#buoy-story') || document.querySelector('#story');
const canvas = document.querySelector('#buoy-canvas');
const motionToggle = document.querySelector('#reduce-motion');
const readout = document.querySelector('#scene-readout');
let chapterBounds;
let renderer, scene, camera, buoy, water, sun, fill, frameId, staticMode = false, failed = false, cameraInitialized = false;
let renderStats = { ms: 0, calls: 0, triangles: 0 };
let ready = false, shaderCompiled = false;
let shaderCompiledAt = null;
let onReadyCallback = () => {};
let onFallbackCallback = () => {};
let rendererGeneration = 0;
const navigationStart = performance.timeOrigin;
const timings = { sceneImportMs: null, modelMs: null, rendererShaderMs: null, firstFrameMs: null, readyMs: null, fallback: null };
let lastFrame = performance.now(), reportAt = 0;
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
let waveTime = 0;
let motionSpeed = MOTION_SPEED;
let sky, daylightEnvironment;
// Compare speed without changing wave amplitude or resetting the phase.
if (import.meta.env.DEV && new URLSearchParams(location.search).has('compare')) {
  const label = document.createElement('label');
  label.className = 'motion-compare';
  label.textContent = 'Motion ';
  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Water and buoy motion speed');
  for (const speed of [1, 1.25]) select.add(new Option(`${speed}\u00d7`, String(speed), false, speed === MOTION_SPEED));
  select.addEventListener('change', () => { motionSpeed = Number(select.value); });
  label.append(select);
  (document.querySelector('.prototype-bar') || document.querySelector('header')).append(label);
}

function sampleBuoySurface(time) {
  // The hull follows an area sample instead of a single point, so lift and
  // attitude respond to the slope under the flotation ring as it crosses waves.
  const radius = 1.18, step = 0.16;
  const heightAt = (x, z) => surfaceHeightAt(x, -z, time) + rippleHeight(x, -z, time);
  const center = heightAt(0, 0);
  const north = heightAt(0, -radius), south = heightAt(0, radius);
  const east = heightAt(radius, 0), west = heightAt(-radius, 0);
  const lift = center * 0.4 + (north + south + east + west) * 0.15;
  const slopeX = (heightAt(step, 0) - heightAt(-step, 0)) / (2 * step);
  const slopeZ = (heightAt(0, step) - heightAt(0, -step)) / (2 * step);
  return { lift, slopeX, slopeZ };
}

function createWater() {
  // A continuous grid concentrates resolution at the hull and expands offshore.
  // No overlapping transparent tiles, local patch seam, or extra water draw.
  const geo = new THREE.PlaneGeometry(2, 2, 128, 128);
  const vertices = geo.attributes.position;
  const expand = v => Math.sign(v) * .8 * (Math.exp(Math.abs(v) * Math.log(3126)) - 1);
  for (let i = 0; i < vertices.count; i++) vertices.setXY(i, expand(vertices.getX(i)), expand(vertices.getY(i)));
  geo.computeBoundingSphere();
  const mat = new THREE.ShaderMaterial({
    transparent: false, depthWrite: true, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uUnder: { value: 0 }, uWaveIntensity: { value: 1 }, uSlope: { value: new THREE.Vector2() }, uSunDirection: { value: new THREE.Vector3(-5, 9, 8).normalize() } },
      vertexShader: `
      uniform float uTime; uniform vec2 uSlope;
      varying vec3 vWorld; varying vec3 vNormal; varying float vWave; varying float vRippleFade;
      ${waveGLSL}
      vec3 heightAndGradient(vec2 p){
        float radius=length(p);
        float blend=smoothstep(30.,110.,radius);
        float a=p.x*.007+p.y*.011+uTime*.24, b=p.x*-.012+p.y*.006-uTime*.19;
        float distant=sin(a)*.12+sin(b)*.07;
        vec2 farGradient=cos(a)*.12*vec2(.007,.011)+cos(b)*.07*vec2(-.012,.006);
        float base=baseHeight(p,uTime);
        float blendT=clamp((radius-30.)/80.,0.,1.);
        vec2 blendGradient=6.*blendT*(1.-blendT)/80.*p/max(radius,.001);
        vec2 gradient=mix(baseGradient(p,uTime),farGradient,blend)+(distant-base)*blendGradient;
        float height=mix(base,distant,blend);
        if(radius<24.){
          height+=rippleHeight(p,uTime,uSlope);
          gradient+=vec2(
            rippleHeight(p+vec2(.035,0.),uTime,uSlope)-rippleHeight(p-vec2(.035,0.),uTime,uSlope),
            rippleHeight(p+vec2(0.,.035),uTime,uSlope)-rippleHeight(p-vec2(0.,.035),uTime,uSlope))/.07;
        }
        return vec3(height,gradient);
      }
      void main(){
        vec3 p=position;
        vec3 sampleWave=heightAndGradient(p.xy);
        float w=sampleWave.x, dx=sampleWave.y, dz=sampleWave.z;
        p.z+=w;
        vec4 world=modelMatrix*vec4(p,1.);
        vWorld=world.xyz;
        vNormal=normalize(mat3(modelMatrix)*vec3(-dx,-dz,1.));
        vWave=w;
        vRippleFade=1.-smoothstep(30.,110.,length(p.xy));
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
        float contact=smoothstep(1.12,1.5,radius)*exp(-max(radius-1.5,0.)*.5);
        float distantNormal=1.-smoothstep(25.,130.,length(cameraPosition.xz-vWorld.xz));
        vec3 n=normalize(vec3(vNormal.x*distantNormal+rippleNormal.x,vNormal.y,vNormal.z*distantNormal+rippleNormal.y));
        if(!gl_FrontFacing) n=-n;
        vec3 viewDir=normalize(cameraPosition-vWorld);
        float facing=max(dot(n,viewDir),0.);
        float fresnel=pow(1.-facing,5.);
        vec3 reflected=reflect(-normalize(uSunDirection),n);
        float sunGlint=pow(max(dot(reflected,viewDir),0.),64.);
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
        vec3 reflectionDir=reflect(-viewDir,n);
        vec3 horizonReflection=mix(vec3(.76,.86,.92),vec3(.055,.34,.68),smoothstep(.015,.28,reflectionDir.y));
        vec3 lakeTransmission=vec3(.09,.30,.34)+vec3(.035,.075,.075)*shimmer;
        vec3 underwaterHaze=vec3(.045,.17,.21);
        vec3 underside=underwaterHaze+vec3(.09,.12,.12)*fresnel+vec3(.025,.04,.035)*caustic;
        vec3 surface=mix(lakeTransmission,horizonReflection,fresnel*.76)+shimmer*.055+sunGlint*.45+contactHighlight*.08;
        vec3 col=mix(surface,underside,uUnder);
        float underwaterDistance=distance(cameraPosition,vWorld);
        float horizonHaze=smoothstep(2.,26.,underwaterDistance)*uUnder*.98;
        col=mix(col,underwaterHaze,horizonHaze);
        col+=vec3(.006,.009,.01)*shimmer*horizonHaze;
        float distanceHaze=1.-exp(-length(cameraPosition.xz-vWorld.xz)*.0024);
        col=mix(col,mix(vec3(.76,.86,.92),underwaterHaze,uUnder),distanceHaze);
        gl_FragColor=vec4(col,1.);
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0;
  mesh.renderOrder = 2;
  scene.add(mesh);

  return [mesh];
}

function createSky() {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { uUnder: { value: 0 }, uTime: { value: 0 } },
    vertexShader: `varying vec3 vDirection; void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform float uUnder; uniform float uTime; varying vec3 vDirection;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){
        vec2 cell=floor(p), f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(hash(cell),hash(cell+vec2(1.,0.)),f.x),
          mix(hash(cell+vec2(0.,1.)),hash(cell+vec2(1.,1.)),f.x),f.y);
      }
      void main(){vec3 d=normalize(vDirection);
        vec3 air=mix(vec3(.76,.86,.92),vec3(.055,.34,.68),smoothstep(.015,.28,d.y));
        // Soft cumulus forms use three inexpensive noise octaves in this sky draw.
        vec2 p=d.xz/max(d.y,.025)*.7+vec2(uTime*.003,0.);
        float clouds=noise(p)*.57+noise(p*2.03+7.1)*.29+noise(p*4.07+19.3)*.14;
        float edge=max(fwidth(clouds),.025);
        float coverage=smoothstep(.55-edge,.69+edge,clouds)*smoothstep(.02,.065,d.y);
        vec3 cloudLight=mix(vec3(.72,.81,.87),vec3(1.,.99,.95),smoothstep(.54,.78,clouds));
        air=mix(air,cloudLight,coverage*.92);
        float glow=pow(max(dot(d,normalize(vec3(-5.,9.,8.))),0.),32.);
        float horizonLight=exp(-abs(d.y)*18.);
        air+=vec3(.25,.21,.12)*glow+vec3(.035,.025,.005)*horizonLight;
        gl_FragColor=vec4(mix(air,vec3(.045,.17,.21),uUnder),1.);
      }`,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(2800,16,8),material);
  dome.renderOrder=-1;
  scene.add(dome);
  return dome;
}

function createDaylightEnvironment() {
  // Tiny generated daylight map supplies silver/glass reflections. It is baked
  // once at startup; there is no per-frame scene reflection or added scene draw.
  const width = 128, height = 64, pixels = new Uint8Array(width * height * 4);
  const color = new THREE.Color();
  const horizon = new THREE.Color(.76,.86,.92), blue = new THREE.Color(.18,.44,.72);
  const lake = new THREE.Color(.09,.30,.34);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const elevation = Math.sin(((y + .5) / height - .5) * Math.PI);
    color.copy(horizon).lerp(elevation > 0 ? blue : lake, Math.abs(elevation) * .85);
    const azimuth = (x + .5) / width * Math.PI * 2;
    const glow = Math.exp(-((azimuth - 2.12) ** 2) * 8 - ((elevation - .69) ** 2) * 14);
    color.r += glow * .22; color.g += glow * .19; color.b += glow * .12;
    color.convertLinearToSRGB();
    const i = (y * width + x) * 4;
    pixels[i] = Math.min(255, Math.round(color.r * 255));
    pixels[i+1] = Math.min(255, Math.round(color.g * 255));
    pixels[i+2] = Math.min(255, Math.round(color.b * 255)); pixels[i+3] = 255;
  }
  const texture = new THREE.DataTexture(pixels,width,height);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function refineBuoyMaterial(material) {
  // Presentation overrides preserve the approved GLB geometry and source asset.
  const originalColor = material.color.clone();
  const originalRoughness = material.roughness, originalMetalness = material.metalness;
  if (material.name === 'Powder-coated charcoal frame') {
    material.color.setRGB(.52,.59,.63); material.metalness = .65; material.roughness = .32;
  } else if (material.name === 'Brushed marine stainless steel') {
    material.color.setRGB(.69,.76,.79); material.metalness = .78; material.roughness = .28;
  } else if (material.name === 'Blue-black photovoltaic glass') {
    material.color.setRGB(.035,.085,.16); material.metalness = .38; material.roughness = .20;
  } else if (material.name === 'Marine fasteners and fittings') {
    material.color.setRGB(.37,.44,.48); material.metalness = .7;
  }
  const daylightFinish = ['Powder-coated charcoal frame', 'Brushed marine stainless steel',
    'Blue-black photovoltaic glass', 'Marine fasteners and fittings'].includes(material.name);
  material.envMap = daylightFinish ? daylightEnvironment : null;
  material.envMapIntensity = daylightFinish ? .85 : 0;
  if (['Brushed marine stainless steel', 'Marine fasteners and fittings'].includes(material.name)) {
    // These GLB batches include both upper fittings and submerged instruments.
    // Restore their original submerged finish without splitting approved geometry.
    material.onBeforeCompile = shader => {
      shader.uniforms.uOriginalFinishColor = { value: originalColor };
      shader.uniforms.uOriginalFinishRoughness = { value: originalRoughness };
      shader.uniforms.uOriginalFinishMetalness = { value: originalMetalness };
      shader.vertexShader = 'varying float vBuoyFinishHeight;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>',
        'vBuoyFinishHeight=(modelMatrix*vec4(transformed,1.)).y;\n#include <project_vertex>');
      shader.fragmentShader = 'varying float vBuoyFinishHeight;\nuniform vec3 uOriginalFinishColor;\nuniform float uOriginalFinishRoughness;\nuniform float uOriginalFinishMetalness;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );',
        'vec4 diffuseColor=vec4(mix(uOriginalFinishColor,diffuse,smoothstep(-.35,.45,vBuoyFinishHeight)),opacity);');
      shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>',
        '#include <roughnessmap_fragment>\nroughnessFactor=mix(uOriginalFinishRoughness,roughnessFactor,smoothstep(-.35,.45,vBuoyFinishHeight));');
      shader.fragmentShader = shader.fragmentShader.replace('#include <metalnessmap_fragment>',
        '#include <metalnessmap_fragment>\nmetalnessFactor=mix(uOriginalFinishMetalness,metalnessFactor,smoothstep(-.35,.45,vBuoyFinishHeight));');
      shader.fragmentShader = shader.fragmentShader.replace('#include <envmap_physical_pars_fragment>',
        THREE.ShaderChunk.envmap_physical_pars_fragment.replaceAll('envMapIntensity',
          '(envMapIntensity*smoothstep(-.35,.45,vBuoyFinishHeight))'));
    };
    material.customProgramCacheKey = () => 'glhc002-upper-metal-daylight-v1';
  }
  material.side = THREE.DoubleSide;
  material.needsUpdate = true;
}

function startRenderer() {
  if (renderer || staticMode || failed) return;
  const generation = ++rendererGeneration;
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
    daylightEnvironment = createDaylightEnvironment();
    scene.fog = new THREE.FogExp2(0x8ba09b, 0.006);
    camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / Math.max(canvas.clientHeight, 1), 0.1, 6000);
    scene.add(new THREE.HemisphereLight(0xd7e1d7, 0x18303a, 1.35));
    sun = new THREE.DirectionalLight(0xfff0d6, 2.15); sun.position.set(-5, 9, 8); scene.add(sun);
    fill = new THREE.DirectionalLight(0x79a6a5, 0.62); fill.position.set(6, -3, -6); scene.add(fill);
    const rim = new THREE.PointLight(0xa8c9bb, 4.5, 14); rim.position.set(-1, -1.4, 3); scene.add(rim);
    sky = createSky();
    water = createWater();
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    const modelStarted = performance.now();
    loader.load('/models/glhc002-buoy.glb', gltf => {
      if (generation !== rendererGeneration) return;
      timings.modelMs = performance.now() - modelStarted;
      readout.dataset.modelLoadMs = timings.modelMs.toFixed(1);
      buoy = gltf.scene;
      buoy.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; if (o.material) refineBuoyMaterial(o.material); } });
      scene.add(buoy);
    }, undefined, error => {
      if (generation === rendererGeneration) activateFallback(error?.message ?? 'Buoy model failed to load');
    });
    frameId = requestAnimationFrame(frame);
  } catch (error) { activateFallback(error?.message ?? 'Renderer initialization failed'); }
}

function activateFallback(reason = 'WebGL initialization failed') {
  failed = true;
  rendererGeneration++;
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
  onFallbackCallback(reason);
}

function resize() {
  chapterBounds = undefined;
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
  const p = integrated ? 0 : clamp((-track.getBoundingClientRect().top) / Math.max(track.offsetHeight - stage.offsetHeight, 1));
  const t = integrated ? integratedState() : timelineAt(p);
  const phase = integrated ? [t.phase, t.phase] : phaseFor(p);
  const panelVisible = integrated ? t.panelVisible : p >= STORY.sensorPark;
  stage.style.setProperty('--underwater', String(t.waterMix));
  stage.dataset.underwater = String(t.waterMix > 0.86);
  stage.dataset.panelVisible = String(panelVisible);
  stage.dataset.phase = phase[0];
  document.querySelector('#stage-label').textContent = phase[1];
  const panelTrack = document.querySelector('#panel-track');
  panelTrack.style.transform = `translateX(${-t.panel * 50}%)`;
  panelTrack.style.setProperty('--panel-progress', String(t.panel));
  document.querySelector('#panel-one').setAttribute('aria-hidden', String(!integrated && t.panelIndex !== 0));
  document.querySelector('#panel-two').setAttribute('aria-hidden', String(!integrated && t.panelIndex !== 1));
  const percentage = String(Math.round(t.progress * 100)).padStart(2, '0');
  document.querySelector('#readout-progress').textContent = `${percentage}%`;
  document.querySelector('#readout-phase').textContent = phase[0].toUpperCase();
  readout.dataset.progress = t.progress.toFixed(4);
  readout.dataset.phase = phase[0];
  readout.dataset.cameraParked = String(t.cameraParked);
  readout.dataset.panelProgress = t.panel.toFixed(4);

  if (renderer && camera && !staticMode) {
    const delta = document.hidden ? 0 : Math.max(elapsed, 0) * 0.001;
    waveTime += delta * motionSpeed;
    const time = waveTime;
    readout.dataset.motionSpeed = String(motionSpeed);
    const buoyDamping = 1 - Math.exp(-5.2 * delta);
    const rotationDamping = 1 - Math.exp(-3.8 * delta);
    if (buoy) {
      const { lift, slopeX, slopeZ } = sampleBuoySurface(time);
      water[0].material.uniforms.uSlope.value.set(slopeX, -slopeZ);
      buoy.position.y += (lift - buoy.position.y) * buoyDamping;
      // Follow the changing wave plane gently; the amplitude comes from the
      // existing overlapping lake waves, while damping removes mechanical snap.
      buoy.rotation.z += (Math.atan(slopeX) * 0.72 - buoy.rotation.z) * rotationDamping;
      buoy.rotation.x += (-Math.atan(slopeZ) * 0.72 - buoy.rotation.x) * rotationDamping;
    }
    const targetX = innerWidth > 760 ? (integrated ? 2.8 : -1.4) : 0;
    const sensorProgress = integrated ? t.sensorProgress : smooth(STORY.crossStart, STORY.sensorPark, p);
    const sensorPullback = (innerWidth < 760 ? 3.1 : 4.0) * sensorProgress;
    const desired = new THREE.Vector3(targetX + t.cameraX, t.cameraY, t.cameraZ - sensorPullback);
    const mobileSurfaceOffset = integrated && innerWidth < 760 ? 1.4 * (1 - sensorProgress) : 0;
    const targetY = t.targetY + mobileSurfaceOffset + 0.55 * sensorProgress - (innerWidth < 760 ? t.waterMix * (integrated ? 2.0 : 0.3) : 0);
    const target = new THREE.Vector3(targetX, targetY, 0);
    if (cameraInitialized) camera.position.lerp(desired, integrated ? 1 - Math.exp(-8 * delta) : 0.095);
    else { camera.position.copy(desired); cameraInitialized = true; }
    camera.lookAt(target);
    if (integrated) {
      readout.dataset.cameraY = camera.position.y.toFixed(3);
      readout.dataset.targetY = targetY.toFixed(3);
      // Once physically well below the instrument assembly, omit its distant
      // silhouette from the final open-water chapter (including the mooring line).
      if (buoy) buoy.visible = t.departure < .72;
      readout.dataset.buoyVisible = String(buoy?.visible ?? false);
    }
    scene.fog.color.copy(new THREE.Color(0x91a49e).lerp(new THREE.Color(0x17414a), t.waterMix));
    scene.fog.density = THREE.MathUtils.lerp(0.006, 0.024, t.waterMix);
    sun.intensity = THREE.MathUtils.lerp(2.15, 1.45, t.waterMix);
    fill.intensity = THREE.MathUtils.lerp(0.62, 0.82, t.waterMix);
    scene.background = null;
    const cameraSurface=surfaceHeightAt(camera.position.x,-camera.position.z,time);
    const immersion=1-smooth(-.22,.22,camera.position.y-cameraSurface);
    sky.position.copy(camera.position);
    sky.material.uniforms.uUnder.value=immersion;
    sky.material.uniforms.uTime.value=time;
    for (const surface of water) {
      surface.material.uniforms.uTime.value = time;
      surface.material.uniforms.uUnder.value = immersion;
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

function integratedState() {
  if (!chapterBounds) {
    const top = id => document.getElementById(id).getBoundingClientRect().top + scrollY;
    const science = document.getElementById('science'), scienceTop = top('science');
    chapterBounds = {
      surface: top('surface'), crossing: top('crossing'), science: scienceTop,
      scienceEnd: scienceTop + Math.max(science.offsetHeight - innerHeight, 1),
      registration: top('registration'),
    };
  }
  return storyAt(scrollY, chapterBounds);
}

function setStatic(enabled) {
  if (failed && !enabled) return;
  staticMode = enabled;
  chapterBounds = undefined;
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
  if (renderer) renderer.dispose();
  renderer = null;
  buoy = null;
  cancelAnimationFrame(frameId);
  failed = false;
  ready = false;
  shaderCompiled = false;
  staticMode = false;
  document.documentElement.classList.remove('static-motion');
  stage.classList.remove('webgl-failed');
  motionToggle.disabled = false;
  motionToggle.checked = false;
  startRenderer();
}
export function pauseScene() { setStatic(true); }
window.addEventListener('resize', resize, { passive: true });
if (integrated) {
  // Intrinsic image dimensions keep initial layout stable; invalidate for actual
  // responsive/content-size changes rather than forcing layout every frame.
  const layoutObserver = new ResizeObserver(() => { chapterBounds = undefined; });
  layoutObserver.observe(track);
  window.addEventListener('load', () => { chapterBounds = undefined; }, { once: true });
}
document.addEventListener('visibilitychange', () => { lastFrame = performance.now(); });
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
export function onSceneFallback(callback) {
  onFallbackCallback = callback;
  if (failed) callback(timings.fallback);
}
