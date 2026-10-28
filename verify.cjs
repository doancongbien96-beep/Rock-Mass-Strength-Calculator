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
const close=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);

// H2002 worked example: sigci=50 MPa, GSI=45, mi=10, D=0, H=100 m,
// gamma=0.027 MN/m3. The paper reports c'=0.58 MPa and phi'=47.16 degrees.
const paperExample=run(current,{application:'tunnel',modMethod:'hcc2002',sigci:50,gsi:45,mi:10,D:0,H:100,gamma:.027});
close(paperExample.c,.5833982590472196);
close(paperExample.phi,47.15542156750466);
close(paperExample.sig3max,1.3525030611665723);

// Independently check the HCC2002 modulus split around sigci=100 MPa.
for(const sigci of [50,100,100.0001,300])for(const gsi of [25,50,90])for(const D of [0,.5,1]){
 const result=run(current,{application:'custom',modMethod:'hcc2002',sigci,gsi,D});
 const expected=1000*(1-D/2)*(sigci<=100?Math.sqrt(sigci/100):1)*Math.pow(10,(gsi-10)/40);
 close(result.Erm,expected,1e-8);cases++;
}
console.log(JSON.stringify({passed:cases,paperExample,benchmark},null,2));

