import {surfaceHeightAt,rippleHeight} from '../../src/scripts/glhc002/waves.mjs';
// Matches the production water vertex field, including its local XY -> world XZ rotation.
export function productionWaterHeight(x,z,seconds){
 const y=-z,time=seconds*1.25,r=Math.hypot(x,y),p=Math.max(0,Math.min(1,(r-30)/80)),blend=p*p*(3-2*p);
 const far=Math.sin(x*.007+y*.011+time*.24)*.12+Math.sin(x*-.012+y*.006-time*.19)*.07;
 return .72*(surfaceHeightAt(x,y,time)*(1-blend)+far*blend+(r<24?rippleHeight(x,y,time):0));
}
