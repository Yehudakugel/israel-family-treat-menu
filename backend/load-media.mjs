// Bulk-load trip media into the backend: node load-media.mjs <API base> <media dir> ; env ADMIN_TOKEN
// Skips files already present with the same size (HEAD). 4 parallel uploads, 3 retries each.
import fs from 'fs';import path from 'path';
const [,,API,DIR]=process.argv,TOK=process.env.ADMIN_TOKEN;if(!API||!DIR||!TOK){console.error('usage: ADMIN_TOKEN=... node load-media.mjs <api> <dir>');process.exit(1)}
const MIME={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',mp4:'video/mp4'};
const files=[];(function walk(d,r){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(/^(private)$/i.test(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p,r+e.name+'/');else if(MIME[e.name.split('.').pop().toLowerCase()])files.push([r+e.name,p])}})(DIR,'');
async function big(rel,p,sz){const A=API.replace(/\/$/,''),H={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  const st=await (await fetch(A+'/api/upload/start',{method:'POST',headers:H,body:JSON.stringify({type:MIME[rel.split('.').pop().toLowerCase()],size:sz,mediaPath:rel})})).json();if(!st.id)throw new Error(JSON.stringify(st));
  const fd=fs.openSync(p,'r'),parts=[];for(let n=1,o=0;o<sz;n++,o+=st.partSize){const len=Math.min(st.partSize,sz-o),buf=Buffer.alloc(len);fs.readSync(fd,buf,0,len,o);
    const r=await (await fetch(A+'/api/upload/'+st.id+'/part/'+n,{method:'PUT',headers:{Authorization:'Bearer '+TOK},body:buf})).json();if(!r.etag)throw new Error('part '+n);parts.push({n,etag:r.etag})}
  fs.closeSync(fd);const f=await fetch(A+'/api/upload/'+st.id+'/finish',{method:'POST',headers:H,body:JSON.stringify({parts})});if(f.status!==201)throw new Error('finish '+f.status)}
let done=0,skip=0,fail=0,bytes=0;const t0=Date.now();
async function one([rel,p]){const sz=fs.statSync(p).size,url=API.replace(/\/$/,'')+'/media/'+rel.split('/').map(encodeURIComponent).join('/');
  try{const h=await fetch(url,{method:'HEAD'});if(h.ok&&+h.headers.get('content-length')===sz){skip++;return}}catch(e){}
  if(sz>90e6){for(let i=0;i<3;i++){try{await big(rel,p,sz);done++;bytes+=sz;return}catch(e){console.error('ERR big',rel,e.message)}}fail++;return}
  for(let i=0;i<3;i++){try{const r=await fetch(API.replace(/\/$/,'')+'/api/admin/media/'+rel.split('/').map(encodeURIComponent).join('/'),{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':MIME[rel.split('.').pop().toLowerCase()]},body:fs.readFileSync(p)});if(r.ok){done++;bytes+=sz;return}console.error('HTTP',r.status,rel)}catch(e){console.error('ERR',rel,e.message)}await new Promise(r=>setTimeout(r,2000*(i+1)))}fail++}
let i=0;await Promise.all([0,1,2,3].map(async()=>{while(i<files.length){const f=files[i++];await one(f);if((done+skip+fail)%100===0)console.log(`${done+skip+fail}/${files.length} (${(bytes/1e6).toFixed(0)}MB, ${((Date.now()-t0)/1000).toFixed(0)}s)`)}}));
console.log(`done ${done}, already there ${skip}, failed ${fail}, ${(bytes/1e6).toFixed(0)}MB in ${((Date.now()-t0)/1000).toFixed(0)}s`);process.exit(fail?1:0);
