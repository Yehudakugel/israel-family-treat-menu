/* ---------- family backend: uploads ("New" folder), song requests, New Songs ---------- */
function apiOn(){return !!CONFIG.api}
function apiU(p){return CONFIG.api.replace(/\/+$/,'')+'/'+String(p).replace(/^\/+/,'')}
function tx(en,he){return lang==='he'?he:en}
var NEWLYR={},NEWALB={id:'new',en:'New Songs',he:'שירים חדשים',sub_en:'Fresh family songs, made from your ideas',sub_he:'שירים משפחתיים חדשים, מהרעיונות שלכם',n:0};
function apiJSON(p,opt){return fetch(apiU(p),Object.assign({cache:'no-store'},opt||{})).then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(!r.ok)throw{status:r.status,msg:j.error};return j})})}
function loadBackend(){
  if(!apiOn())return Promise.resolve();
  if(!ALB.new){ALB.new=NEWALB;M.albums.unshift(NEWALB)}
  return Promise.all([
    apiJSON('api/songs').then(function(d){addNewSongs(d.songs||[])}).catch(function(){}),
    apiJSON('api/new').then(function(d){setNewTrip(d.items||[])}).catch(function(){})
  ]);
}
function addNewSongs(list){
  list.slice().reverse().forEach(function(s){var id='n-'+s.id;if(SONG[id])return;
    var o={id:id,t:s.t||'',th:s.th||null,te:s.te||null,g:s.g||'yi',y:s.y||'celebration',p:s.p||[],st:s.st||s.p||[],d:s.d||0,s:s.s?apiU(s.s):null,cu:s.c?apiU(s.c):null,a:'new',v:'male-acap',fresh:1};
    if(!o.th)delete o.th;if(!o.te)delete o.te;
    M.songs.unshift(o);SONG[id]=o;if(s.lyrics&&s.lyrics.length){NEWLYR[id]=s.lyrics;if(LYR)LYR[id]=s.lyrics}});
  NEWALB.n=M.songs.filter(function(s){return s.a==='new'}).length;
}
function setNewTrip(items){
  var base=CONFIG.api.replace(/\/+$/,''),its=items.map(function(it){var o={id:'u-'+it.id,type:it.type,src:it.src,w:it.w||null,h:it.h||null,people:it.people||[],date:it.date,by:it.by||''};
    if(it.thumb)o.thumb=it.thumb;else if(it.type==='photo')o.thumb=it.src;if(it.caption)o.caption={en:it.caption,he:it.caption};return o});
  var tr={id:'new',imported:true,newf:1,title:{en:'New',he:'חדש'},date:(items[0]&&items[0].date||'').slice(0,10),place:{en:'Added by the family',he:'הועלו על ידי המשפחה'},status:'past',base:base,category:{id:'new',en:'New',he:'חדש'},chapters:[],items:its};
  its.forEach(function(it){it._trip=tr});TRIPCACHE.new=tr;
  var c=its.filter(function(i){return i.thumb})[0];
  var sm={id:'new',newf:1,title:tr.title,date:tr.date,place:tr.place,status:'past',cover:c?base+'/'+c.thumb:'',count:its.length,photos:its.filter(function(i){return i.type==='photo'}).length,videos:its.filter(function(i){return i.type==='video'}).length,people:[],file:null,category:tr.category};
  TRIPS=TRIPS.filter(function(x){return x.id!=='new'});if(its.length)TRIPS.unshift(sm);allP=null;if(typeof MIDX!=='undefined')MIDX=null;
}
function passField(){return LS.get('fpass','')?'':'<label for="fp">'+esc(tx('Family passcode','קוד משפחתי'))+'</label><input id="fp" type="password" autocomplete="current-password" inputmode="text" autocapitalize="off">'}
function takePass(){var f=vis('#fp');if(f&&f.value.trim())LS.set('fpass',f.value.trim());return LS.get('fpass','')}
function badPass(){LS.set('fpass','');toast(tx('That passcode didn’t work. Try again.','הקוד לא נכון. נסו שוב.'))}
function soonBox(en,he){return'<span class="pending">'+esc(tx('Opening soon','בקרוב'))+'</span><p class="muted sm">'+esc(tx(en,he))+'</p>'}

