/* ---------- lightbox ---------- */
var LB={g:null,i:0};
function openLB(g,i){LB.g=g;LB.i=i;$('#lb').hidden=false;document.body.classList.add('lock');renderLB()}
function closeLB(){var v=$('#lb video');if(v)v.pause();$('#lb').hidden=true;$('#lb').innerHTML='';document.body.classList.remove('lock')}
function renderLB(){
  var arr=GRIDS[LB.g]||[],it=arr[LB.i];if(!it)return closeLB();var tr=it._trip,src=media(tr,it.src),st;
  st=it.type==='video'?'<video src="'+esc(src)+'" poster="'+esc(media(tr,it.poster||it.thumb||''))+'" controls playsinline autoplay preload="metadata"></video>':'<img src="'+esc(src)+'" alt="'+esc(L(it.caption))+'">';
  var ch=(tr.chapters||[]).filter(function(c){return c.id===it.chapter})[0];
  var h='<div class="lb-top"><button data-act="lbx" aria-label="Close">'+ic('close')+'</button><span class="lb-n">'+(LB.i+1)+' / '+arr.length+'</span><a class="btn ghost sm" href="'+esc(src)+'" target="_blank" rel="noopener">'+esc(t('fullSize'))+'</a></div>';
  h+='<div class="lb-stage">'+st+(LB.i>0?'<button class="lb-nav p" data-act="lbp" aria-label="Previous">'+ic('back')+'</button>':'')+(LB.i<arr.length-1?'<button class="lb-nav n" data-act="lbn" aria-label="Next">'+ic('chev')+'</button>':'')+'</div>';
  h+='<div class="lb-cap">'+(L(it.caption)?'<p dir="auto">'+esc(L(it.caption))+'</p>':'')+'<small>'+esc([L(tr.title),ch?L(ch.title):''].filter(Boolean).join(' · '))+'</small>';
  if(it.people&&it.people.length)h+='<div class="tagp">'+it.people.map(function(p){return'<a href="#/memories/person/'+p+'">'+esc(pName(p))+'</a>'}).join('')+'</div>';
  h+='<div class="row2"><span></span><button class="btn ghost sm" data-act="note" data-trip="'+tr.id+'" data-item="'+esc(it.id)+'">'+ic('note')+esc(t('addNote'))+'</button></div></div>';
  $('#lb').innerHTML=h;
}
function lbStep(d){var v=$('#lb video');if(v)v.pause();var n=LB.i+d,arr=GRIDS[LB.g]||[];if(n<0||n>=arr.length)return;LB.i=n;renderLB()}
(function(){var x0=null,y0=0,el=$('#lb');el.addEventListener('touchstart',function(e){if(e.target.closest('video'))return;x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});el.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){var f=dx<0;if(lang==='he')f=!f;lbStep(f?1:-1)}else if(dy>90)closeLB()},{passive:true})})();

