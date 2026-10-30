import * as THREE from 'three';
import {waveGLSL} from '../../src/scripts/glhc002/waves.mjs';

// Reviewed defaults are preserved; opt-in film mode adds denser surface/reflection inputs.
export function createOpeningEnvironment(scene,{production=false}={}){
function createWater() {
  // A continuous grid concentrates resolution at the hull and expands offshore.
  // No overlapping transparent tiles, local patch seam, or extra water draw.
  const geo = new THREE.PlaneGeometry(2, 2, production?320:128, production?320:128);
  const vertices = geo.attributes.position;
  const expand = v => Math.sign(v) * .8 * (Math.exp(Math.abs(v) * Math.log(3126)) - 1);
  const filmExpand=v=>{const a=Math.abs(v);return Math.sign(v)*(a<=.7?a/.7*90:90+Math.pow((a-.7)/.3,3)*2410)};
  for (let i = 0; i < vertices.count; i++) vertices.setXY(i, production?filmExpand(vertices.getX(i))-34:expand(vertices.getX(i)), production?filmExpand(vertices.getY(i)):expand(vertices.getY(i)));
  geo.computeBoundingSphere();
  const mat = new THREE.ShaderMaterial({
    transparent: false, depthWrite: true, side: THREE.DoubleSide,
    uniforms: { uReflection:{value:null},uReflectionMatrix:{value:new THREE.Matrix4()},uReflectionStrength:{value:0},uProduction:{value:production?1:0},uTime: { value: 0 }, uUnder: { value: 0 }, uWaveIntensity: { value: 1 }, uSlope: { value: new THREE.Vector2() }, uSunDirection: { value: new THREE.Vector3(-5, 9, 8).normalize() } },
      vertexShader: `
      uniform float uTime; uniform vec2 uSlope;uniform float uProduction;uniform mat4 uReflectionMatrix;varying vec4 vReflection;
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
        return vec3(height,gradient)*mix(1.,.72,uProduction);
      }
      void main(){
        vec3 p=position;
        vec3 sampleWave=heightAndGradient(p.xy);
        float w=sampleWave.x, dx=sampleWave.y, dz=sampleWave.z;
        p.z+=w;
        vec4 world=modelMatrix*vec4(p,1.);
        vWorld=world.xyz;vReflection=uReflectionMatrix*vec4(p,1.);
        vNormal=normalize(mat3(modelMatrix)*vec3(-dx,-dz,1.));
        vWave=w;
        vRippleFade=1.-smoothstep(30.,110.,length(p.xy));
        gl_Position=projectionMatrix*viewMatrix*world;
      }
    `,
    fragmentShader: `
      uniform sampler2D uReflection;uniform float uReflectionStrength;uniform float uProduction;varying vec4 vReflection;uniform float uTime; uniform float uUnder; uniform float uWaveIntensity; uniform vec3 uSunDirection;
      varying vec3 vWorld; varying vec3 vNormal; varying float vWave; varying float vRippleFade;
      void main(){
        float radius=length(vWorld.xz);
        vec2 rippleNormal=vec2(
          cos(vWorld.x*.72+vWorld.z*.48+uTime*.58)*.024+cos(vWorld.x*.31-vWorld.z*.69-uTime*.27)*.017,
          sin(vWorld.x*.51-vWorld.z*.62+uTime*.43)*.023+sin(vWorld.x*.82+vWorld.z*.37-uTime*.32)*.014
        )*uWaveIntensity*vRippleFade;
        float contact=smoothstep(1.12,1.5,radius)*exp(-max(radius-1.5,0.)*.5);
        float distantNormal=1.-smoothstep(25.,130.,length(cameraPosition.xz-vWorld.xz));
        float entryAge=uTime/1.25-2.15;
        vec2 entryDelta=(vWorld.xz-vec2(-67.,0.))*vec2(1.,.43);
        float entryRadius=length(entryDelta),front=max(0.,entryAge)*.75;
        float entryEnvelope=step(0.,entryAge)*exp(-pow((entryRadius-front)/.65,2.))*exp(-max(0.,entryAge)*.9)*uProduction;
        rippleNormal+=normalize(entryDelta+vec2(.001))*sin(entryRadius*14.-entryAge*8.)*entryEnvelope*.075;
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
        if(uReflectionStrength>0.){
          vec2 uv=vReflection.xy/vReflection.w+n.xz*.026;
          uv+=vec2(sin(vWorld.x*5.+vWorld.z*4.+uTime*.55),cos(vWorld.z*6.-vWorld.x*3.-uTime*.4))*.0012*distantNormal;
          vec3 actual=texture2D(uReflection,clamp(uv,.003,.997)).rgb*.5;
          actual+=texture2D(uReflection,clamp(uv+vec2(.0014,0.),.003,.997)).rgb*.25;
          actual+=texture2D(uReflection,clamp(uv-vec2(.0014,0.),.003,.997)).rgb*.25;
          surface=mix(surface,actual,uReflectionStrength*(.24+.52*fresnel));
        }
        surface+=vec3(.15,.19,.18)*entryEnvelope*.06;
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
    uniforms: { uProduction:{value:production?1:0},uUnder: { value: 0 }, uTime: { value: 0 } },
    vertexShader: `varying vec3 vDirection; void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform float uProduction;uniform float uUnder; uniform float uTime; varying vec3 vDirection;
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
        vec3 depthBackground=mix(vec3(.012,.055,.09),vec3(.045,.17,.21),smoothstep(-.65,.1,d.y));
        air=mix(air,depthBackground,(1.-smoothstep(-.04,.02,d.y))*uProduction);
        gl_FragColor=vec4(mix(air,mix(vec3(.045,.17,.21),depthBackground,uProduction),uUnder),1.);
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


const sky=createSky(), water=createWater()[0], environment=createDaylightEnvironment();scene.environment=environment;return {sky,water,environment};
}