/* uploads */
var UPQ=[];
function openUpload(){
  if(!apiOn()){sheet('<div class="eyebrow">'+esc(t('t_mem'))+'</div><h3>'+esc(tx('Add photos and videos','הוספת תמונות וסרטונים'))+'</h3>'+soonBox('Uploading from your phone opens very soon.','העלאה מהטלפון תיפתח ממש בקרוב.')+'<div class="center"><button class="link muted" data-act="notex">'+esc(t('cancel'))+'</button></div>');return}
  sheet('<div class="eyebrow">'+esc(t('t_mem'))+'</div><h3>'+esc(tx('Add photos and videos','הוספת תמונות וסרטונים'))+'</h3><p>'+esc(tx('They go straight into the New folder in Memories for the whole family.','הם נכנסים ישר לתיקייה "חדש" בזכרונות, לכל המשפחה.'))+'</p>'+passField()+
    '<label for="nn">'+esc(t('yourName'))+'</label><input id="nn" autocomplete="name" value="'+esc(LS.get('name',''))+'">'+
    '<label for="ucap">'+esc(tx('What is it? (optional)','מה זה? (לא חובה)'))+'</label><input id="ucap" dir="auto">'+
    '<label class="btn pri wide upick">'+ic('plus')+'<span>'+esc(tx('Choose photos or videos','בחירת תמונות או סרטונים'))+'</span><input id="ufile" type="file" accept="image/*,video/*" multiple hidden></label>'+
    '<ul class="uplist" id="uplist"></ul><div class="center"><button class="link muted" data-act="notex">'+esc(tx('Close','סגירה'))+'</button></div>');
  var inp=$('#ufile');inp.addEventListener('change',function(){var fs=[].slice.call(inp.files||[]);inp.value='';if(fs.length)startUploads(fs)});
}
function startUploads(fs){
  var pass=takePass(),name=(vis('#nn')||{}).value||'',cap=(($('#ucap')||{}).value||'').trim();LS.set('name',name.trim());
  if(!pass){toast(tx('Enter the family passcode first','קודם הקוד המשפחתי'));var f=vis('#fp');if(f)f.focus();return}
  apiJSON('api/check',{method:'POST',headers:{'X-Pass':pass}}).then(function(){
    var ul=$('#uplist');fs.forEach(function(f,k){var li=document.createElement('li');li.innerHTML='<span class="un" dir="auto">'+esc(f.name||('#'+(k+1)))+'</span><span class="ub"><i></i></span><small>…</small>';ul.appendChild(li);UPQ.push({f:f,li:li,by:name.trim(),cap:cap})});
    pump();
  }).catch(function(e){if(e&&e.status===401){badPass();openUpload()}else toast(tx('Can’t reach the family server right now','אין חיבור לשרת המשפחה כרגע'))});
}
var UPBUSY=0,UPDONE=0;
function pump(){if(UPBUSY)return;var j=UPQ.shift();if(!j){if(UPDONE){toast(tx('Added to Memories ✓','נוסף לזכרונות ✓'));UPDONE=0;loadBackend().then(function(){if(/^#\/memories/.test(location.hash))route()})}return}
  UPBUSY=1;var bar=j.li.querySelector('.ub i'),st=j.li.querySelector('small');
  prep(j.f).then(function(p){st.textContent=tx('Uploading','מעלה');return send1(p.blob,p.type,{by:j.by,caption:j.cap,w:p.w,h:p.h,name:j.f.name},function(x){bar.style.transform='scaleX('+x+')'}).then(function(item){
      st.textContent=tx('Done','הועלה');j.li.classList.add('ok');UPDONE++;if(p.thumb&&!item.thumb)return putThumb(item.id,p.thumb).catch(function(){})})})
  .catch(function(e){j.li.classList.add('bad');st.textContent=e&&e.status===401?tx('Wrong passcode','קוד שגוי'):e&&e.status===413?tx('Too big','גדול מדי'):tx('Didn’t upload, try again','לא הועלה, נסו שוב');if(e&&e.status===401)LS.set('fpass','')})
  .then(function(){UPBUSY=0;pump()});
}
function send1(blob,type,md,prog){
  /* chunked upload: start -> parts (10MB) -> finish; retries each part up to 3 times */
  var H={'X-Pass':LS.get('fpass','')};
  return apiJSON('api/upload/start',{method:'POST',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify({type:type,size:blob.size,meta:md})}).then(function(st){
    var ps=st.partSize||10485760,n=Math.max(1,Math.ceil(blob.size/ps)),parts=[],sent=0;
    function part(i,tries){return new Promise(function(ok,no){var x=new XMLHttpRequest(),ch=blob.slice((i-1)*ps,Math.min(blob.size,i*ps));x.open('PUT',apiU('api/upload/'+st.id+'/part/'+i));x.setRequestHeader('X-Pass',H['X-Pass']);x.setRequestHeader('Content-Type','application/octet-stream');
      x.upload.onprogress=function(e){if(e.lengthComputable)prog(Math.min(.99,(sent+e.loaded)/blob.size))};
      x.onload=function(){var r={};try{r=JSON.parse(x.responseText)}catch(e){}if(x.status===200&&r.etag){sent+=ch.size;parts.push({n:i,etag:r.etag});ok()}else no({status:x.status,msg:r.error})};x.onerror=function(){no({status:0})};x.send(ch)})
      .catch(function(e){if(tries<3&&e.status!==401&&e.status!==413)return new Promise(function(r){setTimeout(r,1500*(tries+1))}).then(function(){return part(i,tries+1)});throw e})}
    var chain=Promise.resolve();for(var i=1;i<=n;i++)(function(i){chain=chain.then(function(){return part(i,0)})})(i);
    return chain.then(function(){return apiJSON('api/upload/'+st.id+'/finish',{method:'POST',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify({parts:parts})})}).then(function(r){prog(1);return r.item});
  });
}
function putThumb(id,blob){return fetch(apiU('api/upload/'+id+'/thumb'),{method:'PUT',headers:{'Content-Type':'image/jpeg','X-Pass':LS.get('fpass','')},body:blob})}
function guessType(f){if(f.type)return f.type.toLowerCase();var e=(f.name||'').split('.').pop().toLowerCase();return{jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',heic:'image/heic',heif:'image/heic',webp:'image/webp',mov:'video/quicktime',mp4:'video/mp4',m4v:'video/x-m4v'}[e]||''}
function toJpeg(src,w,h,max,q){var k=Math.min(1,max/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);c.getContext('2d').drawImage(src,0,0,c.width,c.height);return new Promise(function(ok){c.toBlob(function(b){ok(b)},'image/jpeg',q)})}
function loadImg(f){return new Promise(function(ok,no){var u=URL.createObjectURL(f),im=new Image();im.onload=function(){ok(im)};im.onerror=function(){no()};im.src=u})}
function prep(f){var ty=guessType(f);
  if(/^image\//.test(ty)&&ty!=='image/gif'){return loadImg(f).then(function(im){var w=im.naturalWidth,h=im.naturalHeight;
      var full=(ty==='image/heic'||Math.max(w,h)>2560||f.size>6e6)?toJpeg(im,w,h,2560,.88):Promise.resolve(null);
      return Promise.all([full,toJpeg(im,w,h,480,.8)]).then(function(r){var k=Math.min(1,2560/Math.max(w,h));return r[0]?{blob:r[0],type:'image/jpeg',w:Math.round(w*k),h:Math.round(h*k),thumb:r[1]}:{blob:f,type:ty,w:w,h:h,thumb:r[1]}})})
    .catch(function(){return{blob:f,type:ty||'image/jpeg'}})}
  if(/^video\//.test(ty))return vthumb(f).then(function(v){return{blob:f,type:ty,w:v.w,h:v.h,thumb:v.thumb}},function(){return{blob:f,type:ty}});
  return Promise.reject({status:415});
}
/* a frame drawn before decoding comes out black: never use it as a thumbnail */
function blankFrame(v){try{var c=document.createElement('canvas');c.width=c.height=8;var x=c.getContext('2d');x.drawImage(v,0,0,8,8);var d=x.getImageData(0,0,8,8).data,t=0;for(var i=0;i<d.length;i+=4)t+=d[i]+d[i+1]+d[i+2];return t/(64*3)<6}catch(e){return false}}
function vthumb(f){return new Promise(function(ok,no){var v=document.createElement('video'),u=URL.createObjectURL(f),done=0,to=setTimeout(function(){fin(null)},6000);
  function fin(r){if(done)return;done=1;clearTimeout(to);try{v.removeAttribute('src');v.load()}catch(e){}URL.revokeObjectURL(u);r?ok(r):no()}
  v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');v.preload='auto';
  v.onloadeddata=function(){try{v.currentTime=Math.min(.5,(v.duration||1)/3)}catch(e){fin(null)}};
  var tries=0,g=0;function grab(){if(done||g)return;g=1;var w=v.videoWidth,h=v.videoHeight;if(!w)return fin(null);var bl;try{bl=blankFrame(v)}catch(e){return fin(null)}if(bl){g=0;if(tries++<2&&v.duration>1.2){try{v.currentTime=Math.min(v.duration-.1,1+tries)}catch(e){fin(null)}return}return fin(null)}try{toJpeg(v,w,h,480,.8).then(function(b){fin({w:w,h:h,thumb:b})},function(){fin(null)})}catch(e){fin(null)}}
  v.onseeked=function(){g=0;if(v.requestVideoFrameCallback)v.requestVideoFrameCallback(function(){grab()});setTimeout(grab,v.requestVideoFrameCallback?900:300)};
  v.onerror=function(){fin(null)};v.src=u;})}

/* song requests */
function sendSongReq(){
  if(!apiOn())return;var pass=takePass();if(!pass){toast(tx('Enter the family passcode','הכניסו את הקוד המשפחתי'));var f=vis('#fp');if(f)f.focus();return}
  var name=(vis('#nn').value||'').trim();LS.set('name',name);
  var b={type:CS.occ||'other',lang:CS.lng||'yi',style:CS.sty||null,kids:CS.who.slice(),other:($('#cso').value||'').trim(),details:($('#csd').value||'').trim(),name:name,uiLang:lang};
  if(!b.details&&!b.kids.length&&!b.other){toast(tx('Tell us who it’s about or a few details','ספרו לנו על מי או כמה פרטים'));return}
  var btn=$('[data-act=csend]');if(btn){btn.disabled=true;btn.textContent='…'}
  apiJSON('api/requests',{method:'POST',headers:{'Content-Type':'application/json','X-Pass':pass},body:JSON.stringify(b)}).then(function(){
    var m=me();if(m){m.n=(m.n||0)+1;save();award(5);badge('note')}CS={who:[],occ:null,lng:null,sty:null};
    setView('<div class="wrap"><div class="qdone"><div class="big-emo">🎶</div><h1 class="h1">'+esc(tx('Your song is being made!','השיר שלך בהכנה!'))+'</h1><p class="muted lead">'+esc(tx('It will appear in New Songs.','הוא יופיע בשירים חדשים.'))+'</p><div class="actions center wrapf"><a class="btn pri" href="#/album/new">'+ic('music')+esc(NEWALB[lang]||NEWALB.en)+'</a><a class="btn" href="#/create">'+esc(tx('Another idea','עוד רעיון'))+'</a></div></div>'+foot()+'</div>','fun');
  }).catch(function(e){if(btn){btn.disabled=false;btn.textContent=tx('Send my idea','שליחת הרעיון')}if(e&&e.status===401){badPass();vCreateKeep()}else toast(e&&e.msg?e.msg:tx('Can’t reach the family server right now','אין חיבור לשרת המשפחה כרגע'))});
}
function vCreateKeep(){var d=($('#csd')||{}).value,o=($('#cso')||{}).value;vCreate();if(d)$('#csd').value=d;if(o)$('#cso').value=o}
function createBtns(){return apiOn()?passField()+'<button class="btn pri wide" data-act="csend">'+ic('note')+esc(tx('Send my idea','שליחת הרעיון'))+'</button>':soonBox('Song requests open very soon.','בקשות לשירים ייפתחו ממש בקרוב.')}

/* memory notes */
function noteBtns(){return(apiOn()?passField()+'<div class="acts"><button class="btn pri" data-act="nsend">'+esc(tx('Save note','שמירת ההערה'))+'</button></div>':soonBox('Notes open very soon.','הערות ייפתחו ממש בקרוב.'))+'<div class="center"><button class="link muted" data-act="notex">'+esc(t('cancel'))+'</button></div>'}
function sendNote(){var pass=takePass();if(!pass){toast(tx('Enter the family passcode','הכניסו את הקוד המשפחתי'));return}
  var name=(vis('#nn').value||'').trim();LS.set('name',name);
  apiJSON('api/notes',{method:'POST',headers:{'Content-Type':'application/json','X-Pass':pass},body:JSON.stringify({trip:NOTE.trip,item:NOTE.item,who:NOTE.who,text:($('#nt').value||'').trim(),name:name})}).then(function(){
    $('#note').hidden=true;toast(tx('Thank you! Note sent ✓','תודה! ההערה נשלחה ✓'));var m=me();if(m){m.n=(m.n||0)+1;save();award(5);badge('note')}
  }).catch(function(e){if(e&&e.status===401)badPass();else toast(tx('Can’t reach the family server right now','אין חיבור לשרת המשפחה כרגע'))})}