/* ---------- sheets: notes, upload ---------- */
var NOTE={};
function sheet(html){var m=$('#note');m.innerHTML='<div class="in">'+html+'</div>';m.hidden=false}
function openNote(trip,item){
  NOTE={trip:trip,item:item||null,who:[]};var tr=TRIPCACHE[trip]||TRIPS.filter(function(x){return x.id===trip})[0]||{};
  var it=item&&tr.items?tr.items.filter(function(x){return x.id===item})[0]:null;if(it)NOTE.who=(it.people||[]).slice();
  var th=it?media(tr,it.thumb||it.poster||it.src):'';
  sheet('<div class="sh-h">'+(th?'<img src="'+esc(th)+'" alt="">':'')+'<div><div class="eyebrow">'+esc(t('noteFor'))+' '+esc(it?(it.type==='video'?t('video'):t('photo')):'')+'</div><h3>'+esc(L(tr.title))+'</h3></div></div><p>'+esc(t('noteSub'))+'</p>'+
   '<label for="nn">'+esc(t('yourName'))+'</label><input id="nn" autocomplete="name" value="'+esc(LS.get('name',''))+'">'+
   '<label>'+esc(t('whoIn'))+'</label><div class="who">'+M.people.map(function(p){return'<button class="chip'+(NOTE.who.indexOf(p.id)>=0?' on':'')+'" data-act="who" data-p="'+p.id+'">'+esc(lang==='he'?p.he:p.en)+'</button>'}).join('')+'</div>'+
   '<label for="nt">'+esc(t('whatHappened'))+'</label><textarea id="nt" dir="auto"></textarea>'+sendBtns('note'));
}
function sendBtns(kind){return'<div class="acts"><button class="btn pri" data-act="send" data-kind="'+kind+'" data-via="wa">'+esc(t('sendWa'))+'</button><button class="btn" data-act="send" data-kind="'+kind+'" data-via="mail">'+esc(t('sendMail'))+'</button></div><div class="center"><button class="link muted" data-act="notex">'+esc(t('cancel'))+'</button></div>'}
function noteMsg(){
  var tr=TRIPCACHE[NOTE.trip]||TRIPS.filter(function(x){return x.id===NOTE.trip})[0]||{};
  var link=CONFIG.site+'#/trip/'+NOTE.trip+(NOTE.item?'/i/'+NOTE.item:''),who=NOTE.who.map(pName).join(', '),name=$('#nn').value.trim();LS.set('name',name);
  var lines=[(lang==='he'?'הערה לזכרונות':'Memory note')+': '+L(tr.title)+(NOTE.item?' ('+NOTE.item+')':'')];if(who)lines.push(t('whoIn')+' '+who);var tx=$('#nt').value.trim();if(tx)lines.push(tx);if(name)lines.push('— '+name);lines.push(link);
  return{subject:(lang==='he'?'הערה: ':'Note: ')+L(tr.title),body:lines.join('\n')};
}
function sendVia(via,m){var url=via==='wa'?'https://wa.me/'+CONFIG.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(m.body):'mailto:'+encodeURIComponent(CONFIG.notesEmail)+'?subject='+encodeURIComponent(m.subject)+'&body='+encodeURIComponent(m.body);window.open(url,'_blank');$('#note').hidden=true}
function openUpload(){
  var has=!!CONFIG.uploadUrl;
  sheet('<div class="eyebrow">'+esc(t('t_mem'))+'</div><h3>'+esc(lang==='he'?'הוספת תמונות וסרטונים':'Add photos and videos')+'</h3><p>'+esc(has?(lang==='he'?'האלבום המשותף של המשפחה ייפתח. הוסיפו שם את התמונות, ואנחנו נכניס אותן לאתר.':'The family shared album opens. Add your photos there and we’ll bring them into the site.'):(lang==='he'?'ההעלאה תיפתח בקרוב. בינתיים שלחו לנו את התמונות בוואטסאפ.':'Uploading opens soon. For now, send us your photos on WhatsApp.'))+'</p>'+
   (has?'<a class="btn pri wide" href="'+esc(CONFIG.uploadUrl)+'" target="_blank" rel="noopener">'+ic('plus')+esc(lang==='he'?'לאלבום המשותף':'Open the shared album')+'</a>':'<span class="pending">'+esc(lang==='he'?'ממתין להגדרה':'Pending setup')+'</span><a class="btn pri wide" href="https://wa.me/'+CONFIG.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(lang==='he'?'שולחים תמונות לאתר המשפחה 📸':'Sending photos for the family site 📸')+'" target="_blank" rel="noopener">'+esc(t('sendWa'))+'</a>')+
   '<div class="center"><button class="link muted" data-act="notex">'+esc(t('cancel'))+'</button></div>');
}

