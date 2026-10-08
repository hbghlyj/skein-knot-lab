/* Alexander–Conway skein recursion on oriented Gauss words. No dependencies. */
(function(root){
const add=(a,b,k=1)=>{let c=Array(Math.max(a.length,b.length)).fill(0);c.forEach((_,i)=>c[i]=(a[i]||0)+k*(b[i]||0));while(c.length>1&&!c.at(-1))c.pop();return c;};
const shift=(a,k)=>[0,...a.map(x=>x*k)];
const clone=c=>c.map(w=>w.map(v=>({...v})));
function smooth(comps,id){
 let c=clone(comps),loc=[];c.forEach((w,i)=>w.forEach((v,j)=>{if(v.id===id)loc.push([i,j]);}));
 let [[a,p],[b,q]]=loc;
 if(a===b){let w=c[a];c.splice(a,1,w.slice(p+1,q),[...w.slice(q+1),...w.slice(0,p)]);}
 else {let wa=c[a],wb=c[b],joined=[...wa.slice(p+1),...wa.slice(0,p),...wb.slice(q+1),...wb.slice(0,q)];c[a]=joined;c.splice(b,1);}
 return c;
}
function solve(comps,limit=18000){let count=0,memo=new Map();
 function rec(c){if(++count>limit)throw Error('This diagram has too many recursive branches. Try fewer crossings.');let key=JSON.stringify(c);if(memo.has(key))return {...memo.get(key),cached:true};
 let seen=new Set(),bad=null;for(let w of c){for(let v of w){if(!seen.has(v.id)){seen.add(v.id);if(!v.over){bad=v;break;}}}if(bad)break;}
 let node={components:c.length,crossings:new Set(c.flat().map(v=>v.id)).size,signs:Object.fromEntries(c.flat().map(v=>[v.id,v.sign]))};
 if(!bad){node.poly=[c.length===1?1:0];node.base=true;node.reason=c.length===1?'Descending diagram → unknot':'Descending diagram → '+c.length+'-component unlink';}
 else {let sw=clone(c);sw.flat().forEach(v=>{if(v.id===bad.id){v.over=!v.over;v.sign=-v.sign;}});node.crossing=bad.id;node.sign=bad.sign;node.switched=rec(sw);node.smoothed=rec(smooth(c,bad.id));node.poly=add(node.switched.poly,shift(node.smoothed.poly,bad.sign));}
 memo.set(key,node);return node;
 }let tree=rec(comps);return {tree,poly:tree.poly,states:memo.size,calls:count};}
function format(p,v='z'){let s='';for(let i=p.length-1;i>=0;i--){let a=p[i];if(!a)continue;s+=(s?(a<0?' − ':' + '):(a<0?'−':''));a=Math.abs(a);s+=(a!==1||i===0?a:'')+(i?v+(i===1?'':'<sup>'+i+'</sup>'):'');}return s||'0';}
function alexander(p){let out=new Map();for(let k=0;k<p.length;k++){if(!p[k])continue;let bin=1;for(let j=0;j<=k;j++){let e=k-2*j;out.set(e,(out.get(e)||0)+p[k]*bin*(j%2?-1:1));bin=bin*(k-j)/(j+1);}}return [...out].sort((a,b)=>b[0]-a[0]).filter(x=>x[1]);}
function formatAlexander(p){let s='';for(let [e,a] of alexander(p)){s+=(s?(a<0?' − ':' + '):(a<0?'−':''));a=Math.abs(a);s+=(a!==1||e===0?a:'');if(e)s+='t'+(e===2?'':'<sup>'+(e%2?e+'/2':e/2)+'</sup>');}return s||'0';}
function intersections(paths,choices={}){let hits=[],eps=1e-7;
paths.forEach((a,ai)=>paths.forEach((b,bi)=>{if(bi<ai)return;for(let i=0;i<a.length-1;i++)for(let j=0;j<b.length-1;j++){
 if(ai===bi&&(j<=i+1||(i===0&&j===a.length-2)))continue;
 let u=[a[i+1][0]-a[i][0],a[i+1][1]-a[i][1]],v=[b[j+1][0]-b[j][0],b[j+1][1]-b[j][1]],d=u[0]*v[1]-u[1]*v[0];if(Math.abs(d)<eps)continue;
 let w=[b[j][0]-a[i][0],b[j][1]-a[i][1]],t=(w[0]*v[1]-w[1]*v[0])/d,r=(w[0]*u[1]-w[1]*u[0])/d;
 if(t<=eps||t>=1-eps||r<=eps||r>=1-eps)continue;
 let id=hits.length+1,key=ai+':'+i+':'+bi+':'+j,over=choices[key]??true;
 // Screen y is inverted: positive crossing is det(over tangent, under tangent)<0.
 hits.push({id,key,ai,bi,i,j,t,r,u,v,over,sign:(d<0?1:-1)*(over?1:-1),x:a[i][0]+t*u[0],y:a[i][1]+t*u[1]});
 }}));let comps=paths.map((_,pi)=>{let visits=[];hits.forEach(h=>{if(h.ai===pi)visits.push({pos:h.i+h.t,id:h.id,over:h.over,sign:h.sign});if(h.bi===pi)visits.push({pos:h.j+h.r,id:h.id,over:!h.over,sign:h.sign});});return visits.sort((a,b)=>a.pos-b.pos).map(({pos,...x})=>x);});return {hits,comps};}
const api={solve,smooth,format,formatAlexander,alexander,intersections,add};root.Skein=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
