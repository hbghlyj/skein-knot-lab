/* Cut only the underpassing arc; never paint over or replace the overstrand. */
(function(root){
function strandPieces(paths,hits,signs,gap=10){
 const out=[];
 paths.forEach((p,pi)=>{
  const lengths=[0];for(let i=1;i<p.length;i++)lengths.push(lengths.at(-1)+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));
  const total=lengths.at(-1);if(!total)return;
  let cuts=[];
  hits.forEach(h=>{if(signs&&signs[h.id]===undefined)return;const over=signs&&signs[h.id]!==h.sign?!h.over:h.over;
   const ci=over?h.bi:h.ai,seg=over?h.j:h.i,t=over?h.r:h.t;if(ci!==pi)return;
   const s=lengths[seg]+t*(lengths[seg+1]-lengths[seg]);let a=s-gap,b=s+gap;
   if(a<0)cuts.push([total+a,total]);if(b>total)cuts.push([0,b-total]);cuts.push([Math.max(0,a),Math.min(total,b)]);
  });
  cuts.sort((a,b)=>a[0]-b[0]);let merged=[];for(const c of cuts){let last=merged.at(-1);if(last&&c[0]<=last[1])last[1]=Math.max(last[1],c[1]);else merged.push(c.slice());}
  function pointAt(s){for(let i=0;i<p.length-1;i++)if(s<=lengths[i+1]){let l=lengths[i+1]-lengths[i],t=l?(s-lengths[i])/l:0;return [p[i][0]+t*(p[i+1][0]-p[i][0]),p[i][1]+t*(p[i+1][1]-p[i][1])];}return p.at(-1);}
  function piece(a,b){if(b-a<1e-7)return;let ps=[pointAt(a)];for(let i=1;i<p.length-1;i++)if(lengths[i]>a&&lengths[i]<b)ps.push(p[i]);ps.push(pointAt(b));out.push(ps);}
  let start=0;for(const [a,b] of merged){piece(start,a);start=b;}piece(start,total);
 });return out;
}
root.strandPieces=strandPieces;if(typeof module!=='undefined')module.exports=strandPieces;
})(typeof globalThis!=='undefined'?globalThis:window);