/* ---------- player ---------- */
var au=$('#au'),Q=[],QI=-1,SHUF=false,counted=null;
function cur(){return QI>=0?SONG[Q[QI]]:null}
function playList(ids,i,shuffle){
  var want=ids[i||0];ids=ids.filter(function(id){return SONG[id]&&SONG[id].s});i=Math.max(0,ids.indexOf(want));if(!ids.length)return false;
  if(shuffle){for(var k=ids.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),x=ids[k];ids[k]=ids[j];ids[j]=x}i=0}
  Q=ids;QI=i;load(true);return true;
}
function load(autoplay){
  var s=cur();if(!s)return;au.src=s.s;counted=null;if(autoplay){var p=au.play();if(p&&p.catch)p.catch(function(){renderMini()})}
  recents=[s.id].concat(recents.filter(function(x){return x!==s.id})).slice(0,40);LS.set('recent',recents);
  if('mediaSession'in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:sTitle(s),artist:t('fam'),album:aName(s.a),artwork:s.c?[{src:new URL(cov(s,1),location.href).href,sizes:'360x360',type:'image/webp'}]:[]})}catch(e){}}
  document.body.classList.add('has-mini');renderMini();markRows();if(!$('#np').hidden)renderNP();if(!$('#kar').hidden)renderKar();
}
function next(){if(QI<Q.length-1){QI++;load(true)}}
function prev(){if(au.currentTime>4){au.currentTime=0;return}if(QI>0){QI--;load(true)}}
au.addEventListener('ended',function(){if(QI<Q.length-1)next();else{renderMini();updNP()}});
au.addEventListener('play',function(){renderMini();updNP();karSync(true)});au.addEventListener('pause',function(){renderMini();updNP();karSync(false)});
au.addEventListener('seeked',function(){karSync(!au.paused)});
au.addEventListener('timeupdate',function(){var p=$('#mini .pg i');if(p&&au.duration)p.style.transform='scaleX('+(au.currentTime/au.duration)+')';updNP(true);var s=cur();if(s&&counted!==s.id&&au.currentTime>30){counted=s.id;plays[s.id]=(plays[s.id]||0)+1;LS.set('plays',plays);if(window.funListen)funListen(s.id)}});
if('mediaSession'in navigator){try{navigator.mediaSession.setActionHandler('nexttrack',next);navigator.mediaSession.setActionHandler('previoustrack',prev);navigator.mediaSession.setActionHandler('play',function(){au.play()});navigator.mediaSession.setActionHandler('pause',function(){au.pause()})}catch(e){}}
function markRows(){var s=cur();$$('.row[data-sid]').forEach(function(r){r.classList.toggle('playing',!!s&&r.getAttribute('data-sid')===s.id)})}
function renderMini(){
  var s=cur(),m=$('#mini');if(!s){m.hidden=true;return}m.hidden=false;
  m.innerHTML='<img src="'+cov(s)+'" width="44" height="44" alt=""><button class="tx" data-act="np"><span class="tt" dir="auto">'+esc(sTitle(s))+'</span><span class="st">'+esc(aName(s.a))+'</span></button><div class="mc" dir="ltr"><button data-act="prev" aria-label="Previous">'+ic('prev')+'</button><button data-act="toggle" aria-label="Play">'+ic(au.paused?'play':'pause')+'</button><button data-act="next" aria-label="Next">'+ic('next')+'</button></div><div class="pg"><i></i></div>';
}
var NPTAB='lyrics';
function openNP(){$('#np').hidden=false;document.body.classList.add('lock');renderNP();needLyrics().then(function(){if(NPTAB==='lyrics')renderNP()})}
function closeNP(){$('#np').hidden=true;document.body.classList.remove('lock')}
function renderNP(){
  var s=cur(),el=$('#np');if(!s||el.hidden)return;var f=favs.indexOf(s.id)>=0;
  var h='<div class="np-top"><button data-act="npx" aria-label="Close">'+ic('down')+'</button><span class="eyebrow">'+esc(t('nowPlaying'))+'</span><button data-act="fav" data-id="'+s.id+'" class="'+(f?'fav':'')+'" aria-label="'+esc(t('favs'))+'">'+ic(f?'heart-f':'heart')+'</button></div>';
  h+='<img class="np-art" src="'+cov(s,1)+'" width="360" height="360" alt=""><div class="np-meta"><h2 dir="auto">'+esc(sTitle(s))+'</h2><p><a href="#/song/'+s.id+'" data-act="npx">'+esc(aName(s.a))+'</a>'+(s.st&&s.st.length?' · ★ '+s.st.map(pName).join(', '):'')+'</p>'+(s.x?'<p class="tease">'+esc(L(s.x))+'</p>':'')+'</div>';
  h+='<div class="np-bar"><input id="seek" type="range" min="0" max="1000" value="0" aria-label="Seek"><div class="np-time"><span id="tc">0:00</span><span id="td">'+fmt(s.d)+'</span></div></div>';
  h+='<div class="np-ctl"><button data-act="shuf" class="'+(SHUF?'on':'')+'" aria-label="'+esc(t('shuffle'))+'">'+ic('shuffle')+'</button><button data-act="prev" aria-label="Previous">'+ic('prev')+'</button><button class="pl" data-act="toggle" aria-label="Play">'+ic(au.paused?'play':'pause')+'</button><button data-act="next" aria-label="Next">'+ic('next')+'</button><button data-act="kar" data-id="'+s.id+'" aria-label="'+esc(t('singAlong'))+'">'+ic('mic')+'</button></div>';
  h+='<div class="np-tabs"><button data-act="nptab" data-tab="lyrics" class="'+(NPTAB==='lyrics'?'on':'')+'">'+esc(t('lyrics'))+'</button><button data-act="nptab" data-tab="queue" class="'+(NPTAB==='queue'?'on':'')+'">'+esc(t('queue'))+'</button></div><div class="np-body">';
  if(NPTAB==='queue'){var up=Q.slice(QI+1).map(function(id){return SONG[id]}).filter(Boolean);LISTS.q=Q.slice();h+=up.length?'<ul class="songs">'+up.slice(0,50).map(function(x,k){return songRow(x,QI+1+k,'q')}).join('')+'</ul>':'<p class="empty">—</p>'}
  else h+=LYR?lyricsHTML(s):'<p class="empty">…</p>';
  el.innerHTML=h+'</div>';
  var sk=$('#seek');sk.addEventListener('input',function(){if(au.duration)au.currentTime=sk.value/1000*au.duration});updNP(true);
}
function updNP(timeOnly){var el=$('#np');if(el.hidden)return;var sk=$('#seek');if(sk&&au.duration&&document.activeElement!==sk)sk.value=au.currentTime/au.duration*1000;var tc=$('#tc');if(tc)tc.textContent=fmt(au.currentTime);var td=$('#td');if(td&&au.duration&&isFinite(au.duration))td.textContent=fmt(au.duration);if(!timeOnly){var b=$('#np .pl');if(b)b.innerHTML=ic(au.paused?'play':'pause')}}

