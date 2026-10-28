// Dependency-free numerical regression against the pre-redesign implementation.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const original=fs.readFileSync('tests/baseline.html','utf8');
const current=fs.readFileSync('index.html','utf8');
function run(html,values){
 const elements=new Map();
 for(const match of html.matchAll(/<(input|select)[^>]*id="([^"]+)"[^>]*>/g)){
  const value=match[0].match(/value="([^"]*)"/)?.[1]||html.slice(match.index+match[0].length).match(/<option value="([^"]*)"/)?.[1]||'';
  elements.set(match[2],{value,addEventListener(){},classList:{toggle(){}}});
 }
 Object.entries(values).forEach(([id,value])=>elements.get(id).value=value);
 const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const calc=script.slice(script.indexOf('function calc(){'),script.indexOf('function renderMetrics'));
 const context={document:{getElementById:id=>elements.get(id)},validateInputs:()=>true,renderMetrics(){},plotPrincipal(){},plotShear(){},Math,Number};
 vm.createContext(context);vm.runInContext("const $=id=>document.getElementById(id);function fmt(x,n){return x.toFixed(n)};"+calc,context);
 return vm.runInContext('calc()',context);
}
let cases=0;
for(const application of ['custom','general','tunnel','slope'])for(const modMethod of ['generalized','simplified','hcc2002'])for(const gsi of [10,50,90])for(const D of [0,.5,1]){
 const inputs={application,modMethod,gsi,D};const before=run(original,inputs),after=run(current,inputs);
 for(const key of Object.keys(before))assert.equal(after[key],before[key],key+' changed');cases++;
}
const benchmark=run(current,{});
assert.ok(Math.abs(benchmark.c-1.4941)<.00005);assert.ok(Math.abs(benchmark.phi-30.52)<.005);
console.log(JSON.stringify({passed:cases,benchmark},null,2));

