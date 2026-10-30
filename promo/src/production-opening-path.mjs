// Shape-preserving cubic interpolation: continuous velocity without the rough
// pass's full stop at every waypoint. End pose matches the approved science handoff.
function curve(times,values){
 const n=times.length,slopes=Array(n-1),tangents=Array(n).fill(0);
 for(let i=0;i<n-1;i++)slopes[i]=(values[i+1]-values[i])/(times[i+1]-times[i]);
 for(let i=1;i<n-1;i++){
  if(slopes[i-1]*slopes[i]<=0)continue;
  const a=times[i]-times[i-1],b=times[i+1]-times[i],w1=2*b+a,w2=b+2*a;
  tangents[i]=(w1+w2)/(w1/slopes[i-1]+w2/slopes[i]);
 }
 return t=>{
  if(t<=times[0])return values[0];if(t>=times[n-1])return values[n-1];
  let i=0;while(t>times[i+1])i++;
  const h=times[i+1]-times[i],u=(t-times[i])/h;
  return (2*u**3-3*u*u+1)*values[i]+(u**3-2*u*u+u)*h*tangents[i]+(-2*u**3+3*u*u)*values[i+1]+(u**3-u*u)*h*tangents[i+1];
 };
}
const ct=[0,2.2,4,6.2,7.8,8.5,9,10.1,11.4,12.8,13.5];
const camera=[curve(ct,[-63.1,-63.5,-63,-55,-49,-46,-43,-31,-18,-6,-5.5]),curve(ct,[3.2,1.2,-1.1,-1.3,-1.5,-.7,1.8,3.5,3,2.8,2.8]),curve(ct,[6.8,5.7,5.1,8.5,9,10,10,9,8,7.5,7.5])];
const target=[curve(ct,[-67,-67,-66,-58,-53,-50,-33,-8,0,0,0]),curve(ct,[1,.1,-1.5,-2.1,-1.7,-.6,.7,.9,.8,.7,.7]),curve(ct,[0,0,1.2,2.2,.7,1,0,0,0,0,0])];
const glider=[curve([0,3.3,4.4,6.2,7.8,9.5,13.5],[-67,-67,-65,-58,-53,-49,-43]),curve([0,2.3,3.3,5.4,7.8,10.5,13.5],[2.25,.2,-.75,-2.3,-2.5,-2.2,-2.5]),curve([0,3.3,5.8,8.3,10.8,13.5],[0,0,1.7,.6,1.6,5])];
export function productionOpeningPath(t){return {camera:camera.map(fn=>fn(t)),target:target.map(fn=>fn(t)),glider:glider.map(fn=>fn(t))};}
