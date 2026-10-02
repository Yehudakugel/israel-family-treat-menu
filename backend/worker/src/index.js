/* Bernshtein family hub backend on Cloudflare (Worker + R2 + D1).
   Same HTTP API as backend/node-server.js, so the site works with either.
   R2 keys: media/<trip>/<file> (trip photos & videos), uploads/<id>.<ext>, songs/<id>.mp3 */
const MIME={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif',heic:'image/heic',mp4:'video/mp4',mov:'video/quicktime',m4v:'video/x-m4v',webm:'video/webm',mp3:'audio/mpeg',json:'application/json'};
const EXT={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','image/heic':'heic','image/heif':'heic','video/mp4':'mp4','video/quicktime':'mov','video/x-m4v':'m4v','video/webm':'webm','audio/mpeg':'mp3','audio/mp3':'mp3'};
const KINDS=new Set(['bday','trip','shabbos','funny','thanks','other']),LANGS=new Set(['yi','he','en']),STY=new Set(['upbeat','funny','lullaby','niggun','heart']);
const PART=10*1024*1024,MAXUP=2*1024*1024*1024;
const BLOCK=/(^|\/)(private)(\/|$)/i;
const uid=()=>Date.now().toString(36)+[...crypto.getRandomValues(new Uint8Array(4))].map(b=>b.toString(16).padStart(2,'0')).join('');
const clip=(s,n=500)=>String(s??'').slice(0,n);
const arr=(a,n=12,l=20)=>(Array.isArray(a)?a:[]).map(x=>clip(x,l)).slice(0,n);
const J=s=>{try{return JSON.parse(s||'null')}catch(e){return null}};
function eq(a,b){a=String(a||'');b=String(b||'');if(!a||!b||a.length!==b.length)return false;let r=0;for(let i=0;i<a.length;i++)r|=a.charCodeAt(i)^b.charCodeAt(i);return r===0}
function corsH(req,env){const o=req.headers.get('Origin'),ok=(env.ALLOW_ORIGINS||'').split(',').map(s=>s.trim());
  const h={'Access-Control-Allow-Methods':'GET,HEAD,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization,X-Pass,X-Meta,Range','Access-Control-Max-Age':'86400','Access-Control-Expose-Headers':'Content-Length,Content-Range,Accept-Ranges,ETag','Vary':'Origin'};
  if(o&&ok.includes(o))h['Access-Control-Allow-Origin']=o;return h}
const json=(obj,code=200)=>new Response(JSON.stringify(obj),{status:code,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
const meta=req=>{try{return JSON.parse(decodeURIComponent(req.headers.get('X-Meta')||'')||'{}')}catch(e){return{}}};
const pubUpload=u=>({id:u.id,type:u.type,src:'files/'+u.key,thumb:u.thumb?'files/'+u.thumb:null,w:u.w||null,h:u.h||null,by:u.by||'',caption:u.caption||'',people:J(u.people)||[],trip:u.trip||null,date:u.date});
const pubSong=s=>({id:s.id,t:s.t,th:s.th||null,te:s.te||null,g:s.g||'yi',y:s.y||'celebration',p:J(s.p)||[],st:J(s.st)||J(s.p)||[],d:s.d||0,s:s.audio?'files/'+s.audio:null,c:s.cover?'files/'+s.cover:null,lyrics:J(s.lyrics)||[],date:s.date,a:'new'});

async function serve(req,env,key,immutable){
  if(BLOCK.test(key))return json({error:'not found'},404);
  const range=req.headers.get('Range');let opt={};
  if(range){const m=/^bytes=(\d*)-(\d*)$/.exec(range);if(m){if(m[1]==='')opt.range={suffix:+m[2]};else opt.range=m[2]===''?{offset:+m[1]}:{offset:+m[1],length:+m[2]-+m[1]+1}}}
  const obj=req.method==='HEAD'?await env.BUCKET.head(key):await env.BUCKET.get(key,opt);
  if(!obj)return json({error:'not found'},404);
  const h=new Headers();obj.writeHttpMetadata(h);h.set('ETag',obj.httpEtag);h.set('Accept-Ranges','bytes');
  if(!h.get('Content-Type'))h.set('Content-Type',MIME[key.split('.').pop().toLowerCase()]||'application/octet-stream');
  h.set('Cache-Control',immutable?'public, max-age=31536000, immutable':'public, max-age=300');
  if(req.method==='HEAD'){h.set('Content-Length',obj.size);return new Response(null,{headers:h})}
  if(opt.range&&obj.range){const s=obj.range.offset??(obj.size-obj.range.length),len=obj.range.length??(obj.size-s);h.set('Content-Range',`bytes ${s}-${s+len-1}/${obj.size}`);h.set('Content-Length',len);return new Response(obj.body,{status:206,headers:h})}
  h.set('Content-Length',obj.size);return new Response(obj.body,{headers:h});
}
async function handle(req,env){
  const u=new URL(req.url),p=u.pathname,m=req.method,DB=env.DB;
  const fam=()=>eq(req.headers.get('X-Pass'),env.FAMILY_PASS),adm=()=>eq((req.headers.get('Authorization')||'').replace(/^Bearer\s+/i,''),env.ADMIN_TOKEN);
  if(p==='/'||p==='/api/health'){const a=await DB.prepare("SELECT (SELECT COUNT(*) FROM uploads) u,(SELECT COUNT(*) FROM songs) s,(SELECT COUNT(*) FROM requests WHERE status='pending') q").first();return json({ok:true,uploads:a.u,songs:a.s,pending:a.q})}
  if((m==='GET'||m==='HEAD')&&p.startsWith('/files/')){const k=decodeURIComponent(p.slice(7));if(!/^(uploads|songs|media)\//.test(k)||k.includes('..'))return json({error:'not found'},404);return serve(req,env,k,!k.startsWith('songs/'))}
  if((m==='GET'||m==='HEAD')&&p.startsWith('/media/')){const k='media/'+decodeURIComponent(p.slice(7));if(k.includes('..'))return json({error:'not found'},404);return serve(req,env,k,true)}
  if(m==='GET'&&p==='/api/new'){const r=await DB.prepare('SELECT * FROM uploads WHERE hidden=0 ORDER BY date DESC LIMIT 2000').all();return json({items:r.results.map(pubUpload)})}
  if(m==='GET'&&p==='/api/songs'){const r=await DB.prepare('SELECT * FROM songs WHERE hidden=0 AND audio IS NOT NULL ORDER BY date DESC').all();return json({songs:r.results.map(pubSong)})}
  if(m==='POST'&&p==='/api/check')return json({ok:fam()},fam()?200:401);

  if(p.startsWith('/api/upload')){
    if(!fam()&&!adm())return json({error:'Wrong family passcode'},401);
    const seg=p.split('/').slice(3);
    /* chunked: POST /api/upload/start -> PUT /api/upload/<id>/part/<n> -> POST /api/upload/<id>/finish */
    if(m==='POST'&&seg[0]==='start'){const b=await req.json().catch(()=>({}));const ty=clip(b.type,60).toLowerCase(),ext=EXT[ty];
      if(!ext||!/^(image|video)\//.test(ty))return json({error:'Only photos and videos'},415);if(!(b.size>0)||b.size>MAXUP)return json({error:'File too large'},413);
      let mp=null;if(b.mediaPath){if(!adm())return json({error:'admin token required'},401);mp=clip(b.mediaPath,200);if(mp.includes('..')||BLOCK.test(mp)||!/\.(jpe?g|png|webp|mp4)$/i.test(mp))return json({error:'bad path'},400)}
      const id=uid(),key=mp?'media/'+mp:`uploads/${id}.${ext}`,mu=await env.BUCKET.createMultipartUpload(key,{httpMetadata:{contentType:ty}});
      await DB.prepare('INSERT INTO pending VALUES(?,?,?,?,?,?)').bind(id,key,mu.uploadId,ty,JSON.stringify(mp?{_media:1}:(b.meta||{})),new Date().toISOString()).run();
      return json({id,partSize:PART})}
    if(m==='PUT'&&seg[1]==='part'){const pd=await DB.prepare('SELECT * FROM pending WHERE id=?').bind(seg[0]).first();if(!pd)return json({error:'unknown upload'},404);
      const n=+seg[2];if(!(n>=1&&n<=10000))return json({error:'bad part'},400);const mu=env.BUCKET.resumeMultipartUpload(pd.key,pd.upload_id);const part=await mu.uploadPart(n,req.body);return json({n,etag:part.etag})}
    if(m==='POST'&&seg[1]==='finish'){const pd=await DB.prepare('SELECT * FROM pending WHERE id=?').bind(seg[0]).first();if(!pd)return json({error:'unknown upload'},404);
      const b=await req.json().catch(()=>({}));const parts=(b.parts||[]).map(x=>({partNumber:+x.n,etag:String(x.etag)})).sort((a,c)=>a.partNumber-c.partNumber);
      const mu=env.BUCKET.resumeMultipartUpload(pd.key,pd.upload_id);const obj=await mu.complete(parts);const md=J(pd.meta)||{};
      if(md._media){await DB.prepare('DELETE FROM pending WHERE id=?').bind(pd.id).run();return json({ok:true,key:pd.key,size:obj.size},201)}
      const rec={id:pd.id,key:pd.key,type:pd.mime.startsWith('video')?'video':'photo',mime:pd.mime,size:obj.size,by:clip(md.by,60),caption:clip(md.caption,300),people:JSON.stringify(arr(md.people,10)),trip:md.trip?clip(md.trip,60):null,w:+md.w||null,h:+md.h||null,date:new Date().toISOString(),orig:clip(md.name,120)};
      await DB.batch([DB.prepare('INSERT INTO uploads(id,key,type,mime,size,by,caption,people,trip,w,h,date,orig) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(rec.id,rec.key,rec.type,rec.mime,rec.size,rec.by,rec.caption,rec.people,rec.trip,rec.w,rec.h,rec.date,rec.orig),DB.prepare('DELETE FROM pending WHERE id=?').bind(pd.id)]);
      return json({ok:true,item:pubUpload(rec)},201)}
    if(m==='PUT'&&seg[1]==='thumb'){const r=await DB.prepare('SELECT * FROM uploads WHERE id=?').bind(seg[0]).first();if(!r)return json({error:'not found'},404);if(r.thumb)return json({error:'exists'},409);
      const ty=(req.headers.get('Content-Type')||'').split(';')[0];if(!/^image\/(jpeg|webp)$/.test(ty))return json({error:'jpeg/webp only'},415);
      const len=+req.headers.get('Content-Length')||0;if(len>3e6)return json({error:'too big'},413);
      const key=`uploads/${r.id}-t.${ty.endsWith('webp')?'webp':'jpg'}`;await env.BUCKET.put(key,req.body,{httpMetadata:{contentType:ty}});await DB.prepare('UPDATE uploads SET thumb=? WHERE id=?').bind(key,r.id).run();
      r.thumb=key;return json({ok:true,item:pubUpload(r)})}
    return json({error:'not found'},404);
  }
  if(m==='POST'&&p==='/api/requests'){if(!fam())return json({error:'Wrong family passcode'},401);const b=await req.json().catch(()=>({}));
    const r=[uid(),'pending',KINDS.has(b.type)?b.type:'other',LANGS.has(b.lang)?b.lang:'yi',STY.has(b.style)?b.style:null,JSON.stringify(arr(b.kids)),clip(b.other,120),clip(b.details,3000),clip(b.name,60),b.uiLang==='he'?'he':'en',new Date().toISOString()];
    if(!r[7]&&r[5]==='[]'&&!r[6])return json({error:'Tell us who it is about or a few details'},400);
    await DB.prepare('INSERT INTO requests(id,status,type,lang,style,kids,other,details,name,ui_lang,date) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(...r).run();return json({ok:true,id:r[0]},201)}
  if(m==='POST'&&p==='/api/notes'){if(!fam())return json({error:'Wrong family passcode'},401);const b=await req.json().catch(()=>({}));
    await DB.prepare('INSERT INTO notes VALUES(?,?,?,?,?,?,?,?)').bind(uid(),clip(b.trip,60),clip(b.item,80),JSON.stringify(arr(b.who)),clip(b.text,3000),clip(b.name,60),new Date().toISOString(),'new').run();return json({ok:true},201)}

  if(p.startsWith('/api/admin/')){
    if(!adm())return json({error:'admin token required'},401);
    const seg=p.split('/').slice(3);
    if(m==='GET'&&seg[0]==='requests'){const st=u.searchParams.get('status');const r=st?await DB.prepare('SELECT * FROM requests WHERE status=? ORDER BY date').bind(st).all():await DB.prepare('SELECT * FROM requests ORDER BY date').all();return json({requests:r.results.map(x=>({...x,kids:J(x.kids)||[]}))})}
    if(m==='POST'&&seg[0]==='requests'&&seg[1]){const b=await req.json().catch(()=>({}));await DB.prepare('UPDATE requests SET status=COALESCE(?,status),song=COALESCE(?,song),note=COALESCE(?,note) WHERE id=?').bind(b.status?clip(b.status,20):null,b.song?clip(b.song,80):null,b.note?clip(b.note,500):null,seg[1]).run();return json({ok:true})}
    if(m==='GET'&&seg[0]==='notes'){const r=await DB.prepare('SELECT * FROM notes ORDER BY date').all();return json({notes:r.results})}
    if(m==='GET'&&seg[0]==='uploads'){const r=await DB.prepare('SELECT * FROM uploads ORDER BY date').all();return json({uploads:r.results})}
    if(m==='DELETE'&&seg[0]==='uploads'&&seg[1]){const r=await DB.prepare('SELECT * FROM uploads WHERE id=?').bind(seg[1]).first();if(!r)return json({error:'not found'},404);await env.BUCKET.delete([r.key,r.thumb].filter(Boolean));await DB.prepare('DELETE FROM uploads WHERE id=?').bind(r.id).run();return json({ok:true})}
    if(m==='POST'&&seg[0]==='uploads'&&seg[1]){const b=await req.json().catch(()=>({}));await DB.prepare('UPDATE uploads SET caption=COALESCE(?,caption),trip=COALESCE(?,trip),people=COALESCE(?,people),hidden=COALESCE(?,hidden) WHERE id=?').bind(b.caption!=null?clip(b.caption,300):null,b.trip!=null?clip(b.trip,60):null,Array.isArray(b.people)?JSON.stringify(arr(b.people)):null,'hidden' in b?(b.hidden?1:0):null,seg[1]).run();return json({ok:true})}
    if(m==='GET'&&seg[0]==='songs'){const r=await DB.prepare('SELECT * FROM songs ORDER BY date').all();return json({songs:r.results})}
    if(m==='POST'&&seg[0]==='songs'&&!seg[1]){const b=await req.json().catch(()=>({}));const id=(b.id&&/^[a-z0-9-]{3,60}$/.test(b.id))?b.id:'new-'+uid();
      const ex=await DB.prepare('SELECT id FROM songs WHERE id=?').bind(id).first();
      if(!ex)await DB.prepare('INSERT INTO songs(id,date) VALUES(?,?)').bind(id,new Date().toISOString()).run();
      await DB.prepare('UPDATE songs SET t=COALESCE(?,t),th=COALESCE(?,th),te=COALESCE(?,te),g=COALESCE(?,g),y=COALESCE(?,y),p=COALESCE(?,p),st=COALESCE(?,st),d=COALESCE(?,d),lyrics=COALESCE(?,lyrics),request=COALESCE(?,request),hidden=COALESCE(?,hidden) WHERE id=?')
        .bind(b.t!=null?clip(b.t,200):null,b.th!=null?clip(b.th,200):null,b.te!=null?clip(b.te,200):null,b.g?clip(b.g,4):null,b.y?clip(b.y,30):null,Array.isArray(b.p)?JSON.stringify(arr(b.p)):null,Array.isArray(b.st)?JSON.stringify(arr(b.st)):null,b.d?+b.d:null,Array.isArray(b.lyrics)?JSON.stringify(b.lyrics.slice(0,60)):null,b.request?clip(b.request,60):null,'hidden' in b?(b.hidden?1:0):null,id).run();
      if(b.request)await DB.prepare("UPDATE requests SET status='done',song=? WHERE id=?").bind(id,clip(b.request,60)).run();
      return json({ok:true,song:pubSong(await DB.prepare('SELECT * FROM songs WHERE id=?').bind(id).first())})}
    if(m==='PUT'&&seg[0]==='songs'&&seg[1]&&(seg[2]==='audio'||seg[2]==='cover')){const s=await DB.prepare('SELECT * FROM songs WHERE id=?').bind(seg[1]).first();if(!s)return json({error:'create the song first'},404);
      const ty=(req.headers.get('Content-Type')||'').split(';')[0],ext=EXT[ty];if(seg[2]==='audio'&&ext!=='mp3')return json({error:'audio/mpeg only'},415);if(seg[2]==='cover'&&!/^image\/(jpeg|webp|png)$/.test(ty))return json({error:'image only'},415);
      const key=`songs/${s.id}${seg[2]==='cover'?'-cover':''}.${ext}`;await env.BUCKET.put(key,req.body,{httpMetadata:{contentType:ty}});await DB.prepare(`UPDATE songs SET ${seg[2]}=? WHERE id=?`).bind(key,s.id).run();return json({ok:true})}
    if(m==='DELETE'&&seg[0]==='songs'&&seg[1]){const s=await DB.prepare('SELECT * FROM songs WHERE id=?').bind(seg[1]).first();if(s){const ks=[s.audio,s.cover].filter(Boolean);if(ks.length)await env.BUCKET.delete(ks)}await DB.prepare('DELETE FROM songs WHERE id=?').bind(seg[1]).run();return json({ok:true})}
    if(m==='DELETE'&&(seg[0]==='requests'||seg[0]==='notes')&&seg[1]){await DB.prepare(`DELETE FROM ${seg[0]} WHERE id=?`).bind(seg[1]).run();return json({ok:true})}
    if(m==='DELETE'&&seg[0]==='media'){const rel=decodeURIComponent(seg.slice(1).join('/'));if(rel.includes('..')||!rel)return json({error:'bad path'},400);await env.BUCKET.delete('media/'+rel);return json({ok:true})}
    if(m==='PUT'&&seg[0]==='media'){const rel=decodeURIComponent(seg.slice(1).join('/'));if(rel.includes('..')||BLOCK.test(rel)||!/\.(jpe?g|png|webp|mp4)$/i.test(rel))return json({error:'bad path'},400);
      await env.BUCKET.put('media/'+rel,req.body,{httpMetadata:{contentType:MIME[rel.split('.').pop().toLowerCase()]}});return json({ok:true})}
    return json({error:'unknown admin route'},404);
  }
  return json({error:'not found'},404);
}
export default{async fetch(req,env){
  const c=corsH(req,env);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:c});
  let r;try{r=await handle(req,env)}catch(e){console.error(e);r=json({error:'server error'},500)}
  const h=new Headers(r.headers);for(const k in c)h.set(k,c[k]);return new Response(r.body,{status:r.status,headers:h});
},
/* daily: abort multipart uploads that were never finished */
async scheduled(ev,env){const old=new Date(Date.now()-864e5).toISOString();const r=await env.DB.prepare('SELECT * FROM pending WHERE created<?').bind(old).all();
  for(const pd of r.results){try{await env.BUCKET.resumeMultipartUpload(pd.key,pd.upload_id).abort()}catch(e){}await env.DB.prepare('DELETE FROM pending WHERE id=?').bind(pd.id).run()}}};
