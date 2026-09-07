#!/usr/bin/env node
/* Safe editor for site-data.js: parse -> mutate -> assert -> re-emit.
   Usage: node tools-edit-data.js <mutator.js>
   The mutator exports function(data) and returns nothing; data is mutated in place. */
const fs=require("fs");
const F="site-data.js";
const src=fs.readFileSync(F,"utf8");
global.window={};eval(src);
const data=window.RDCA_DATA;
const before=Object.keys(data).length;
const beforeBytes=src.length;
require(require("path").resolve(process.argv[2]))(data);
const after=Object.keys(data).length;
if(after<before){console.error(`REFUSED: key count fell ${before} -> ${after}`);process.exit(1);}
const header=src.split("window.RDCA_DATA = ")[0];
const out=header+"window.RDCA_DATA = "+JSON.stringify(data,null,2)+";\n";
if(out.length<beforeBytes*0.9){console.error(`REFUSED: file would shrink ${beforeBytes} -> ${out.length}`);process.exit(1);}
fs.writeFileSync(F,out);
global.window={};eval(fs.readFileSync(F,"utf8"));
console.log(`OK  keys ${before} -> ${Object.keys(window.RDCA_DATA).length}  bytes ${beforeBytes} -> ${out.length}`);
