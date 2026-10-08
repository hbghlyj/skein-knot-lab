const assert=require('node:assert/strict'),S=require('./dist/engine.js');
let checked=0;
function audit(n){checked++;const under=n.traversal.flatMap(c=>c.visits).filter(v=>v.first&&!v.over);assert.equal(n.badCount,under.length);
 if(n.base){assert.equal(n.badCount,0);assert.deepEqual(n.poly,[n.components===1?1:0]);return;}
 assert.equal(n.crossing,under[0].id,'Always choose the first under-first crossing');
 assert.equal(n.switched.badCount,n.badCount-1,'Switching strictly decreases under-first crossings');
 assert.equal(n.switched.crossings,n.crossings);assert.equal(n.smoothed.crossings,n.crossings-1);
 assert.deepEqual(n.switched.traversal.map(c=>c.visits.map(v=>v.id)),n.traversal.map(c=>c.visits.map(v=>v.id)),'Switched branch keeps the component order and basepoints');
 audit(n.switched);audit(n.smoothed);
}
for(let size=1;size<=6;size++)for(let mask=0;mask<(1<<size);mask++){let words=[[],[]];for(let c=0;c<2;c++)for(let i=0;i<size;i++){let flip=Boolean(mask&(1<<i));words[c].push({id:i+1,over:((c+i)%2===0)!==flip,sign:flip?-1:1});}audit(S.solve(size%2?[[...words[0],...words[1]]]:words).tree);}
console.log('Verified systematic choice, fixed traversals, base cases, and decreasing recursion measures in '+checked+' states.');
