// One continuous lateral move through the same physical waterfront scene.
const ease=x=>{const p=Math.max(0,Math.min(1,x));return p*p*p*(p*(p*6-15)+10)};
export function waterfrontMotion(frame){
 const centre=48*ease((frame-45)/24)+48*ease((frame-83)/22);
 const drift=ease(frame/211);
 return {centre,camera:[centre+6.5-drift*1.8,3.8-drift*.2,10.5-drift*.5],target:[centre,1.15,-9.5]};
}
