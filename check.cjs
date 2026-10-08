const assert=require('node:assert/strict'),S=require('./dist/engine.js');
// Standard oriented Gauss words for closures of positive two-strand braids.
function braid(n){let words=[[],[]];for(let s=0;s<2;s++)for(let k=0;k<n;k++)words[s].push({id:k+1,over:(s+k)%2===0,sign:1});return n%2?[[...words[0],...words[1]]]:words;}
for(let [n,p] of [[0,[0]],[1,[1]],[2,[0,1]],[3,[1,0,1]],[4,[0,2,0,1]],[5,[1,0,3,0,1]],[7,[1,0,6,0,5,0,1]]]){let c=n?braid(n):[[],[]];assert.deepEqual(S.solve(c).poly,p,'T(2,'+n+')');let mirror=c.map(w=>w.map(v=>({...v,over:!v.over,sign:-v.sign})));assert.deepEqual(S.solve(mirror).poly,p.map((v,i)=>i%2&&v?-v:v),'mirror '+n);}
assert.deepEqual(S.alexander([1,0,3,0,1]),[[4,1],[2,-1],[0,1],[-2,-1],[-4,1]]);
assert.deepEqual(S.solve([[]]).poly,[1]);assert.deepEqual(S.solve([[],[],[]]).poly,[0]);
console.log('Passed: braid family, mirrors, unknot/unlinks, and cinquefoil substitution.');

