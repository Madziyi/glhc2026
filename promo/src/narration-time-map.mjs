// Monotonic cue interpolation with natural endpoint speed. Camera paths already
// have their own easing; a time map must not add a stop at each scene boundary.
export function narrationTimeMap(times,values){
 const n=times.length,slopes=times.slice(0,-1).map((t,i)=>(values[i+1]-values[i])/(times[i+1]-t));
 const tangent=Array(n).fill(0);tangent[0]=slopes[0];tangent[n-1]=slopes[n-2];
 for(let i=1;i<n-1;i++){
  if(slopes[i-1]*slopes[i]<=0)continue;
  const a=times[i]-times[i-1],b=times[i+1]-times[i],w1=2*b+a,w2=b+2*a;
  tangent[i]=(w1+w2)/(w1/slopes[i-1]+w2/slopes[i]);
 }
 return t=>{
  if(t<=times[0])return values[0];if(t>=times[n-1])return values[n-1];
  let i=0;while(t>times[i+1])i++;
  const h=times[i+1]-times[i],p=(t-times[i])/h;
  return (2*p**3-3*p*p+1)*values[i]+(p**3-2*p*p+p)*h*tangent[i]+(-2*p**3+3*p*p)*values[i+1]+(p**3-p*p)*h*tangent[i+1];
 };
}
