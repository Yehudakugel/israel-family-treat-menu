/* Bernshtein family hub backend: media hosting, family uploads, song-request queue, finished songs.
   No dependencies (Node 18+). All data lives under DATA_DIR (a persistent disk).
   Env: DATA_DIR (default ./data), FAMILY_PASS (uploads & requests), ADMIN_TOKEN (admin API), ALLOW_ORIGINS (comma list), PORT */
'use strict';
const http=require('http'),fs=require('fs'),fsp=fs.promises,path=require('path'),crypto=require('crypto');
const DATA=path.resolve(process.env.DATA_DIR||'./data'),PASS=process.env.FAMILY_PASS||'',ADMIN=process.env.ADMIN_TOKEN||'';
const ORIGINS=(process.env.ALLOW_ORIGINS||'https://yehudakugel.github.io,http://127.0.0.1:8877,http://localhost:8877').split(',').map(s=>s.trim()).filter(Boolean);
const MAXUP=+(process.env.MAX_UPLOAD_MB||400)*1048576;
for(const d of ['uploads','media','songs','tmp'])fs.mkdirSync(path.join(DATA,d),{recursive:true});
const DBF=path.join(DATA,'db.json');
let db={uploads:[],requests:[],songs:[],notes:[],pending:[]};
try{db=Object.assign(db,JSON.parse(fs.readFileSync(DBF,'utf8')))}catch(e){}
let saving=Promise.resolve();
function save(){saving=saving.then(async()=>{const t=DBF+'.tmp';await fsp.writeFile(t,JSON.stringify(db));await fsp.rename(t,DBF)}).catch(e=>console.error('save',e));return saving}
const MIME={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.heic':'image/heic','.mp4':'video/mp4','.mov':'video/quicktime','.m4v':'video/x-m4v','.webm':'video/webm','.mp3':'audio/mpeg','.json':'application/json'};
const EXT={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/gif':'.gif','image/heic':'.heic','image/heif':'.heic','video/mp4':'.mp4','video/quicktime':'.mov','video/x-m4v':'.m4v','video/webm':'.webm','audio/mpeg':'.mp3','audio/mp3':'.mp3'};
const id=()=>Date.now().toString(36)+crypto.randomBytes(4).toString('hex');
const eq=(a,b)=>{a=Buffer.from(String(a));b=Buffer.from(String(b));return a.length===b.length&&crypto.timingSafeEqual(a,b)};
const clip=(s,n)=>String(s==null?'':s).slice(0,n||500);
function cors(req,res){const o=req.headers.origin;if(o&&ORIGINS.includes(o)){res.setHeader('Access-Control-Allow-Origin',o);res.setHeader('Vary','Origin')}
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization,X-Pass,X-Meta');res.setHeader('Access-Control-Max-Age','86400');res.setHeader('Access-Control-Expose-Headers','Content-Length,Content-Range,Accept-Ranges')}
function send(res,code,obj){const b=JSON.stringify(obj);res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(b)}
function readJSON(req,max){return new Promise((ok,no)=>{let n=0,c=[];req.on('data',d=>{n+=d.length;if(n>(max||1e6)){no(new Error('too big'));req.destroy()}else c.push(d)});req.on('end',()=>{try{ok(JSON.parse(Buffer.concat(c).toString('utf8')||'{}'))}catch(e){no(e)}});req.on('error',no)})}
function readFile(req,dest,max){return new Promise((ok,no)=>{const tmp=path.join(DATA,'tmp',id());const w=fs.createWriteStream(tmp);let n=0;
  req.on('data',d=>{n+=d.length;if(n>max){w.destroy();fs.unlink(tmp,()=>{});no(Object.assign(new Error('File too large'),{code:413}));req.destroy()}});
  req.pipe(w);w.on('finish',async()=>{try{if(!n)throw Object.assign(new Error('Empty file'),{code:400});await fsp.mkdir(path.dirname(dest),{recursive:true});await fsp.rename(tmp,dest);ok(n)}catch(e){fs.unlink(tmp,()=>{});no(e)}});w.on('error',no);req.on('error',no)})}
function meta(req){try{return JSON.parse(decodeURIComponent(req.headers['x-meta']||'')||'{}')}catch(e){return{}}}
const famOK=req=>PASS&&eq(req.headers['x-pass']||'',PASS);
const adminOK=req=>ADMIN&&eq((req.headers.authorization||'').replace(/^Bearer\s+/i,''),ADMIN);
function safeJoin(root,rel){const p=path.resolve(root,'.'+path.sep+decodeURIComponent(rel));if(!p.startsWith(root+path.sep))return null;if(/(^|[\\/])(private)([\\/]|$)/i.test(rel))return null;return p}
async function serveFile(req,res,file,immutable){let st;try{st=await fsp.stat(file);if(!st.isFile())throw 0}catch(e){return send(res,404,{error:'not found'})}
  const type=MIME[path.extname(file).toLowerCase()]||'application/octet-stream',h={'Content-Type':type,'Accept-Ranges':'bytes','Cache-Control':immutable?'public, max-age=31536000, immutable':'public, max-age=300','Last-Modified':st.mtime.toUTCString()};
  const r=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');
  if(r){let s=r[1]===''?Math.max(0,st.size-(+r[2])):+r[1],e=r[1]!==''&&r[2]!==''?Math.min(+r[2],st.size-1):st.size-1;if(s>e||s>=st.size){res.writeHead(416,{'Content-Range':'bytes */'+st.size});return res.end()}
    res.writeHead(206,Object.assign(h,{'Content-Range':`bytes ${s}-${e}/${st.size}`,'Content-Length':e-s+1}));if(req.method==='HEAD')return res.end();return fs.createReadStream(file,{start:s,end:e}).pipe(res)}
  res.writeHead(200,Object.assign(h,{'Content-Length':st.size}));if(req.method==='HEAD')return res.end();fs.createReadStream(file).pipe(res)}
const pubUpload=u=>({id:u.id,type:u.type,src:'files/uploads/'+u.file,thumb:u.thumb?'files/uploads/'+u.thumb:null,w:u.w||null,h:u.h||null,by:u.by||'',caption:u.caption||'',people:u.people||[],trip:u.trip||null,date:u.date});
const pubSong=s=>({id:s.id,t:s.t,th:s.th||null,te:s.te||null,g:s.g||'yi',y:s.y||'celebration',p:s.p||[],st:s.st||s.p||[],d:s.d||0,s:s.audio?'files/songs/'+s.audio:null,c:s.cover?'files/songs/'+s.cover:null,lyrics:s.lyrics||[],date:s.date,a:'new'});
const KINDS=new Set(['bday','trip','shabbos','funny','thanks','other']),LANGS=new Set(['yi','he','en']),STY=new Set(['upbeat','funny','lullaby','niggun','heart']);

const server=http.createServer(async(req,res)=>{
  cors(req,res);if(req.method==='OPTIONS'){res.writeHead(204);return res.end()}
  const u=new URL(req.url,'http://x'),p=u.pathname,m=req.method;
  try{
    if(p==='/'||p==='/api/health')return send(res,200,{ok:true,uploads:db.uploads.length,songs:db.songs.length,pending:db.requests.filter(r=>r.status==='pending').length});
    /* ----- public reads ----- */
    if((m==='GET'||m==='HEAD')&&p.startsWith('/files/')){const rel=p.slice(7),f=safeJoin(DATA,rel);if(!f||!/^(uploads|songs|media)\//.test(rel))return send(res,404,{error:'not found'});return serveFile(req,res,f,/^(media|uploads)\//.test(rel))}
    if((m==='GET'||m==='HEAD')&&p.startsWith('/media/')){const f=safeJoin(path.join(DATA,'media'),p.slice(7));if(!f)return send(res,404,{error:'not found'});return serveFile(req,res,f,true)}
    if(m==='GET'&&p==='/api/new')return send(res,200,{items:db.uploads.filter(x=>!x.hidden).slice().reverse().map(pubUpload)});
    if(m==='GET'&&p==='/api/songs')return send(res,200,{songs:db.songs.filter(s=>s.audio&&!s.hidden).slice().reverse().map(pubSong)});
    if(m==='POST'&&p==='/api/check'){return send(res,famOK(req)?200:401,{ok:famOK(req)})}
    /* ----- family (passcode) ----- */
    if(m==='PUT'&&p==='/api/upload'){if(!famOK(req))return send(res,401,{error:'Wrong family passcode'});
      const ty=(req.headers['content-type']||'').split(';')[0].toLowerCase(),ext=EXT[ty];if(!ext||!/^(image|video)\//.test(ty))return send(res,415,{error:'Only photos and videos'});
      const md=meta(req),i=id(),file=i+ext,n=await readFile(req,path.join(DATA,'uploads',file),MAXUP);
      const rec={id:i,file,type:ty.startsWith('video')?'video':'photo',mime:ty,size:n,by:clip(md.by,60),caption:clip(md.caption,300),people:(Array.isArray(md.people)?md.people:[]).map(x=>clip(x,20)).slice(0,10),trip:md.trip?clip(md.trip,60):null,w:+md.w||null,h:+md.h||null,date:new Date().toISOString(),orig:clip(md.name,120)};
      db.uploads.push(rec);await save();return send(res,201,{ok:true,item:pubUpload(rec)})}
    /* chunked uploads (same protocol as the Cloudflare worker) */
    if(p.startsWith('/api/upload/')&&!/\/thumb$/.test(p)){if(!famOK(req)&&!adminOK(req))return send(res,401,{error:'Wrong family passcode'});const seg=p.split('/').slice(3);
      if(m==='POST'&&seg[0]==='start'){const b=await readJSON(req,2e4);const ty=clip(b.type,60).toLowerCase(),ext=EXT[ty];if(!ext||!/^(image|video)\//.test(ty))return send(res,415,{error:'Only photos and videos'});
        if(!(b.size>0)||b.size>MAXUP)return send(res,413,{error:'File too large'});let mp=null;if(b.mediaPath){if(!adminOK(req))return send(res,401,{error:'admin token required'});mp=clip(b.mediaPath,200);if(!safeJoin(path.join(DATA,'media'),mp)||!/\.(jpe?g|png|webp|mp4)$/i.test(mp))return send(res,400,{error:'bad path'})}
        const i=id();db.pending.push({id:i,ext,mime:ty,meta:b.meta||{},media:mp,created:new Date().toISOString()});await save();return send(res,200,{id:i,partSize:10*1048576})}
      const pd=db.pending.find(x=>x.id===seg[0]);if(!pd)return send(res,404,{error:'unknown upload'});
      if(m==='PUT'&&seg[1]==='part'){const n=+seg[2];if(!(n>=1&&n<=10000))return send(res,400,{error:'bad part'});const sz=await readFile(req,path.join(DATA,'tmp',pd.id+'.'+n),11*1048576);return send(res,200,{n,etag:pd.id+'-'+n+'-'+sz})}
      if(m==='POST'&&seg[1]==='finish'){const b=await readJSON(req,1e6);const ns=(b.parts||[]).map(x=>+x.n).sort((a,c)=>a-c);if(!ns.length)return send(res,400,{error:'no parts'});
        const file=pd.id+pd.ext,dest=pd.media?safeJoin(path.join(DATA,'media'),pd.media):path.join(DATA,'uploads',file);await fsp.mkdir(path.dirname(dest),{recursive:true});const w=fs.createWriteStream(dest);let total=0;
        for(const n of ns){const f=path.join(DATA,'tmp',pd.id+'.'+n);const buf=await fsp.readFile(f);total+=buf.length;if(!w.write(buf))await new Promise(r=>w.once('drain',r));}
        await new Promise((r,j)=>{w.end(r);w.on('error',j)});for(const n of ns)fs.unlink(path.join(DATA,'tmp',pd.id+'.'+n),()=>{});
        if(pd.media){db.pending=db.pending.filter(x=>x!==pd);await save();return send(res,201,{ok:true,key:'media/'+pd.media,size:total})}
        const md=pd.meta||{};const rec={id:pd.id,file,type:pd.mime.startsWith('video')?'video':'photo',mime:pd.mime,size:total,by:clip(md.by,60),caption:clip(md.caption,300),people:(Array.isArray(md.people)?md.people:[]).map(x=>clip(x,20)).slice(0,10),trip:md.trip?clip(md.trip,60):null,w:+md.w||null,h:+md.h||null,date:new Date().toISOString(),orig:clip(md.name,120)};
        db.uploads.push(rec);db.pending=db.pending.filter(x=>x!==pd);await save();return send(res,201,{ok:true,item:pubUpload(rec)})}
      return send(res,404,{error:'not found'})}
    if(m==='PUT'&&/^\/api\/upload\/[a-z0-9]+\/thumb$/.test(p)){if(!famOK(req))return send(res,401,{error:'Wrong family passcode'});
      const rec=db.uploads.find(x=>x.id===p.split('/')[3]);if(!rec)return send(res,404,{error:'not found'});if(rec.thumb)return send(res,409,{error:'exists'});
      if(!/^image\/(jpeg|webp)$/.test(req.headers['content-type']||''))return send(res,415,{error:'jpeg/webp only'});
      const tf=rec.id+'-t.'+(req.headers['content-type'].includes('webp')?'webp':'jpg');await readFile(req,path.join(DATA,'uploads',tf),3e6);rec.thumb=tf;await save();return send(res,200,{ok:true,item:pubUpload(rec)})}
    if(m==='POST'&&p==='/api/requests'){if(!famOK(req))return send(res,401,{error:'Wrong family passcode'});const b=await readJSON(req,2e4);
      const r={id:id(),status:'pending',type:KINDS.has(b.type)?b.type:'other',lang:LANGS.has(b.lang)?b.lang:'yi',style:STY.has(b.style)?b.style:null,kids:(Array.isArray(b.kids)?b.kids:[]).map(x=>clip(x,20)).slice(0,12),other:clip(b.other,120),details:clip(b.details,3000),name:clip(b.name,60),uiLang:b.uiLang==='he'?'he':'en',date:new Date().toISOString()};
      if(!r.details&&!r.kids.length)return send(res,400,{error:'Tell us who it is about or a few details'});db.requests.push(r);await save();return send(res,201,{ok:true,id:r.id})}
    if(m==='POST'&&p==='/api/notes'){if(!famOK(req))return send(res,401,{error:'Wrong family passcode'});const b=await readJSON(req,2e4);
      const r={id:id(),trip:clip(b.trip,60),item:clip(b.item,80),who:(Array.isArray(b.who)?b.who:[]).map(x=>clip(x,20)).slice(0,12),text:clip(b.text,3000),name:clip(b.name,60),date:new Date().toISOString(),status:'new'};
      db.notes.push(r);await save();return send(res,201,{ok:true})}
    /* ----- admin (Bearer ADMIN_TOKEN) ----- */
    if(p.startsWith('/api/admin/')){if(!adminOK(req))return send(res,401,{error:'admin token required'});
      const seg=p.split('/').slice(3);
      if(m==='GET'&&seg[0]==='requests'){const st=u.searchParams.get('status');return send(res,200,{requests:db.requests.filter(r=>!st||r.status===st)})}
      if(m==='POST'&&seg[0]==='requests'&&seg[1]){const r=db.requests.find(x=>x.id===seg[1]);if(!r)return send(res,404,{error:'not found'});const b=await readJSON(req);if(b.status)r.status=clip(b.status,20);if(b.song)r.song=clip(b.song,80);if(b.note)r.note=clip(b.note,500);await save();return send(res,200,{ok:true,request:r})}
      if(m==='GET'&&seg[0]==='notes')return send(res,200,{notes:db.notes});
      if(m==='GET'&&seg[0]==='uploads')return send(res,200,{uploads:db.uploads});
      if((m==='DELETE'||m==='POST')&&seg[0]==='uploads'&&seg[1]){const r=db.uploads.find(x=>x.id===seg[1]);if(!r)return send(res,404,{error:'not found'});
        if(m==='DELETE'){db.uploads=db.uploads.filter(x=>x!==r);for(const f of [r.file,r.thumb])if(f)fs.unlink(path.join(DATA,'uploads',f),()=>{})}else{const b=await readJSON(req);for(const k of ['caption','trip','by'])if(k in b)r[k]=clip(b[k],300);if(Array.isArray(b.people))r.people=b.people.map(x=>clip(x,20));if('hidden' in b)r.hidden=!!b.hidden}
        await save();return send(res,200,{ok:true})}
      if(m==='GET'&&seg[0]==='songs')return send(res,200,{songs:db.songs});
      if(m==='POST'&&seg[0]==='songs'&&!seg[1]){const b=await readJSON(req,1e6);const sid=(b.id&&/^[a-z0-9-]{3,60}$/.test(b.id))?b.id:'new-'+id();let s=db.songs.find(x=>x.id===sid);if(!s){s={id:sid,date:new Date().toISOString()};db.songs.push(s)}
        for(const k of ['t','th','te','g','y'])if(b[k]!=null)s[k]=clip(b[k],200);for(const k of ['p','st'])if(Array.isArray(b[k]))s[k]=b[k].map(x=>clip(x,20));if(b.d)s.d=+b.d||0;if(Array.isArray(b.lyrics))s.lyrics=b.lyrics.slice(0,60);if('hidden' in b)s.hidden=!!b.hidden;
        if(b.request){s.request=clip(b.request,60);const r=db.requests.find(x=>x.id===s.request);if(r){r.status='done';r.song=sid}}await save();return send(res,200,{ok:true,song:s})}
      if(m==='PUT'&&seg[0]==='songs'&&seg[1]&&(seg[2]==='audio'||seg[2]==='cover')){const s=db.songs.find(x=>x.id===seg[1]);if(!s)return send(res,404,{error:'create the song first'});
        const ty=(req.headers['content-type']||'').split(';')[0],ext=EXT[ty];if(seg[2]==='audio'&&ext!=='.mp3')return send(res,415,{error:'audio/mpeg only'});if(seg[2]==='cover'&&!/^image\/(jpeg|webp|png)$/.test(ty))return send(res,415,{error:'image only'});
        const f=s.id+(seg[2]==='cover'?'-cover':'')+ext;await readFile(req,path.join(DATA,'songs',f),60e6);s[seg[2]]=f;await save();return send(res,200,{ok:true,song:s})}
      if(m==='DELETE'&&seg[0]==='songs'&&seg[1]){const sg=db.songs.find(x=>x.id===seg[1]);if(sg)for(const k of ['audio','cover'])if(typeof sg[k]==='string'&&!sg[k].includes('..'))fs.unlink(path.join(DATA,'songs',sg[k]),()=>{});db.songs=db.songs.filter(x=>x.id!==seg[1]);await save();return send(res,200,{ok:true})}
      if(m==='DELETE'&&(seg[0]==='requests'||seg[0]==='notes')&&seg[1]){db[seg[0]]=db[seg[0]].filter(x=>x.id!==seg[1]);await save();return send(res,200,{ok:true})}
      if(m==='DELETE'&&seg[0]==='media'){const f=safeJoin(path.join(DATA,'media'),seg.slice(1).join('/'));if(!f)return send(res,400,{error:'bad path'});fs.unlink(f,()=>{});return send(res,200,{ok:true})}
      if(m==='PUT'&&seg[0]==='media'){const rel=seg.slice(1).join('/');const f=safeJoin(path.join(DATA,'media'),rel);if(!f||!/\.(jpe?g|png|webp|mp4)$/i.test(f))return send(res,400,{error:'bad path'});const n=await readFile(req,f,MAXUP);return send(res,200,{ok:true,size:n})}
      if(m==='GET'&&seg[0]==='media'){const out=[];const walk=async(d,r)=>{for(const e of await fsp.readdir(d,{withFileTypes:true})){if(e.isDirectory())await walk(path.join(d,e.name),r+e.name+'/');else out.push(r+e.name)}};await walk(path.join(DATA,'media'),'');return send(res,200,{count:out.length,files:out})}
      return send(res,404,{error:'unknown admin route'})}
    return send(res,404,{error:'not found'});
  }catch(e){console.error(m,p,e.message);if(!res.headersSent)send(res,e.code===413?413:e.code===400?400:500,{error:e.message||'error'})}
});
server.requestTimeout=0;server.headersTimeout=65000;
server.listen(+process.env.PORT||10000,()=>console.log('hub backend on',server.address().port,'data',DATA,'pass',!!PASS,'admin',!!ADMIN));
