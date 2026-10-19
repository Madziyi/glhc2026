/**
 * Deterministic, procedural GLB source for the GLHC-002 feasibility prototype.
 * This is a visual model, not engineering CAD. Units are relative to a 38-inch
 * hull diameter; see docs/GLHC-V2-SPEC.md for the approved visual authority.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { MeshoptEncoder } from 'meshoptimizer/encoder';
import { MeshoptDecoder } from 'meshoptimizer/decoder';
await MeshoptEncoder.ready;
await MeshoptDecoder.ready;

const meshes = [];
const materials = [
  { name: 'Buoy safety yellow', pbrMetallicRoughness: { baseColorFactor: [1, 0.68, 0.035, 1], metallicFactor: 0.08, roughnessFactor: 0.33 } },
  { name: 'Warm yellow edge', pbrMetallicRoughness: { baseColorFactor: [0.82, 0.43, 0.018, 1], metallicFactor: 0.12, roughnessFactor: 0.42 } },
  { name: 'Solar frame charcoal', pbrMetallicRoughness: { baseColorFactor: [0.105, 0.13, 0.15, 1], metallicFactor: 0.45, roughnessFactor: 0.38 } },
  { name: 'Blue black solar cells', pbrMetallicRoughness: { baseColorFactor: [0.022, 0.065, 0.105, 1], metallicFactor: 0.42, roughnessFactor: 0.25 } },
  { name: 'Brushed marine aluminum', pbrMetallicRoughness: { baseColorFactor: [0.63, 0.71, 0.73, 1], metallicFactor: 0.78, roughnessFactor: 0.28 } },
  { name: 'Sonde blue', pbrMetallicRoughness: { baseColorFactor: [0.035, 0.19, 0.62, 1], metallicFactor: 0.28, roughnessFactor: 0.3 } },
  { name: 'Sonde black', pbrMetallicRoughness: { baseColorFactor: [0.035, 0.045, 0.05, 1], metallicFactor: 0.36, roughnessFactor: 0.33 } },
  { name: 'Red ballast', pbrMetallicRoughness: { baseColorFactor: [0.52, 0.09, 0.07, 1], metallicFactor: 0.25, roughnessFactor: 0.42 } },
  { name: 'Dark hardware', pbrMetallicRoughness: { baseColorFactor: [0.12, 0.15, 0.16, 1], metallicFactor: 0.75, roughnessFactor: 0.3 } },
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
function box(name, x, y, z, w, h, d, material) {
  const X = w / 2, Y = h / 2, Z = d / 2;
  const p = [-X,-Y,-Z, X,-Y,-Z, X,Y,-Z, -X,Y,-Z, -X,-Y,Z, X,-Y,Z, X,Y,Z, -X,Y,Z];
  const idx = [0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,3,7,6,3,6,2,0,4,7,0,7,3,1,2,6,1,6,5];
  geometry(name, p, idx, material, [x,y,z]);
}
function cyl(name, x, y, z, radius, height, material, sides = 20, topRadius = radius) {
  const p = [], idx = [];
  for (let j = 0; j < 2; j++) { const r = j ? topRadius : radius, yy = j ? height / 2 : -height / 2; for (let i = 0; i < sides; i++) { const a = (i / sides) * Math.PI * 2; p.push(Math.cos(a) * r, yy, Math.sin(a) * r); } }
  for (let i = 0; i < sides; i++) { const n = (i + 1) % sides; idx.push(i, n, sides + n, i, sides + n, sides + i, 2 * sides, n, i, 2 * sides + 1, sides + i, sides + n); }
  p.push(0, -height / 2, 0, 0, height / 2, 0);
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

// Hull: broad cylindrical float with a lower shoulder that narrows toward the cage.
cyl('thick yellow circular float',0,0,0,1.66,1.1,0,48,1.66);
cyl('beveled underside shoulder',0,-0.68,0,1.43,0.27,0,48,1.66);
cyl('yellow bottom boss',0,-0.73,0,0.82,0.28,1,32,0.77);
torus('deck seam',0,-0.02,0,1.663,0.012,1,48,6);
// Triangular mast legs and the solar tower; front face is toward negative Z.
for (const sx of [-1,1]) for (const sz of [-1,1]) tube('tower support', [sx*0.48,0.49,sz*0.43],[sx*0.56,2.58,sz*0.5],0.035,2,8);
box('square solar tower frame',0,1.52,0,1.24,2.08,1.18,2);
box('front photovoltaic panel',0,1.53,-0.603,1.03,1.78,0.028,3);
for(let i=1;i<6;i++) box('solar vertical cell seam',-0.515+i*1.03/6,1.53,-0.625,0.009,1.72,0.006,4);
for(let i=1;i<9;i++) box('solar horizontal cell seam',0,0.64+i*1.78/9,-0.625,0.98,0.009,0.006,4);
// Top guard ring and small weather sensor.
torus('upper circular guard rail',0,2.69,0,0.95,0.034,4,40,8);
for(const x of [-0.68,0.68]) tube('guard ring brace',[x,2.56,0],[x*1.34,2.68,0],0.028,4,8);
cyl('weather sensor base',0,2.76,0,0.25,0.2,2,16);
cyl('compact weather instrument',0,2.96,0,0.16,0.24,4,18,0.13);
box('weather vane',0,3.12,0,0.08,0.18,0.34,4);
tube('weather sensor mast',[0,3.18,0],[0,3.36,0],0.015,8,8);
cyl('weather sensor head',0,3.42,0,0.055,0.1,4,12,0.045);
// Under-hull fittings and the slim right-hand secondary probe visible in authority image.
for(const x of [-0.54,0.54]) box('underdeck mounting plate',x,-0.65,0,0.33,0.11,0.34,8);
tube('secondary probe mount',[1.25,-0.6,0.15],[1.42,-0.95,0.15],0.075,8,12);
cyl('secondary silver sensor',1.42,-1.02,0.15,0.1,0.22,4,16,0.06);
// Open rounded rectangular marine cage: four rails, cross plates and rounded ends.
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
for(const yy of [-1.55,-2.94]) {
  box('perforated horizontal cage plate',cx,yy,cz,cw+0.04,0.075,cd+0.04,4);
  for(const x of [-0.18,0,0.18]) for(const z of [-0.15,0.15]) cyl('plate perforation dark inset',cx+x,yy+0.039,cz+z,0.027,0.005,8,8);
}
// Forward-left sonde, partly blue and mostly black, suspended within cage upper section.
cyl('blue sonde body',-0.21,-1.46,-0.30,0.105,1.03,5,18,0.095);
cyl('black sonde lower housing',-0.21,-2.11,-0.30,0.102,0.43,6,18,0.067);
cyl('sonde end cap',-0.21,-2.34,-0.30,0.068,0.1,8,16,0.035);
box('sonde connector',-0.21,-0.9,-0.30,0.17,0.13,0.17,8);
tube('sonde cable',[0.0,-0.78,0.08],[-0.08,-0.94,-0.08],0.018,8,8);
// Red ballast hangs directly below the cage with a small metal shackle and mooring line.
cyl('red ballast cylinder',0.04,-4.34,0.02,0.32,0.76,7,24,0.32);
cyl('ballast cap',0.04,-3.94,0.02,0.19,0.08,8,16,0.16);
tube('ballast shackle',[0.04,-4.75,0.02],[0.04,-4.94,0.02],0.025,4,8);
tube('mooring line',[0.04,-4.93,0.02],[0.04,-5.58,0.02],0.012,8,8);

// Merge all procedural parts sharing a material into one mesh each to keep draw calls low.
const groups = materials.map((_, material) => ({ name: materials[material].name, material, positions: [], normals: [], indices: [] }));
function rotateVector(v, q) {
  const [qx,qy,qz,qw]=q, [x,y,z]=v;
  const ix=qw*x+qy*z-qz*y, iy=qw*y+qz*x-qx*z, iz=qw*z+qx*y-qy*x, iw=-qx*x-qy*y-qz*z;
  return [ix*qw+iw*-qx+iy*-qz-iz*-qy,iy*qw+iw*-qy+iz*-qx-ix*-qz,iz*qw+iw*-qz+ix*-qy-iy*-qx];
}
for(const m of meshes){
  const g=groups[m.material], offset=g.positions.length/3, [tx,ty,tz]=m.color;
  for(let i=0;i<m.positions.length;i+=3){const v=m.rotation?rotateVector(m.positions.slice(i,i+3),m.rotation):m.positions.slice(i,i+3);g.positions.push(v[0]+tx,v[1]+ty,v[2]+tz);}
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
  const idxId=addBuffer(m.indices,5123,'SCALAR',m.indices.length,34963,null,null,'INDICES',2);
  const meshId=gltfMeshes.length;
  gltfMeshes.push({name:m.name,primitives:[{attributes:{POSITION:posId,NORMAL:normalId},indices:idxId,material:m.material,mode:4}]});
  const node={name:m.name,mesh:meshId}; nodes.push(node); triangles+=m.indices.length/3;
}
const bin=Buffer.concat(chunks);
for(const [i,s] of encodedStreams.entries()){
  const decoded=new Uint8Array(s.count*s.stride);
  MeshoptDecoder.decodeGltfBuffer(decoded,s.count,s.stride,s.compressed,s.mode);
  if(decoded.some((v,j)=>v!==s.raw[j])){const mismatch=s.raw.findIndex((v,j)=>v!==decoded[j]);throw new Error(`Meshopt round-trip failed for stream ${i} (${s.mode}, ${s.count}×${s.stride}) at byte ${mismatch}: ${s.raw[mismatch]} != ${decoded[mismatch]}`);}
}
const normalZeroCount=exportMeshes.reduce((sum,m)=>{for(let i=0;i<m.normals.length;i+=3)if(Math.hypot(m.normals[i],m.normals[i+1],m.normals[i+2])<1e-5)sum++;return sum;},0);
if(normalZeroCount)throw new Error(`Model contains ${normalZeroCount} zero-length normals`);
const gltf={asset:{version:'2.0',generator:'GLHC-002 procedural buoy source'},extensionsUsed:['EXT_meshopt_compression'],extensionsRequired:['EXT_meshopt_compression'],scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes:gltfMeshes,materials,accessors,bufferViews:views,buffers:[{byteLength:bin.length},{byteLength:fallbackOffset,extensions:{EXT_meshopt_compression:{fallback:true}}}]};
for(const [i,view] of views.entries()){
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
await writeFile('public/models/glhc002-buoy.glb',Buffer.concat([header,jh,json,jsonPad,bh,bin,binPad]));
console.log(JSON.stringify({path:'public/models/glhc002-buoy.glb',bytes:total,compressedBinaryBytes:bin.length,uncompressedGeometryBytes:fallbackOffset,sourceParts:meshes.length,renderMeshes:exportMeshes.length,triangles,materials:materials.length,zeroNormals:normalZeroCount,compression:'EXT_meshopt_compression (meshoptimizer)',roundTripStreams:encodedStreams.length},null,2));
