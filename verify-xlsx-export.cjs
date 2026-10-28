// Builds the browser export in a stubbed DOM and validates the XLSX ZIP package.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync('index.html','utf8'),script=html.slice(html.indexOf('<script>')+8,html.indexOf('</script>'));
const start=script.indexOf('function xCell('),end=script.indexOf("\n['sigci','gsi'",start);
assert.ok(start>=0&&end>start,'Excel exporter source found');
let workbook,filename;
const fields={
 projectName:{value:'North Ridge'},sampleName:{value:'Core-17'},location:{value:'Level 420'},projectDate:{value:'2026-10-28'},H:{value:'100'},gamma:{value:'0.027'},
 statusText:{set textContent(value){this.value=value}}
};
const anchor={click(){},remove(){}};
const $=id=>fields[id]||(fields[id]={value:''});
const calc=()=>({sigci:30,GSI:50,mi:10,D:0,Ei:12000,mb:1.6767724875,s:.0038659201,a:.5057335599,sigt:-.0691671679,sigc:1.8068165655,sigcm:5.2300044164,Erm:3686.2308166,c:1.4941390871,phi:30.5151229,sig3max:7.5,app:'custom',method:'generalized'});
const context={
 $,
 calc,
 state:{unit:'MPa'},
 document:{createElement:()=>anchor,body:{appendChild(){}}},
 URL:{createObjectURL(blob){workbook=blob;return 'blob:test'},revokeObjectURL(){}},
 setTimeout(){},
 Blob,TextEncoder,DataView,console
};
vm.createContext(context);
vm.runInContext(script.slice(start,end)+'\nexportExcel();',context);
(async()=>{
 assert.ok(workbook,'XLSX archive was generated');
 assert.equal(workbook.type,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
 assert.equal(anchor.download,'rock_mass_strength_report.xlsx');
 const bytes=new Uint8Array(await workbook.arrayBuffer()),view=new DataView(bytes.buffer);
 let eocd=-1;for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(view.getUint32(i,true)===0x06054b50){eocd=i;break}
 assert.ok(eocd>=0,'ZIP end record found');
 const count=view.getUint16(eocd+10,true),directoryOffset=view.getUint32(eocd+16,true),directorySize=view.getUint32(eocd+12,true);
 assert.equal(directoryOffset+directorySize,eocd,'ZIP central directory bounds are consistent');
 const entries=new Map();let cursor=directoryOffset;
 for(let i=0;i<count;i++){
  assert.equal(view.getUint32(cursor,true),0x02014b50,'central directory record');
  const method=view.getUint16(cursor+10,true),crc=view.getUint32(cursor+16,true),size=view.getUint32(cursor+24,true),nameLength=view.getUint16(cursor+28,true),extraLength=view.getUint16(cursor+30,true),commentLength=view.getUint16(cursor+32,true),localOffset=view.getUint32(cursor+42,true);
  const name=new TextDecoder().decode(bytes.slice(cursor+46,cursor+46+nameLength));assert.equal(method,0,'stored ZIP entry');
  assert.equal(view.getUint32(localOffset,true),0x04034b50,'local ZIP record');const localName=view.getUint16(localOffset+26,true),localExtra=view.getUint16(localOffset+28,true),dataStart=localOffset+30+localName+localExtra,data=bytes.slice(dataStart,dataStart+size);
  const crcTable=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0});let actual=0xffffffff;for(const b of data)actual=crcTable[(actual^b)&255]^(actual>>>8);assert.equal((actual^0xffffffff)>>>0,crc,`CRC ${name}`);
  entries.set(name,new TextDecoder().decode(data));cursor+=46+nameLength+extraLength+commentLength;
 }
 for(const name of ['[Content_Types].xml','xl/workbook.xml','xl/styles.xml','xl/worksheets/sheet1.xml','xl/worksheets/sheet2.xml','xl/worksheets/sheet3.xml','xl/drawings/drawing1.xml','xl/charts/chart1.xml','xl/charts/chart2.xml'])assert.ok(entries.has(name),`missing ${name}`);
 assert.match(entries.get('xl/workbook.xml'),/Print Report/);assert.match(entries.get('xl/worksheets/sheet1.xml'),/North Ridge/);assert.match(entries.get('xl/worksheets/sheet1.xml'),/Core-17/);assert.match(entries.get('xl/worksheets/sheet1.xml'),/Project inputs|PROJECT INPUTS/);assert.match(entries.get('xl/worksheets/sheet1.xml'),/<drawing r:id="rId1"\/>/);assert.match(entries.get('xl/charts/chart1.xml'),/Principal stress envelope/);assert.match(entries.get('xl/charts/chart2.xml'),/Shear strength envelope/);
 assert.doesNotMatch(entries.get('xl/worksheets/sheet2.xml'),/<drawing\b/);assert.doesNotMatch(entries.get('xl/worksheets/sheet3.xml'),/<drawing\b/);
 if(process.argv.includes('--write'))fs.writeFileSync('xlsx-export-verification.xlsx',Buffer.from(bytes));
 console.log(JSON.stringify({xlsx:'valid ZIP structure',entries:count,charts:2,filename:anchor.download}));
})().catch(error=>{console.error(error);process.exitCode=1});
