/**
 * Deterministic, procedural GLB source for the GLHC-002 feasibility prototype.
 * This is a visual model, not engineering CAD. Units are relative to a 38-inch
 * hull diameter; see docs/GLHC-V2-SPEC.md for the approved visual authority.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
import { MeshoptEncoder } from 'meshoptimizer/encoder';
import { MeshoptDecoder } from 'meshoptimizer/decoder';
await MeshoptEncoder.ready;
await MeshoptDecoder.ready;

const meshes = [];
const materials = [
  { name: 'Rotomoulded safety-yellow polymer', pbrMetallicRoughness: { baseColorFactor: [0.96, 0.61, 0.035, 1], metallicFactor: 0, roughnessFactor: 0.48 } },
  { name: 'Moulded warm-yellow edge', pbrMetallicRoughness: { baseColorFactor: [0.76, 0.37, 0.025, 1], metallicFactor: 0, roughnessFactor: 0.57 } },
  { name: 'Powder-coated charcoal frame', pbrMetallicRoughness: { baseColorFactor: [0.075, 0.09, 0.09, 1], metallicFactor: 0.18, roughnessFactor: 0.56 } },
  { name: 'Blue-black photovoltaic glass', pbrMetallicRoughness: { baseColorFactor: [0.018, 0.052, 0.083, 1], metallicFactor: 0.56, roughnessFactor: 0.22 } },
  { name: 'Brushed marine stainless steel', pbrMetallicRoughness: { baseColorFactor: [0.54, 0.6, 0.59, 1], metallicFactor: 0.82, roughnessFactor: 0.34 } },
  { name: 'Blue anodized sonde housing', pbrMetallicRoughness: { baseColorFactor: [0.025, 0.12, 0.34, 1], metallicFactor: 0.48, roughnessFactor: 0.36 } },
  { name: 'Black acetal instrument housing', pbrMetallicRoughness: { baseColorFactor: [0.025, 0.031, 0.033, 1], metallicFactor: 0.05, roughnessFactor: 0.48 } },
  { name: 'Red coated steel ballast', pbrMetallicRoughness: { baseColorFactor: [0.38, 0.055, 0.045, 1], metallicFactor: 0.36, roughnessFactor: 0.49 } },
  { name: 'Marine fasteners and fittings', pbrMetallicRoughness: { baseColorFactor: [0.085, 0.105, 0.105, 1], metallicFactor: 0.78, roughnessFactor: 0.4 } },
  { name: 'White instrument housing', pbrMetallicRoughness: { baseColorFactor: [0.89, 0.92, 0.92, 1], metallicFactor: 0, roughnessFactor: 0.4 } },
];
function geometry(name, positions, indices, material, color = null) {
  const normals = new Array(positions.length).fill(0);
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3;
    const ux = positions[b] - positions[a], uy = positions[b + 1] - positions[a + 1], uz = positions[b + 2] - positions[a + 2];
    const vx = positions[c] - positions[a], vy = positions[c + 1] - positions[a + 1], vz = positions[c + 2] - positions[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    for (const id of [a, b, c]) { normals[id] += nx; normals[id + 1] += ny; normals[id + 2] += nz; }
  }
  for (let i = 0; i < normals.length; i += 3) { const l = Math.hypot(normals[i], normals[i + 1], normals[i + 2]) || 1; normals[i] /= l; normals[i + 1] /= l; normals[i + 2] /= l; }
  meshes.push({ name, positions, normals, indices, material, color });
}
function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) { c ^= byte; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); }
  return (c ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const name = Buffer.from(type), length = Buffer.alloc(4), crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}
function makeFineFinishTexture() {
  // Neutral tileable albedo grain preserves each material's base color while
  // avoiding the perfectly smooth look of untextured procedural geometry.
  const size = 128, scanlines = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    const row = y * (1 + size * 4); scanlines[row] = 0;
    for (let x = 0; x < size; x++) {
      const grain = 246 + 3.1 * Math.sin(2 * Math.PI * (3 * x / size + 2 * y / size)) + 2.2 * Math.sin(2 * Math.PI * (7 * x / size - 5 * y / size)) + 1.4 * Math.cos(2 * Math.PI * (11 * x / size + 9 * y / size));
      const value = Math.max(0, Math.min(255, Math.round(grain))), i = row + 1 + x * 4;
      scanlines[i] = value; scanlines[i + 1] = value; scanlines[i + 2] = value; scanlines[i + 3] = 255;
    }
  }
  const header = Buffer.alloc(13); header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), pngChunk('IHDR', header), pngChunk('IDAT', deflateSync(scanlines, { level: 9 })), pngChunk('IEND', Buffer.alloc(0))]);
}
function box(name, x, y, z, w, h, d, material) {
  const X = w / 2, Y = h / 2, Z = d / 2;
  const p = [-X,-Y,-Z, X,-Y,-Z, X,Y,-Z, -X,Y,-Z, -X,-Y,Z, X,-Y,Z, X,Y,Z, -X,Y,Z];
  const idx = [0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,3,7,6,3,6,2,0,4,7,0,7,3,1,2,6,1,6,5];
  geometry(name, p, idx, material, [x,y,z]);
}
function cyl(name, x, y, z, radius, height, material, sides = 20, topRadius = radius) {
  const p = [], idx = [];
  // Tiny moulded shoulders replace the old perfectly sharp cylinder silhouette.
  const inset = Math.min(height * .12, radius * .09);
  const rings = [
    [radius * .965, -height / 2], [radius, -height / 2 + inset],
    [radius, height / 2 - inset], [topRadius * .965, height / 2],
  ];
  for (const [r, yy] of rings) for (let i = 0; i < sides; i++) { const a = i / sides * Math.PI * 2; p.push(Math.cos(a) * r, yy, Math.sin(a) * r); }
  for (let j = 0; j < rings.length - 1; j++) for (let i = 0; i < sides; i++) { const a = j * sides + i, b = j * sides + (i + 1) % sides, c = (j + 1) * sides + (i + 1) % sides, d = (j + 1) * sides + i; idx.push(a, b, d, b, c, d); }
  const bottom = p.length / 3; p.push(0, -height / 2, 0); const top = p.length / 3; p.push(0, height / 2, 0);
  for (let i = 0; i < sides; i++) { const n = (i + 1) % sides; idx.push(bottom, n, i, top, (rings.length - 1) * sides + i, (rings.length - 1) * sides + n); }
  geometry(name, p, idx, material, [x,y,z]);
}
function tube(name, from, to, radius, material, sides = 8) {
  const [ax, ay, az] = from, [bx, by, bz] = to, dx = bx-ax, dy = by-ay, dz = bz-az, len = Math.hypot(dx,dy,dz);
  cyl(name, 0, 0, 0, radius, len, material, sides);
  const m = meshes.at(-1), axis = [dx/len,dy/len,dz/len], dot = axis[1];
  m.color = [(ax+bx)/2,(ay+by)/2,(az+bz)/2];
  // GLB mesh nodes can be rotated; here store a quaternion derived from Y axis.
  const q = dot < -0.999999 ? [1, 0, 0, 0] : [axis[2], 0, -axis[0], 1 + dot];
  const ql = Math.hypot(...q) || 1; m.rotation = q.map(v => v / ql);
}
function torus(name, cx, cy, cz, major, minor, material, seg = 32, ring = 8) {
  const p = [], idx = [];
  for (let i = 0; i < seg; i++) for (let j = 0; j < ring; j++) {
    const u = i / seg * Math.PI * 2, v = j / ring * Math.PI * 2, r = major + minor * Math.cos(v);
    p.push(Math.cos(u)*r, minor*Math.sin(v), Math.sin(u)*r);
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < ring; j++) { const a=i*ring+j,b=((i+1)%seg)*ring+j,c=((i+1)%seg)*ring+(j+1)%ring,d=i*ring+(j+1)%ring; idx.push(a,b,d,b,c,d); }
  geometry(name, p, idx, material, [cx,cy,cz]);
}

// Hull: softly shouldered rotomoulded annulus with a recessed lower boss.
cyl('rounded yellow flotation hull',0,0,0,1.66,1.1,0,64,1.66);
cyl('tapered underside shoulder',0,-0.62,0,1.47,0.33,0,64,1.66);
cyl('recessed underside boss',0,-0.79,0,0.78,0.21,1,40,0.74);
torus('fine mould split line',0,-0.28,0,1.664,0.009,1,64,8);
// Subtle deck fasteners and molded service covers add scale cues without wear.
for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; cyl('deck service fastener',Math.cos(a)*1.36,0.56,Math.sin(a)*1.36,.022,.012,8,10); }
for (const x of [-0.74, 0.74]) for (const z of [-0.62, 0.62]) cyl('flush white deck fitting',x,0.565,z,.105,.045,4,20,.105);
// Triangular mast legs and the solar tower; front face is toward negative Z.
for (const sx of [-1,1]) for (const sz of [-1,1]) tube('tower support', [sx*0.48,0.49,sz*0.43],[sx*0.56,2.58,sz*0.5],0.035,2,8);
box('solar instrument tower housing',0,1.48,0,1.17,1.93,1.08,2);
box('front solar glass',0,1.49,-0.55,0.94,1.65,0.022,3);
box('left solar glass',-0.592,1.49,0,0.022,1.65,0.91,3);
box('right solar glass',0.592,1.49,0,0.022,1.65,0.91,3);
for(let i=1;i<6;i++) box('front photovoltaic busbar',-0.47+i*.94/6,1.49,-0.565,.007,1.59,.004,4);
for(let i=1;i<9;i++) box('front photovoltaic cell gap',0,0.665+i*1.65/9,-0.565,.9,.008,.004,4);
for (const side of [-1, 1]) {
  for(let i=1;i<6;i++) box('side photovoltaic busbar',side*.607,1.49,-.455+i*.91/6,.004,1.59,.007,4);
  for(let i=1;i<9;i++) box('side photovoltaic cell gap',side*.607,.665+i*1.65/9,0,.004,.008,.87,4);
}
// Fine perimeter rails and restrained panel attachment points.
for (const x of [-.51, .51]) tube('panel edge rail',[x,.66,-.57],[x,2.32,-.57],.018,2,8);
for (const x of [-.48,.48]) for (const y of [.72,2.25]) cyl('panel clamp',x,y,-.584,.026,.018,4,10);
// Top guard ring and small weather sensor.
torus('upper circular guard rail',0,2.69,0,0.95,0.034,4,40,8);
for(const x of [-0.68,0.68]) tube('guard ring brace',[x,2.56,0],[x*1.34,2.68,0],0.028,4,8);
cyl('weather sensor foot',0,2.55,0,0.13,0.13,2,18);
tube('slender weather mast',[0,2.61,0],[0,4.18,0],0.018,8,10);
for (const y of [2.85,3.58,4.04]) cyl('weather mast collar',0,y,0,.032,.025,4,12);
cyl('compact weather instrument',0,4.24,0,.11,.2,4,20,.085);
box('small wind vane',0,4.36,0,.045,.07,.23,4);
cyl('weather sensor cap',0,4.39,0,.031,.04,4,12,.024);
// Under-hull fittings and the slim right-hand secondary probe visible in authority image.
for(const x of [-0.54,0.54]) box('underdeck mounting plate',x,-0.65,0,0.33,0.11,0.34,8);
tube('secondary probe mount',[1.25,-0.6,0.15],[1.42,-0.95,0.15],0.075,8,12);
cyl('secondary silver sensor',1.42,-1.02,0.15,0.1,0.22,4,16,0.06);
// Open rounded rectangular marine cage: four rails, one lower plate and rounded ends.
const cageTop=-0.82,cageBottom=-3.82,cx=0.04,cz=0.02,cw=1.08,cd=0.76,cr=0.2;
for(const x of [-1,1]) for(const z of [-1,1]) tube('cage corner rail',[cx+x*cw/2,cageTop-cr,cz+z*cd/2],[cx+x*cw/2,cageBottom+cr,cz+z*cd/2],0.035,4,10);
function roundedVerticalFrame(name, zz) {
  const halfW=cw/2, top=cageTop, bottom=cageBottom, points=[];
  const corners=[[cx+halfW-cr,top-cr,0],[cx-halfW+cr,top-cr,90],[cx-halfW+cr,bottom+cr,180],[cx+halfW-cr,bottom+cr,270]];
  for(const [x,y,start] of corners)for(let i=0;i<=4;i++){const a=(start+i*90/4)*Math.PI/180;points.push([x+cr*Math.cos(a),y+cr*Math.sin(a),zz]);}
  points.push(points[0]);
  for(let i=0;i<points.length-1;i++)tube(name,points[i],points[i+1],0.035,4,10);
}
for(const z of [-1,1])roundedVerticalFrame('vertical rounded cage perimeter',cz+z*cd/2);
for(const yy of [-2.94]) {
  box('perforated horizontal cage plate',cx,yy,cz,cw+0.04,0.075,cd+0.04,4);
  for(const x of [-0.18,0,0.18]) for(const z of [-0.15,0.15]) cyl('plate perforation dark inset',cx+x,yy+0.039,cz+z,0.027,0.005,8,8);
}
// Forward-left sonde, partly blue and mostly black, suspended within cage upper section.
cyl('blue sonde body',-0.21,-1.46,-0.30,0.105,1.03,5,18,0.095);
cyl('black sonde lower housing',-0.21,-2.11,-0.30,0.102,0.43,6,18,0.067);
cyl('sonde end cap',-0.21,-2.34,-0.30,0.068,0.1,8,16,0.035);
box('sonde connector',-0.21,-0.9,-0.30,0.17,0.13,0.17,8);
tube('sonde cable',[0.0,-0.78,0.08],[-0.08,-0.94,-0.08],0.018,8,8);
// Additional suspended probes. The white probe ends 0.12 units (about 3.5 cm)
// above the blue sonde; both additions stay inside the cage and above its plate.
cyl('long white probe body',.13,-1.555,-.23,.082,1.15,9,18);
cyl('white probe black end cap',.13,-2.20,-.23,.085,.14,6,18,.075);
box('white probe connector',.13,-.94,-.23,.13,.1,.13,8);
cyl('short black probe body',.38,-1.34,-.16,.068,.72,6,16,.06);
box('short probe connector',.38,-.94,-.16,.11,.1,.11,8);
// Red ballast hangs directly below the cage with a small metal shackle and mooring line.
cyl('red ballast cylinder',0.04,-4.34,0.02,0.32,0.76,7,24,0.32);
cyl('ballast cap',0.04,-3.94,0.02,0.19,0.08,8,16,0.16);
tube('ballast shackle',[0.04,-4.75,0.02],[0.04,-4.94,0.02],0.025,4,8);
tube('mooring line',[0.04,-4.93,0.02],[0.04,-5.58,0.02],0.012,8,8);

// Merge all procedural parts sharing a material into one mesh each to keep draw calls low.
const groups = materials.map((_, material) => ({ name: materials[material].name, material, positions: [], normals: [], uvs: [], indices: [] }));
function rotateVector(v, q) {
  const [qx,qy,qz,qw]=q, [x,y,z]=v;
  const ix=qw*x+qy*z-qz*y, iy=qw*y+qz*x-qx*z, iz=qw*z+qx*y-qy*x, iw=-qx*x-qy*y-qz*z;
  return [ix*qw+iw*-qx+iy*-qz-iz*-qy,iy*qw+iw*-qy+iz*-qx-ix*-qz,iz*qw+iw*-qz+ix*-qy-iy*-qx];
}
for(const m of meshes){
  const g=groups[m.material], offset=g.positions.length/3, [tx,ty,tz]=m.color;
  for(let i=0;i<m.positions.length;i+=3){const v=m.rotation?rotateVector(m.positions.slice(i,i+3),m.rotation):m.positions.slice(i,i+3);const x=v[0]+tx,y=v[1]+ty,z=v[2]+tz;g.positions.push(x,y,z);g.uvs.push(Math.atan2(z,x)/(Math.PI*2)+.5,Math.max(0,Math.min(1,(y+5.7)/10.2)));}
  for(let i=0;i<m.normals.length;i+=3){const v=m.rotation?rotateVector(m.normals.slice(i,i+3),m.rotation):m.normals.slice(i,i+3);g.normals.push(...v);}
  for(const index of m.indices)g.indices.push(index+offset);
}
const exportMeshes=groups.filter(g=>g.indices.length);

// Pack a standards-compliant GLB.
const chunks = [], views = [], accessors = [];
let byteOffset = 0;
let fallbackOffset = 0;
const align4 = n => (n + 3) & ~3;
const encodedStreams=[];
function addBuffer(data, componentType, type, count, target, min = null, max = null, mode = 'ATTRIBUTES', stride = 12) {
  const bytesPer = componentType === 5126 ? 4 : 2;
  const raw = Buffer.alloc(data.length * bytesPer);
  data.forEach((n,i) => componentType === 5126 ? raw.writeFloatLE(n,i*4) : raw.writeUInt16LE(n,i*2));
  const compressed = MeshoptEncoder.encodeGltfBuffer(new Uint8Array(raw), count, stride, mode);
  const pad = align4(byteOffset)-byteOffset;
  if(pad) { chunks.push(Buffer.alloc(pad)); byteOffset += pad; }
  const view = views.length;
  views.push({buffer:1,byteOffset:fallbackOffset,byteLength:raw.length,target,extensions:{EXT_meshopt_compression:{buffer:0,byteOffset,byteLength:compressed.byteLength,byteStride:stride,count,mode}}});
  fallbackOffset+=align4(raw.length);
  chunks.push(Buffer.from(compressed)); byteOffset += compressed.byteLength;
  encodedStreams.push({raw:new Uint8Array(raw),compressed:new Uint8Array(compressed),count,stride,mode});
  const accessor = accessors.length; const a={bufferView:view,componentType,count,type}; if(min) a.min=min; if(max) a.max=max; accessors.push(a); return accessor;
}
const nodes=[], gltfMeshes=[];
let triangles=0;
for(const m of exportMeshes) {
  const min=[Infinity,Infinity,Infinity], max=[-Infinity,-Infinity,-Infinity];
  const pos=m.positions;
  for(let i=0;i<pos.length;i++){min[i%3]=Math.min(min[i%3],pos[i]);max[i%3]=Math.max(max[i%3],pos[i]);}
  const posId=addBuffer(pos,5126,'VEC3',pos.length/3,34962,min,max,'ATTRIBUTES',12);
  const normalId=addBuffer(m.normals,5126,'VEC3',m.normals.length/3,34962,null,null,'ATTRIBUTES',12);
  const uvId=addBuffer(m.uvs,5126,'VEC2',m.uvs.length/2,34962,null,null,'ATTRIBUTES',8);
  const idxId=addBuffer(m.indices,5123,'SCALAR',m.indices.length,34963,null,null,'INDICES',2);
  const meshId=gltfMeshes.length;
  gltfMeshes.push({name:m.name,primitives:[{attributes:{POSITION:posId,NORMAL:normalId,TEXCOORD_0:uvId},indices:idxId,material:m.material,mode:4}]});
  const node={name:m.name,mesh:meshId}; nodes.push(node); triangles+=m.indices.length/3;
}
const meshBin=Buffer.concat(chunks);
for(const [i,s] of encodedStreams.entries()){
  const decoded=new Uint8Array(s.count*s.stride);
  MeshoptDecoder.decodeGltfBuffer(decoded,s.count,s.stride,s.compressed,s.mode);
  if(decoded.some((v,j)=>v!==s.raw[j])){const mismatch=s.raw.findIndex((v,j)=>v!==decoded[j]);throw new Error(`Meshopt round-trip failed for stream ${i} (${s.mode}, ${s.count}×${s.stride}) at byte ${mismatch}: ${s.raw[mismatch]} != ${decoded[mismatch]}`);}
}
const normalZeroCount=exportMeshes.reduce((sum,m)=>{for(let i=0;i<m.normals.length;i+=3)if(Math.hypot(m.normals[i],m.normals[i+1],m.normals[i+2])<1e-5)sum++;return sum;},0);
if(normalZeroCount)throw new Error(`Model contains ${normalZeroCount} zero-length normals`);
const finishTexture=makeFineFinishTexture();
const bin=meshBin;
for(const material of materials)material.pbrMetallicRoughness.baseColorTexture={index:0};
const gltf={asset:{version:'2.0',generator:'GLHC-002 procedural buoy source'},extensionsUsed:['EXT_meshopt_compression'],extensionsRequired:['EXT_meshopt_compression'],scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes:gltfMeshes,materials,images:[{uri:'glhc002-finish.png'}],textures:[{source:0,sampler:0}],samplers:[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}],accessors,bufferViews:views,buffers:[{byteLength:bin.length},{byteLength:fallbackOffset,extensions:{EXT_meshopt_compression:{fallback:true}}}]};
for(const [i,view] of views.entries()){
  if(!view.extensions)continue;
  const ext=view.extensions.EXT_meshopt_compression;
  if(view.byteOffset+view.byteLength>gltf.buffers[view.buffer].byteLength)throw new Error(`Fallback bufferView ${i} exceeds its placeholder buffer`);
  if(ext.byteOffset+ext.byteLength>bin.length)throw new Error(`Compressed bufferView ${i} exceeds the GLB binary chunk`);
  if(view.byteLength!==ext.byteStride*ext.count)throw new Error(`Compressed bufferView ${i} has an invalid decompressed size`);
}
const json=Buffer.from(JSON.stringify(gltf)); const jsonPad=Buffer.alloc(align4(json.length)-json.length,0x20); const binPad=Buffer.alloc(align4(bin.length)-bin.length);
const total=12+8+json.length+jsonPad.length+8+bin.length+binPad.length;
const header=Buffer.alloc(12); header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(total,8);
const jh=Buffer.alloc(8);jh.writeUInt32LE(json.length+jsonPad.length,0);jh.writeUInt32LE(0x4e4f534a,4);
const bh=Buffer.alloc(8);bh.writeUInt32LE(bin.length+binPad.length,0);bh.writeUInt32LE(0x004e4942,4);
await mkdir('public/models',{recursive:true});
await writeFile('public/models/glhc002-finish.png',finishTexture);
await writeFile('public/models/glhc002-buoy.glb',Buffer.concat([header,jh,json,jsonPad,bh,bin,binPad]));
console.log(JSON.stringify({path:'public/models/glhc002-buoy.glb',bytes:total,compressedBinaryBytes:bin.length,uncompressedGeometryBytes:fallbackOffset,sourceParts:meshes.length,renderMeshes:exportMeshes.length,triangles,materials:materials.length,zeroNormals:normalZeroCount,compression:'EXT_meshopt_compression (meshoptimizer)',roundTripStreams:encodedStreams.length},null,2));
