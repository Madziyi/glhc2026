import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

// Original research-workboat reconstruction for the film; not a named vessel.
// Bow +Z, working deck aft. Origin matches the approved launch blocking.
export function createProductionBoat(){
 const root=new THREE.Group();root.name='Detailed research launch boat';
 const paint=new THREE.MeshPhysicalMaterial({color:'#e0e5de',metalness:.08,roughness:.36,clearcoat:.25});
 const navy=new THREE.MeshStandardMaterial({color:'#173240',metalness:.18,roughness:.49});
 const steel=new THREE.MeshStandardMaterial({color:'#a9b7ba',metalness:.88,roughness:.28});
 const rubber=new THREE.MeshStandardMaterial({color:'#172126',roughness:.84});
 const orange=new THREE.MeshPhysicalMaterial({color:'#bd4621',metalness:.22,roughness:.34,clearcoat:.18});
 const hydraulic=new THREE.MeshStandardMaterial({color:'#303b40',metalness:.62,roughness:.32});
 const deckMat=new THREE.MeshStandardMaterial({color:'#7e8f8e',metalness:.18,roughness:.84});
 const gritData=new Uint8Array(128*128*4);let gritSeed=1231;for(let i=0;i<gritData.length;i+=4){gritSeed=(Math.imul(gritSeed,1664525)+1013904223)>>>0;const v=155+(gritSeed>>>26);gritData.set([v,v,v,255],i)}
 const grit=new THREE.DataTexture(gritData,128,128);grit.wrapS=grit.wrapT=THREE.RepeatWrapping;grit.repeat.set(8,12);grit.needsUpdate=true;deckMat.roughnessMap=grit;deckMat.bumpMap=grit;deckMat.bumpScale=.002;
 const glass=new THREE.MeshPhysicalMaterial({color:'#193b49',metalness:.08,roughness:.15,transparent:true,opacity:.73,clearcoat:1,side:THREE.DoubleSide});
 const wood=new THREE.MeshStandardMaterial({color:'#735942',roughness:.7});
 const mesh=(geometry,material,name='',parent=root)=>{const m=new THREE.Mesh(geometry,material);m.name=name;m.castShadow=true;m.receiveShadow=true;parent.add(m);return m};
 const box=(w,h,d,mat,x,y,z,name='',r=.025)=>{const m=mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/4,h/4,d/4)),mat,name);m.position.set(x,y,z);return m};
 const rod=(a,b,r,mat,name='')=>{const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),delta=bv.clone().sub(av);const m=mesh(new THREE.CylinderGeometry(r,r,delta.length(),16),mat,name);m.position.copy(av).add(bv).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m};
 const beam=(a,b,w,h,mat,name)=>{const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b);const m=mesh(new RoundedBoxGeometry(w,h,av.distanceTo(bv),3,.035),mat,name);m.position.copy(av).add(bv).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),bv.sub(av).normalize());return m};
 const curve=new THREE.CatmullRomCurve3([
  new THREE.Vector3(-4.4,1.84,-.78),new THREE.Vector3(-3.4,1.98,-1.06),new THREE.Vector3(-1.5,2,-1.15),new THREE.Vector3(.8,1.98,-1.10),new THREE.Vector3(2.8,1.76,-.84),new THREE.Vector3(4.3,1.12,-.28),new THREE.Vector3(5.5,.015,.96)
 ],false,'centripetal');
 const positions=[],indices=[],longSteps=110,crossSteps=36;
 for(let j=0;j<=longSteps;j++){
  const u=j/longSteps,p=curve.getPoint(u),z=p.x,b=p.y,keel=p.z,top=.53+Math.pow(Math.max(0,(z+1)/6.5),3)*.48;
  const cross=new THREE.CatmullRomCurve3([new THREE.Vector3(-b,top,z),new THREE.Vector3(-b*.97,-.02+Math.max(0,z-3)*.3,z),new THREE.Vector3(-b*.72,keel+.22,z),new THREE.Vector3(0,keel,z),new THREE.Vector3(b*.72,keel+.22,z),new THREE.Vector3(b*.97,-.02+Math.max(0,z-3)*.3,z),new THREE.Vector3(b,top,z)],false,'centripetal');
  for(let i=0;i<=crossSteps;i++){const v=cross.getPoint(i/crossSteps);positions.push(v.x,v.y,v.z)}
 }
 for(let j=0;j<longSteps;j++)for(let i=0;i<crossSteps;i++){const a=j*(crossSteps+1)+i,b=a+crossSteps+1;indices.push(a,b,a+1,a+1,b,b+1)}
 const hullGeo=new THREE.BufferGeometry();hullGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));hullGeo.setIndex(indices);hullGeo.computeVertexNormals();
 const hullMat=paint.clone();hullMat.side=THREE.DoubleSide;hullMat.onBeforeCompile=shader=>{
  shader.vertexShader='varying float vHullY;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvHullY=position.y;');
  shader.fragmentShader='varying float vHullY;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb=mix(vec3(.013,.035,.048),diffuseColor.rgb,smoothstep(-.43,-.39,vHullY));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.027,.085,.12),smoothstep(-.39,-.36,vHullY)*(1.-smoothstep(-.20,-.17,vHullY)));');
 };
 mesh(hullGeo,hullMat,'Lofted deep-V hull with bow flare and boot stripe');
 // Solid transom closes the aft hull.
 const transom=new THREE.Shape();transom.moveTo(-1.84,.53);transom.lineTo(1.84,.53);transom.quadraticCurveTo(1.9,-.35,1.30,-.65);transom.quadraticCurveTo(0,-1.0,-1.30,-.65);transom.quadraticCurveTo(-1.9,-.35,-1.84,.53);
 const transomMesh=mesh(new THREE.ShapeGeometry(transom,32),hullMat,'Closed transom');transomMesh.position.z=-4.4;
 const deckShape=new THREE.Shape();deckShape.moveTo(-1.84,4.4);deckShape.lineTo(1.84,4.4);deckShape.bezierCurveTo(2.10,1.8,2.05,-1.6,1.76,-2.8);deckShape.bezierCurveTo(1.32,-4.7,.3,-5.5,0,-5.5);deckShape.bezierCurveTo(-.3,-5.5,-1.32,-4.7,-1.76,-2.8);deckShape.bezierCurveTo(-2.05,-1.6,-2.10,1.8,-1.84,4.4);
 const deckGeo=new THREE.ExtrudeGeometry(deckShape,{depth:.09,bevelEnabled:true,bevelSize:.025,bevelThickness:.02,bevelSegments:2,steps:1});deckGeo.rotateX(-Math.PI/2);const deck=mesh(deckGeo,deckMat,'Non-slip working deck');deck.position.y=.48;
 // Gunwale rub rails and guard rails follow the actual hull outline.
 const edgePoints=[[-1.84,.58,-4.4],[-2,.6,-2.5],[-2,.63,0],[-1.82,.72,2.6],[-1.12,.9,4.3],[0,1.03,5.5],[1.12,.9,4.3],[1.82,.72,2.6],[2,.63,0],[2,.6,-2.5],[1.84,.58,-4.4]];
 const edge=new THREE.CatmullRomCurve3(edgePoints.map(p=>new THREE.Vector3(...p)));mesh(new THREE.TubeGeometry(edge,160,.055,10,false),rubber,'Continuous gunwale rub rail');
 for(const side of [-1,1]){
  const posts=[[-4.2,1.8],[-2.9,1.96],[-1.4,2],[0,2],[1.5,1.94],[3,1.7],[4.2,1.12]];
  posts.forEach(([z,x])=>{if(side===1&&z>-2.9&&z<0)return;const base=.6+Math.max(0,z-1)*.08;rod([side*x,base,z],[side*x,base+.79,z],.025,steel,'Guard-rail stanchion')});
  const segments=side===1?[posts.slice(0,2),posts.slice(3)]:[posts];
  for(const segment of segments)for(const height of [.42,.79]){const pts=segment.map(([z,x])=>new THREE.Vector3(side*x,.6+Math.max(0,z-1)*.08+height,z));if(pts.length>1)mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),60,.022,8,false),steel,'Tubular deck guard rail')}
 }
 // Wheelhouse with separate windows, frames and a visible helm inside.
 box(2.65,.88,2.9,paint,0,1.02,1.65,'Wheelhouse lower shell',.10);
 for(const x of [-1.28,1.28])for(const z of [.24,3.06])box(.12,.99,.12,paint,x,1.89,z,'Wheelhouse corner pillar');
 box(2.65,1.73,.09,paint,0,1.46,.23,'Wheelhouse aft bulkhead');
 const windscreenZ=3.115;
 for(const x of [-.69,0,.69]){for(const dx of [-.315,.315])box(.025,.70,.025,navy,x+dx,1.77,windscreenZ,'Windshield vertical frame');for(const dy of [-.34,.34])box(.64,.025,.025,navy,x,1.77+dy,windscreenZ,'Windshield horizontal frame');box(.57,.61,.028,glass,x,1.77,windscreenZ+.016,'Front wheelhouse glazing');rod([x-.20,1.51,windscreenZ+.04],[x+.12,1.91,windscreenZ+.04],.010,rubber,'Windscreen wiper')}
 for(const side of [-1,1]){
  for(const z of [.90,1.8,2.65]){for(const dz of [-.35,.35])box(.028,.72,.025,navy,side*1.337,1.78,z+dz,'Side window seal');for(const dy of [-.35,.35])box(.028,.025,.71,navy,side*1.337,1.78+dy,z,'Side window seal');box(.031,.64,.63,glass,side*1.354,1.78,z,'Side wheelhouse glazing')}
  box(.034,.9,.58,paint,side*1.35,1.02,.38,'Cabin door lower panel');rod([side*1.385,1.16,.36],[side*1.385,1.16,.52],.014,steel,'Cabin door handle');
 }
 box(2.94,.16,3.2,paint,0,2.41,1.65,'Overhanging wheelhouse roof',.065);
 box(1.9,.65,.55,navy,0,1.10,2.55,'Helm console');
 const wheel=mesh(new THREE.TorusGeometry(.18,.017,8,32),rubber,'Helm wheel');wheel.position.set(.45,1.50,2.52);wheel.rotation.x=-.35;
 for(const x of [-.55,.15])box(.36,.23,.035,glass,x,1.53,2.58,'Navigation instrument');
 box(.43,.10,.46,rubber,.1,1.18,1.6,'Helm seat');box(.43,.43,.09,rubber,.1,1.43,1.82,'Helm seat back');rod([.1,.60,1.6],[.1,1.15,1.6],.045,steel,'Seat pedestal');
 // Roof equipment, mast, antennas and navigation lamps.
 rod([0,2.49,1.48],[0,4.02,1.48],.035,steel,'Navigation mast');rod([-.48,3.50,1.48],[.48,3.50,1.48],.025,steel,'Mast crossbar');
 box(.95,.12,.16,paint,0,3.13,1.62,'Radar scanner',.04);rod([0,2.50,1.62],[0,3.06,1.62],.028,steel);
 for(const x of [-.83,.83])rod([x,2.49,.9],[x,4.15,.94],.010,steel,'VHF whip antenna');
 const lamp=(x,color)=>box(.15,.13,.18,new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.35}),x,2.55,2.6,'Navigation light');lamp(-1.30,'#ad2e24');lamp(1.30,'#3a915e');
 for(const x of [-.95,.95]){const light=box(.19,.12,.13,steel,x,2.33,.13,'Aft deck floodlight');box(.15,.08,.02,new THREE.MeshStandardMaterial({color:'#ece7ce',emissive:'#e9e3c1',emissiveIntensity:.25}),x,2.33,.055,'Deck lamp lens')}
 // Aft deck hatches, fairleads, work bench and equipment storage.
 for(const [x,z,w,d] of [[-.65,-2.3,1.1,1.3],[.6,-3.6,.85,.75]]){
  box(w,.065,d,steel,x,.59,z,'Recessed deck hatch');box(w-.10,.012,d-.10,deckMat,x,.632,z,'Hatch non-slip insert');
  for(const sign of [-1,1])box(.16,.032,.025,hydraulic,x+sign*w*.28,.66,z-d*.35,'Hatch lifting handle');
 }
 box(1.25,.82,.52,paint,-1.27,1,-.75,'Deck equipment locker');box(1.32,.07,.61,steel,-1.27,1.45,-.75,'Work bench top');
 for(const z of [-3.8,3.3])for(const side of [-1,1]){const x=side*(z>0?1.5:1.6);rod([x,.59,z],[x,.74,z],.045,steel,'Mooring cleat');rod([x-.17,.74,z],[x+.17,.74,z],.035,steel)}
 // Dark cylindrical fenders, tethered outside the hull.
 for(const side of [-1,1])for(const z of [-3.1,-.2,3.0]){
  const x=side*(z>2?1.8:2.04);const fender=mesh(new THREE.CapsuleGeometry(.115,.45,4,12),rubber,'Hanging rubber fender');fender.position.set(x,.13,z);rod([x,.60,z],[x,.45,z],.012,navy,'Fender tether');
 }
 const life=mesh(new THREE.TorusGeometry(.30,.072,12,48),new THREE.MeshStandardMaterial({color:'#c75a25',roughness:.55}),'Lifebuoy');life.position.set(-1.39,1.27,.48);life.rotation.y=Math.PI/2;
 for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const band=box(.025,.10,.12,paint,-1.47,1.27+Math.sin(a)*.30,.48+Math.cos(a)*.30,'Lifebuoy reflective band');band.rotation.x=-a}
 for(let i=0;i<3;i++){const coil=mesh(new THREE.TorusGeometry(.22+i*.024,.018,6,48),wood,'Coiled mooring rope');coil.rotation.x=Math.PI/2;coil.position.set(-1.30,.60+i*.013,-3.55)}
 // Crane geometry: pedestal, knuckle booms, pivots and exposed hydraulic rams.
 const pedestal=mesh(new THREE.CylinderGeometry(.25,.31,.57,32),orange,'Crane pedestal');pedestal.position.set(1.22,.86,-2.45);
 box(.78,.10,.73,steel,1.22,.61,-2.45,'Crane mounting plate');
 for(const dx of [-.28,.28])for(const dz of [-.25,.25]){const bolt=mesh(new THREE.CylinderGeometry(.038,.038,.035,6),hydraulic,'Crane mounting bolt');bolt.position.set(1.22+dx,.68,-2.45+dz)}
 const a=[1.22,1.13,-2.45],b=[1.30,3.03,-2.30],c=[1.70,3.86,-1.50],tip=[3,4.15,-.1];
 beam(a,b,.31,.29,orange,'Crane main boom');beam(b,c,.27,.25,orange,'Knuckle boom');beam(c,tip,.20,.22,orange,'Outboard telescopic boom');
 const ram=(a,b)=>{const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),mid=av.clone().lerp(bv,.67);rod(a,mid.toArray(),.065,hydraulic,'Hydraulic cylinder');rod(mid.toArray(),b,.033,steel,'Polished piston rod')};
 ram([1.22,1.36,-2.45],[1.32,2.80,-2.29]);ram([1.30,2.70,-2.3],[1.65,3.7,-1.58]);ram([1.62,3.72,-1.61],[2.62,4.03,-.45]);
 for(const p of [a,b,c])rod([p[0]-.20,p[1],p[2]],[p[0]+.20,p[1],p[2]],.080,hydraulic,'Crane hinge pin');
 for(const shift of [-.055,.055]){const pts=[new THREE.Vector3(1.18+shift,1.1,-2.5),new THREE.Vector3(1.13+shift,2.9,-2.4),new THREE.Vector3(1.6+shift,3.98,-1.5),new THREE.Vector3(2.8+shift,4.20,-.3)];mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),60,.014,6,false),rubber,'Crane hydraulic hose')}
 const drum=mesh(new THREE.CylinderGeometry(.19,.19,.40,32),hydraulic,'Cable winch drum');drum.rotation.z=Math.PI/2;drum.position.set(1.29,2.35,-2.42);
 for(let i=0;i<12;i++){const wrap=mesh(new THREE.TorusGeometry(.196,.010,6,32),steel,'Winch cable winding');wrap.rotation.y=Math.PI/2;wrap.position.set(1.10+i*.033,2.35,-2.42)}
 const sheave=mesh(new THREE.TorusGeometry(.095,.025,8,32),hydraulic,'Crane tip pulley');sheave.rotation.y=Math.PI/2;sheave.position.set(...tip);
 // Inboard shaft drives and rudders close out the visible underwater vessel.
 const bronze=new THREE.MeshStandardMaterial({color:'#8c7751',metalness:.85,roughness:.32});
 for(const side of [-1,1]){
  const x=side*.64;rod([x,-.73,-3.60],[x,-.91,-4.73],.035,steel,'Propeller shaft');
  const hub=mesh(new THREE.ConeGeometry(.065,.17,20),bronze,'Propeller hub');hub.rotation.x=-Math.PI/2;hub.position.set(x,-.91,-4.77);
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3,blade=mesh(new THREE.SphereGeometry(1,16,10),bronze,'Swept propeller blade');blade.scale.set(.10,.24,.022);blade.position.set(x+Math.sin(a)*.16,-.91+Math.cos(a)*.16,-4.69);blade.rotation.set(.24,0,-a+.25)}
  box(.055,.44,.35,hydraulic,x,-.88,-5.02,'Steering rudder',.025);rod([x,-.38,-4.98],[x,-.75,-4.98],.025,steel,'Rudder stock');
 }
 const hookPoint=new THREE.Object3D();hookPoint.position.set(...tip);hookPoint.name='Hoist cable attachment';root.add(hookPoint);
 root.userData.description='Original compact research workboat, film visualization';
 root.userData.hookLocal=tip;
 return {root,hookPoint};
}