/* ---------- sing-along (karaoke) ---------- */
var KAR={id:null,sync:null,lines:[],inst:null,ctx:null,gA:null,gB:null,v:100,raf:0,act:-1};
function openKar(id){
  var s=SONG[id];if(!s)return;
  if(!cur()||cur().id!==id){if(s.s)playList([id],0,false)}
  KAR.id=id;KAR.act=-1;$('#kar').hidden=false;document.body.classList.add('lock');
  renderKar();
  var p=[needLyrics()];if(s.k&&s.k.y)p.push(getJSON(s.k.y).then(function(d){KAR.sync=d}).catch(function(){KAR.sync=null}));else KAR.sync=null;
  Promise.all(p).then(function(){if(KAR.id===id)renderKar()});
  if(s.k&&s.k.i){if(!KAR.inst||KAR.inst.getAttribute('data-id')!==id){if(KAR.inst){KAR.inst.pause()}KAR.inst=new Audio(s.k.i);KAR.inst.preload='auto';KAR.inst.setAttribute('data-id',id)}}
  cancelAnimationFrame(KAR.raf);(function loop(){karTick();KAR.raf=requestAnimationFrame(loop)})();
}
function closeKar(){$('#kar').hidden=true;document.body.classList.remove('lock');cancelAnimationFrame(KAR.raf);setVox(100);if(KAR.inst)KAR.inst.pause()}
function karLines(s){var b=(LYR&&LYR[s.id])||[],out=[];b.forEach(function(x,bi){var ls=(lang==='he'&&!KAR.sync&&x.lh&&x.lh.length)?x.lh:x.l;(ls||[]).forEach(function(l,li){out.push({t:l,b:bi,h:li===0?(lang==='he'?(x.th||x.t):x.t):null})})});return out}
function renderKar(){
  var s=SONG[KAR.id],el=$('#kar');if(!s||el.hidden)return;var hasI=!!(s.k&&s.k.i);
  KAR.lines=karLines(s);KAR.act=-1;
  var h='<div class="k-top"><button data-act="karx" aria-label="Close">'+ic('down')+'</button><div class="k-ti"><b dir="auto">'+esc(sTitle(s))+'</b><small>'+esc(t('singAlong'))+'</small></div><button data-act="toggle" class="k-pl" aria-label="Play">'+ic(au.paused?'play':'pause')+'</button></div>';
  h+='<div class="k-lines" id="klines">'+(KAR.lines.length?KAR.lines.map(function(l,i){return(l.h?'<div class="k-h">'+esc(l.h)+'</div>':'')+'<p class="kl" data-i="'+i+'" dir="'+dirOf(l.t)+'">'+esc(l.t)+'</p>'}).join(''):'<p class="empty">'+esc(LYR?t('noLyrics'):'…')+'</p>')+'<div class="k-pad"></div></div>';
  h+='<div class="k-bot">'+(hasI?'<label class="k-vox"><span>'+esc(t('vocals'))+'</span><input id="kvox" type="range" min="0" max="100" step="1" value="'+KAR.v+'" aria-label="'+esc(t('vocals'))+'"><span id="kvl">'+(KAR.v<=2?esc(t('vocOff')):KAR.v>=98?esc(t('vocOn')):KAR.v+'%')+'</span></label>':'<p class="k-note">'+esc(t('karNoInst'))+'</p>')+(KAR.sync?'':'<p class="k-note">'+esc(t('karSoon'))+'</p>')+'</div>';
  el.innerHTML=h;
  var vx=$('#kvox');if(vx)vx.addEventListener('input',function(){setVox(+vx.value)});
}
function karTimes(){
  /* returns array of [start,end] per line: synced if available, else spread evenly over the song */
  var n=KAR.lines.length,s=SONG[KAR.id];if(KAR.sync&&KAR.sync.lines&&KAR.sync.lines.length===n)return KAR.sync.lines;
  var D=au.duration&&isFinite(au.duration)?au.duration:(s?s.d:180),a=D*.06,b=D*.95,st=(b-a)/Math.max(1,n),o=[];for(var i=0;i<n;i++)o.push([a+i*st,a+(i+1)*st]);return o;
}
function karTick(){
  if($('#kar').hidden||!KAR.lines.length)return;if(!cur()||cur().id!==KAR.id)return;
  var tm=au.currentTime,T2=karTimes(),a=-1;for(var i=0;i<T2.length;i++){if(tm>=T2[i][0]-.15)a=i;else break}
  if(a!==KAR.act){var old=$('#klines .kl.on');if(old)old.classList.remove('on');$$('#klines .kl.done').forEach(function(e){if(+e.getAttribute('data-i')>=a)e.classList.remove('done')});
    if(a>=0){var e=$('#klines .kl[data-i="'+a+'"]');if(e){e.classList.add('on');for(var j=0;j<a;j++){var d=$('#klines .kl[data-i="'+j+'"]');if(d)d.classList.add('done')}var box=$('#klines');box.scrollTo({top:e.offsetTop-box.clientHeight*.38,behavior:'smooth'})}}KAR.act=a}
  if(KAR.inst&&!au.paused&&KAR.v<100&&Math.abs(KAR.inst.currentTime-au.currentTime)>.12)KAR.inst.currentTime=au.currentTime;
}
function ensureGraph(){
  if(KAR.ctx)return true;var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
  try{KAR.ctx=new AC();var a=KAR.ctx.createMediaElementSource(au);KAR.gA=KAR.ctx.createGain();a.connect(KAR.gA).connect(KAR.ctx.destination);return true}catch(e){KAR.ctx=null;return false}
}
function setVox(v){
  KAR.v=v;var l=$('#kvl');if(l)l.textContent=v<=2?t('vocOff'):v>=98?t('vocOn'):v+'%';
  var s=SONG[KAR.id];if(!KAR.inst||!s||!s.k||!s.k.i)return;
  if(v<100&&!KAR.ctx){if(!ensureGraph()){au.muted=v<50;KAR.inst.muted=v>=50;karSync(!au.paused);return}}
  if(KAR.ctx){if(KAR.ctx.state==='suspended')KAR.ctx.resume();if(!KAR.gB){try{var b=KAR.ctx.createMediaElementSource(KAR.inst);KAR.gB=KAR.ctx.createGain();b.connect(KAR.gB).connect(KAR.ctx.destination)}catch(e){}}
    KAR.gA.gain.value=v/100;if(KAR.gB)KAR.gB.gain.value=1-v/100}
  karSync(!au.paused);
}
function karSync(playing){var i=KAR.inst;if(!i)return;var s=cur();if(!s||s.id!==i.getAttribute('data-id')||KAR.v>=100||$('#kar').hidden&&KAR.v>=100){i.pause();return}
  try{i.currentTime=au.currentTime}catch(e){}if(playing){var p=i.play();if(p&&p.catch)p.catch(function(){})}else i.pause()}
