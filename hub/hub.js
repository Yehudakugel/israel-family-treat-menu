/* Bernshtein family hub · songs & memories */
(function(){
'use strict';var VER='3';
var CONFIG={
  whatsapp:'',        // optional: international number without + (e.g. 9725xxxxxxxx). Empty = family picks the chat.
  notesEmail:'',      // optional: address for emailed notes. Empty = family picks the recipient.
  site:'https://yehudakugel.github.io/israel-family-treat-menu/',
  helicopter:'2026-10-05T09:00:00+03:00'
};
var T={
 en:{fam:'The Bernshtein Family',hubsub:'Songs · Memories',t_home:'Home',t_music:'Music',t_search:'Search',t_mem:'Memories',
  welcome:'Our songs, our trips, our family',heroP:'Every song we sing together and every trip we take, kept in one place.',
  songsN:'{n} songs',songsN1:'1 song',tripsN1:'1 trip',itemsN1:'1 memory',photosN1:'1 photo',videosN1:'1 video',albumsN:'{n} albums',tripsN:'{n} trips',photosN:'{n} photos',videosN:'{n} videos',itemsN:'{n} memories',
  listen:'Listen',open:'Open',seeAll:'See all',albums:'Albums',album:'Album',lbl:'Bernshtein',people:'People',songs:'Songs',recent:'Recently played',
  favs:'Favourites',all:'All',fresh:'From the Chol HaMoed trip',latest:'Latest memories',everyone:'Everyone',
  upcoming:'Coming up',heli:'Helicopter flight',heliSub:'Monday 5 October, be’ezras Hashem',days:'days',hrs:'hrs',min:'min',
  guide:'The trip guide',guideSub:'Thursday’s full day, step by step',play:'Play',shuffle:'Shuffle',
  searchPh:'Songs, words, people, memories…',noRes:'Nothing found. Try another word.',searchHint:'Search by song name, a word from the lyrics, or a person.',
  lyrics:'Lyrics',queue:'Up next',noLyrics:'No lyrics for this one.',versions:'Other takes',take:'Take {n}',
  nowPlaying:'Now playing',back:'Back',inSongs:'Songs with {p}',inMem:'{p} in our memories',
  memIntro:'Trips and days out, one album each.',byTrip:'By trip',byPerson:'By person',
  noteCta:'Know who’s in it or what happened?',noteCtaSub:'Send us a note: we’ll add it to the album.',
  addNote:'Add a note',noteTitle:'Send a note',noteSub:'Tell us who’s in the picture or what happened. It opens WhatsApp or email with your note ready to send.',
  yourName:'Your name',whoIn:'Who’s in it?',whatHappened:'What happened?',sendWa:'WhatsApp',sendMail:'Email',cancel:'Cancel',
  noteFor:'Note for',photo:'Photo',video:'Video',fullSize:'Full size',chapter:'Part',
  tripSoon:'Photos will appear here after the trip.',seeGuide:'Open the trip guide',tripSongs:'Songs from this trip',
  favsEmpty:'Tap the heart on any song to keep it here.',recentEmpty:'Songs you play will show up here.',
  lang_he:'Hebrew',lang_yi:'Yiddish',lang_en:'English',memNone:'No memories with this filter yet.',moreSoon:'More trips are on the way.',
  peopleSub:'Songs and memories for each of us'},
 he:{fam:'משפחת ברנשטיין',hubsub:'שירים · זכרונות',t_home:'בית',t_music:'מוזיקה',t_search:'חיפוש',t_mem:'זכרונות',
  welcome:'השירים שלנו, הטיולים שלנו, המשפחה שלנו',heroP:'כל שיר שאנחנו שרים יחד וכל טיול שאנחנו עושים, במקום אחד.',
  songsN:'{n} שירים',songsN1:'שיר אחד',tripsN1:'טיול אחד',itemsN1:'זכרון אחד',photosN1:'תמונה אחת',videosN1:'סרטון אחד',albumsN:'{n} אלבומים',tripsN:'{n} טיולים',photosN:'{n} תמונות',videosN:'{n} סרטונים',itemsN:'{n} זכרונות',
  listen:'להאזנה',open:'לפתיחה',seeAll:'הכל',albums:'אלבומים',album:'אלבום',lbl:'ברנשטיין',people:'אנשים',songs:'שירים',recent:'הושמעו לאחרונה',
  favs:'אהובים',all:'הכל',fresh:'מטיול חול המועד',latest:'זכרונות אחרונים',everyone:'כולם',
  upcoming:'בקרוב',heli:'טיסת מסוק',heliSub:'יום שני, ב׳ תשרי… בעזרת השם',days:'ימים',hrs:'שעות',min:'דקות',
  guide:'מדריך הטיול',guideSub:'כל היום של חמישי, שלב אחרי שלב',play:'נגן',shuffle:'ערבב',
  searchPh:'שירים, מילים, אנשים, זכרונות…',noRes:'לא נמצא. נסו מילה אחרת.',searchHint:'חפשו לפי שם שיר, מילה מהשיר, או שם.',
  lyrics:'מילים',queue:'הבא בתור',noLyrics:'אין מילים לשיר הזה.',versions:'ביצועים נוספים',take:'ביצוע {n}',
  nowPlaying:'מתנגן עכשיו',back:'חזרה',inSongs:'שירים עם {p}',inMem:'{p} בזכרונות שלנו',
  memIntro:'טיולים ויציאות, אלבום לכל אחד.',byTrip:'לפי טיול',byPerson:'לפי אדם',
  noteCta:'יודעים מי בתמונה או מה קרה?',noteCtaSub:'שלחו לנו הערה ונוסיף אותה לאלבום.',
  addNote:'הוספת הערה',noteTitle:'שליחת הערה',noteSub:'ספרו לנו מי בתמונה או מה קרה. ייפתח וואטסאפ או מייל עם ההודעה מוכנה לשליחה.',
  yourName:'השם שלך',whoIn:'מי בתמונה?',whatHappened:'מה קרה?',sendWa:'וואטסאפ',sendMail:'מייל',cancel:'ביטול',
  noteFor:'הערה על',photo:'תמונה',video:'סרטון',fullSize:'גודל מלא',chapter:'חלק',
  tripSoon:'התמונות יופיעו כאן אחרי הטיול.',seeGuide:'למדריך הטיול',tripSongs:'השירים של הטיול',
  favsEmpty:'לחצו על הלב ליד שיר כדי לשמור אותו כאן.',recentEmpty:'שירים שתשמיעו יופיעו כאן.',
  lang_he:'עברית',lang_yi:'אידיש',lang_en:'אנגלית',memNone:'אין עדיין זכרונות בסינון הזה.',moreSoon:'עוד טיולים בדרך.',
  peopleSub:'השירים והזכרונות של כל אחד מאיתנו'}
};
T.he.heliSub='יום שני, 5 באוקטובר, בעזרת השם';
var LS={get:function(k,d){try{var v=localStorage.getItem('bh_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:function(k,v){try{localStorage.setItem('bh_'+k,JSON.stringify(v))}catch(e){}}};
var qs=new URLSearchParams(location.search);
var lang=qs.get('lang')||LS.get('lang',null)||((navigator.language||'').indexOf('he')===0?'he':'en');
if(lang!=='he'&&lang!=='en')lang='he';
var M=null,TRIPS=[],TRIPCACHE={},SONG={},ALB={},PPL={};
var favs=LS.get('favs',[]),recents=LS.get('recent',[]);
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
function t(k,o){if(o&&o.n===1&&(T[lang][k+'1']||T.en[k+'1']))k=k+'1';var s=(T[lang][k]!=null?T[lang][k]:T.en[k])||k;if(o)for(var x in o)s=s.replace('{'+x+'}',o[x]);return s}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function L(o){if(o==null)return'';if(typeof o==='string')return o;return o[lang]||o.en||o.he||''}
function ic(n){return'<svg aria-hidden="true"><use href="#i-'+n+'"/></svg>'}
function fmt(s){s=Math.max(0,Math.round(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function hasHe(s){return/[\u0590-\u05FF]/.test(s||'')}
function dirOf(s){return hasHe(s)?'rtl':'ltr'}
function sTitle(s){return lang==='he'?(s.title_he||s.title):(s.title_en||s.title)}
function aName(id){var a=ALB[id];return a?(lang==='he'?a.he:a.en):''}
function pName(id){var p=PPL[id];return p?(lang==='he'?p.he:p.en):id}
function dateFmt(d,o){try{return new Intl.DateTimeFormat(lang==='he'?'he-IL':'en-GB',o||{day:'numeric',month:'long',year:'numeric'}).format(new Date(d+'T12:00:00'))}catch(e){return d}}
function norm(s){return String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0591-\u05C7\u0300-\u036f\u2066-\u2069]/g,'').replace(/[׳'’`"״]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}
function avatar(id){return'images/people/'+id+'.jpg'}
function media(trip,u){if(!u)return'';if(/^(https?:)?\/\//.test(u)||!trip||!trip.base)return u;return trip.base.replace(/\/?$/,'/')+u}

/* ---------- i18n chrome ---------- */
function applyLang(){
  var h=document.documentElement;h.lang=lang;h.dir=lang==='he'?'rtl':'ltr';
  $$('[data-t]').forEach(function(e){e.textContent=t(e.getAttribute('data-t'))});
  $$('[data-lang]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-lang')===lang)});
  document.title=lang==='he'?'משפחת ברנשטיין':'The Bernshtein Family';
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-lang]');if(!b)return;lang=b.getAttribute('data-lang');LS.set('lang',lang);applyLang();route();renderMini();if(!$('#np').hidden)renderNP();});

/* ---------- covers ---------- */
function albumCover(a,big){
  var ss=M.songs.filter(function(s){return s.album===a.id&&s.cover}).slice(0,3);
  return'<div class="acov k-'+a.id+'"'+(big?' style="padding:14px"':'')+'><div class="m">'+ss.map(function(s){return'<img loading="lazy" src="'+esc(s.cover)+'" alt="">'}).join('')+'</div><div><small>'+esc(t('lbl'))+'</small><b>'+esc(lang==='he'?a.he:a.en)+'</b></div></div>';
}
function albumCard(a){return'<a class="acard" href="#/album/'+a.id+'">'+albumCover(a)+'<div class="t">'+esc(lang==='he'?a.he:a.en)+'</div><div class="s">'+esc(t('songsN',{n:a.n}))+'</div></a>'}
function personChip(p,on,href){return'<a class="pp'+(on?' on':'')+'" href="'+href+'"><img loading="lazy" src="'+avatar(p.id)+'" alt="">'+esc(lang==='he'?p.he:p.en)+'</a>'}

/* ---------- song rows ---------- */
function songRow(s,i,listKey){
  var on=cur()&&cur().id===s.id,f=favs.indexOf(s.id)>=0;
  var sub=[aName(s.album),fmt(s.dur)];
  return'<li class="row'+(on?' playing':'')+'" data-sid="'+s.id+'">'+
   '<img class="cv" loading="lazy" src="'+esc(s.cover||'')+'" alt="">'+
   '<div class="tx" data-act="play" data-list="'+listKey+'" data-i="'+i+'"><div class="tt" dir="auto">'+esc(sTitle(s))+'</div><div class="st">'+esc(sub.join(' · '))+'</div></div>'+
   '<button class="ic'+(f?' fav':'')+'" data-act="fav" aria-label="'+t('favs')+'">'+ic(f?'heart-f':'heart')+'</button></li>';
}
var LISTS={};
function songList(arr,key){LISTS[key]=arr.map(function(s){return s.id});if(!arr.length)return'';return'<ul class="songs">'+arr.map(function(s,i){return songRow(s,i,key)}).join('')+'</ul>'}

/* ---------- views ---------- */
var V=$('#view');
function setView(html,tab){V.innerHTML='<div class="fade">'+html+'</div>';$$('.tabs a').forEach(function(a){a.classList.toggle('on',a.getAttribute('data-tab')===tab)});window.scrollTo(0,0);hydrate();}
function hydrate(){$$('[data-cd]').forEach(cdTick);centerOn()}
function centerOn(){$$('.pp.on').forEach(function(e){var r=e.parentNode;if(!r)return;var x=e.offsetLeft-r.clientWidth/2+e.offsetWidth/2;r.scrollLeft=lang==='he'?x-r.scrollWidth+r.clientWidth:x})}
function cdTick(el){var d=new Date(el.getAttribute('data-cd'))-new Date();if(d<0)d=0;var D=Math.floor(d/864e5),H=Math.floor(d/36e5)%24,Mi=Math.floor(d/6e4)%60;el.innerHTML='<span>'+D+'<i>'+t('days')+'</i></span><span>'+H+'<i>'+t('hrs')+'</i></span><span>'+Mi+'<i>'+t('min')+'</i></span>'}
setInterval(function(){$$('[data-cd]').forEach(cdTick)},30000);

function vHome(){
  var past=TRIPS.filter(function(x){return x.status!=='upcoming'}),up=TRIPS.filter(function(x){return x.status==='upcoming'});
  var nItems=past.reduce(function(a,x){return a+(x.count||0)},0);
  var h='<section class="hero"><img class="hero-img" src="images/itinerary/hero-family-800.jpg" srcset="images/itinerary/hero-family-800.jpg 800w, images/itinerary/hero-family.jpg 1600w" sizes="100vw" alt="">'+
   '<div class="hero-body"><img class="crest" src="images/brand/monogram.svg" alt=""><div class="eyebrow">'+esc(t('fam'))+'</div><h1 class="h1">'+esc(t('welcome'))+'</h1><p>'+esc(t('heroP'))+'</p></div></section>';
  h+='<div class="wrap"><div class="sec"><div class="tiles">'+
   '<a class="tile" href="#/music"><span class="eyebrow">'+esc(t('t_music'))+'</span><span><b>'+esc(t('songsN',{n:M.songs.length}))+'</b><br><small>'+esc(t('albumsN',{n:M.albums.length}))+'</small></span></a>'+
   '<a class="tile" href="#/memories"><span class="eyebrow">'+esc(t('t_mem'))+'</span><span><b>'+esc(t('tripsN',{n:past.length}))+'</b><br><small>'+esc(t('itemsN',{n:nItems}))+'</small></span></a>';
  if(up[0])h+='<a class="tile dark" href="#/trip/'+up[0].id+'"><span class="eyebrow" style="color:#C9C3B6">'+esc(t('upcoming'))+'</span><span><b>'+esc(L(up[0].title))+'</b><div class="cd" data-cd="'+CONFIG.helicopter+'"></div></span></a>';
  h+='<a class="tile photo" href="thursday.html"><img loading="lazy" src="images/itinerary/boat-family-800.jpg" alt=""><span><b>'+esc(t('guide'))+'</b><br><small>'+esc(t('guideSub'))+'</small></span></a></div></div>';
  var rec=recents.map(function(id){return SONG[id]}).filter(Boolean).slice(0,10);
  var thu=M.songs.filter(function(s){return s.album==='thursday'});
  if(rec.length)h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('recent'))+'</h2><a href="#/music/songs/recent">'+esc(t('seeAll'))+'</a></div>'+songList(rec.slice(0,4),'hrec')+'</div>';
  h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('fresh'))+'</h2><a href="#/album/thursday">'+esc(t('seeAll'))+'</a></div>'+songList(thu.slice(0,5),'hthu')+'</div>';
  h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('albums'))+'</h2><a href="#/music/albums">'+esc(t('seeAll'))+'</a></div><div class="rail">'+M.albums.map(albumCard).join('')+'</div></div>';
  h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('people'))+'</h2></div><div class="rail ppl">'+M.people.map(function(p){return personChip(p,false,'#/person/'+p.id)}).join('')+'</div></div>';
  var lt=past[0];
  if(lt)h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('latest'))+'</h2><a href="#/memories">'+esc(t('seeAll'))+'</a></div>'+tripCard(lt)+'</div>';
  h+=foot()+'</div>';
  setView(h,'home');
}
function foot(){return'<footer class="foot"><img src="images/brand/monogram.svg" alt="" width="36" height="36" style="margin:0 auto 8px">'+esc(t('fam'))+'</footer>'}

function vMusic(sub,filter){
  sub=sub||'songs';filter=filter||'all';
  var h='<div class="wrap"><div class="ph-head"><div class="eyebrow">'+esc(t('t_music'))+'</div><h1 class="h1">'+esc(t('songsN',{n:M.songs.length}))+'</h1></div>';
  h+='<div class="seg" style="margin-top:14px">'+['songs','albums','people'].map(function(k){return'<button class="'+(k===sub?'on':'')+'" data-go="#/music/'+k+'">'+esc(t(k))+'</button>'}).join('')+'</div>';
  if(sub==='albums')h+='<div class="agrid">'+M.albums.map(albumCard).join('')+'</div>';
  else if(sub==='people')h+='<p class="muted" style="margin-bottom:12px">'+esc(t('peopleSub'))+'</p><ul class="songs">'+M.people.map(function(p){var n=M.songs.filter(function(s){return s.people.indexOf(p.id)>=0}).length;return'<li class="row"><img class="cv" style="border-radius:50%" src="'+avatar(p.id)+'" alt=""><a class="tx" href="#/person/'+p.id+'"><div class="tt">'+esc(lang==='he'?p.he:p.en)+'</div><div class="st">'+esc(t('songsN',{n:n}))+'</div></a><span class="ic flip">'+ic('back').replace('<svg','<svg style="transform:scaleX(-1)"')+'</span></li>'}).join('')+'</ul>';
  else{
    var chips=[['all',t('all')],['favs',t('favs')],['recent',t('recent')]].concat(M.types.filter(function(x){return M.songs.some(function(s){return s.type===x.id})}).map(function(x){return['type:'+x.id,lang==='he'?x.he:x.en]})).concat(['he','yi','en'].map(function(l){return['lang:'+l,t('lang_'+l)]}));
    h+='<div class="chips">'+chips.map(function(c){return'<button class="chip'+(c[0]===filter?' on':'')+'" data-go="#/music/songs/'+c[0]+'">'+esc(c[1])+'</button>'}).join('')+'</div>';
    var arr=M.songs;
    if(filter==='favs')arr=favs.map(function(id){return SONG[id]}).filter(Boolean);
    else if(filter==='recent')arr=recents.map(function(id){return SONG[id]}).filter(Boolean);
    else if(filter.indexOf('type:')===0)arr=arr.filter(function(s){return s.type===filter.slice(5)});
    else if(filter.indexOf('lang:')===0)arr=arr.filter(function(s){return s.lang===filter.slice(5)});
    h+='<div class="actions"><button class="btn pri" data-act="playlist" data-list="mus" data-shuffle="0">'+ic('play')+esc(t('play'))+'</button><button class="btn" data-act="playlist" data-list="mus" data-shuffle="1">'+ic('shuffle')+esc(t('shuffle'))+'</button><span class="muted" style="margin-inline-start:auto;align-self:center;font-size:13px">'+esc(t('songsN',{n:arr.length}))+'</span></div>';
    h+=arr.length?songList(arr,'mus'):'<p class="empty">'+esc(filter==='favs'?t('favsEmpty'):t('recentEmpty'))+'</p>';
  }
  setView(h+'</div>','music');
}

function vAlbum(id){
  var a=ALB[id];if(!a)return vMusic('albums');
  var arr=M.songs.filter(function(s){return s.album===id});
  var mins=Math.round(arr.reduce(function(x,s){return x+(s.dur||0)},0)/60);
  var trip=TRIPS.filter(function(x){return x.album===id})[0];
  var h='<div class="wrap"><a class="back" href="#/music/albums">'+ic('back')+esc(t('albums'))+'</a><div class="ahead">'+albumCover(a,1)+'<div><div class="eyebrow">'+esc(t('album'))+'</div><h1>'+esc(lang==='he'?a.he:a.en)+'</h1><p class="muted" style="font-size:13px;margin-top:6px">'+esc(lang==='he'?a.sub_he:a.sub_en)+'</p><p class="muted" style="font-size:12.5px;margin-top:4px">'+esc(t('songsN',{n:arr.length}))+' · '+mins+' '+esc(t('min'))+'</p></div></div>';
  h+='<div class="actions"><button class="btn pri" data-act="playlist" data-list="alb" data-shuffle="0">'+ic('play')+esc(t('play'))+'</button><button class="btn" data-act="playlist" data-list="alb" data-shuffle="1">'+ic('shuffle')+esc(t('shuffle'))+'</button>'+(trip?'<a class="btn" href="#/trip/'+trip.id+'">'+ic('photo')+esc(t('t_mem'))+'</a>':'')+'</div>';
  h+=songList(arr,'alb')+foot()+'</div>';
  setView(h,'music');
}

function vPerson(id){
  var p=PPL[id];if(!p)return vHome();
  var arr=M.songs.filter(function(s){return s.people.indexOf(id)>=0});
  var nm=lang==='he'?p.he:p.en;
  var h='<div class="wrap"><a class="back" href="#/music/people">'+ic('back')+esc(t('people'))+'</a><div class="person-hero"><img src="'+avatar(id)+'" alt=""><h1 class="h1">'+esc(nm)+'</h1><p class="muted" style="font-size:13px;margin-top:4px">'+esc(t('songsN',{n:arr.length}))+'</p></div>';
  h+='<div class="rail ppl" style="margin-top:18px;justify-content:flex-start">'+M.people.map(function(q){return personChip(q,q.id===id,'#/person/'+q.id)}).join('')+'</div>';
  h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('inSongs',{p:nm}))+'</h2></div><div class="actions" style="margin-top:0"><button class="btn pri" data-act="playlist" data-list="per" data-shuffle="0">'+ic('play')+esc(t('play'))+'</button><button class="btn" data-act="playlist" data-list="per" data-shuffle="1">'+ic('shuffle')+esc(t('shuffle'))+'</button></div>'+songList(arr,'per')+'</div>';
  h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('inMem',{p:nm}))+'</h2><a href="#/memories/person/'+id+'">'+esc(t('seeAll'))+'</a></div><div id="pmem"><p class="empty">…</p></div></div>'+foot()+'</div>';
  setView(h,'music');
  loadAllTrips().then(function(){var items=personItems(id);var el=$('#pmem');if(el)el.innerHTML=items.length?gridHTML(items.slice(0,12),'pm'):'<p class="empty">'+esc(t('memNone'))+'</p>'});
}

/* ---------- search ---------- */
var IDX=null;
function buildIdx(){IDX=M.songs.map(function(s){var ly=(s.lyrics||[]).map(function(b){return(b.l||[]).join(' ')+' '+(b.lh||[]).join(' ')}).join(' ');var pp=s.people.map(function(p){return PPL[p]?PPL[p].en+' '+PPL[p].he:p}).join(' ');var a=ALB[s.album]||{};return{s:s,head:norm(s.title+' '+(s.title_he||'')+' '+(s.title_en||'')),meta:norm(pp+' '+a.en+' '+a.he),ly:norm(ly)}})}
function vSearch(q){
  q=q||'';
  var h='<div class="wrap"><div class="ph-head"><div class="eyebrow">'+esc(t('t_search'))+'</div></div><label class="sbox" style="margin-top:10px">'+ic('search')+'<input id="sq" type="search" enterkeyhint="search" autocomplete="off" placeholder="'+esc(t('searchPh'))+'" value="'+esc(q)+'"></label><div id="sres"></div></div>';
  setView(h,'search');
  var inp=$('#sq');inp.addEventListener('input',function(){history.replaceState(null,'','#/search/'+encodeURIComponent(inp.value));doSearch(inp.value)});
  doSearch(q);if(!q)setTimeout(function(){try{inp.focus({preventScroll:true})}catch(e){}},50);
}
function doSearch(q){
  var el=$('#sres');if(!el)return;var n=norm(q);
  if(!n){el.innerHTML='<p class="muted" style="margin:16px 0 18px;font-size:13.5px">'+esc(t('searchHint'))+'</p><div class="rail ppl">'+M.people.map(function(p){return personChip(p,false,'#/person/'+p.id)}).join('')+'</div><div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('albums'))+'</h2></div><div class="agrid">'+M.albums.map(albumCard).join('')+'</div></div>';return}
  if(!IDX)buildIdx();
  var words=n.split(' ');
  var res=IDX.map(function(x){var sc=0;for(var i=0;i<words.length;i++){var w=words[i];if(x.head.indexOf(w)>=0)sc+=10;else if(x.meta.indexOf(w)>=0)sc+=5;else if(x.ly.indexOf(w)>=0)sc+=1;else return null}return{s:x.s,sc:sc}}).filter(Boolean).sort(function(a,b){return b.sc-a.sc}).map(function(x){return x.s});
  var ppl=M.people.filter(function(p){return words.some(function(w){return norm(p.en+' '+p.he).indexOf(w)>=0})});
  var albs=M.albums.filter(function(a){return words.every(function(w){return norm(a.en+' '+a.he).indexOf(w)>=0})});
  var h='';
  if(ppl.length)h+='<div class="sec" style="padding-top:20px"><div class="rail ppl">'+ppl.map(function(p){return personChip(p,false,'#/person/'+p.id)}).join('')+'</div></div>';
  if(albs.length)h+='<div class="sec" style="padding-top:20px"><div class="rail">'+albs.map(albumCard).join('')+'</div></div>';
  if(res.length)h+='<div class="sec" style="padding-top:20px"><div class="sec-h"><h2 class="h2">'+esc(t('songs'))+'</h2><span class="muted" style="font-size:13px">'+res.length+'</span></div>'+songList(res.slice(0,60),'srch')+'</div>';
  el.innerHTML=h+'<div id="smem"></div>';
  if(!h)el.innerHTML='<p class="empty">'+esc(t('noRes'))+'</p><div id="smem"></div>';
  loadAllTrips().then(function(){var m=$('#smem');if(!m||norm($('#sq').value)!==n)return;var items=[];allItems().forEach(function(it){var c=norm(L(it.caption)+' '+(it.caption?it.caption.en+' '+it.caption.he:'')+' '+(it.people||[]).map(function(p){return PPL[p]?PPL[p].en+' '+PPL[p].he:''}).join(' ')+' '+L(it._trip.title));if(words.every(function(w){return c.indexOf(w)>=0}))items.push(it)});if(items.length){m.innerHTML='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('t_mem'))+'</h2><span class="muted" style="font-size:13px">'+items.length+'</span></div>'+gridHTML(items.slice(0,24),'sm')+'</div>';var nr=$('#sres .empty');if(nr)nr.remove()}});
}

/* ---------- memories ---------- */
function loadTrip(id){if(TRIPCACHE[id])return Promise.resolve(TRIPCACHE[id]);var s=TRIPS.filter(function(x){return x.id===id})[0];if(!s)return Promise.reject();return fetch(s.file).then(function(r){return r.json()}).then(function(tr){(tr.items||[]).forEach(function(it){it._trip=tr});TRIPCACHE[id]=tr;return tr})}
var allP=null;
function loadAllTrips(){if(!allP)allP=Promise.all(TRIPS.filter(function(x){return x.count>0}).map(function(x){return loadTrip(x.id).catch(function(){})}));return allP}
function allItems(){var a=[];TRIPS.forEach(function(x){var tr=TRIPCACHE[x.id];if(tr)a=a.concat(tr.items||[])});return a}
function personItems(id){return allItems().filter(function(it){return(it.people||[]).indexOf(id)>=0})}
function tripCard(x){
  var up=x.status==='upcoming';
  var meta=up?L(x.place):[dateFmt(x.date),L(x.place)].filter(Boolean).join(' · ');
  var cnt=up?'':[x.photos?t('photosN',{n:x.photos}):'',x.videos?t('videosN',{n:x.videos}):''].filter(Boolean).join(' · ');
  var h='<a class="tcard'+(up?' up':'')+'" href="#/trip/'+x.id+'">';
  if(x.cover)h+='<img class="ti" loading="lazy" src="'+esc(/^images\/itinerary\//.test(x.cover)?x.cover.replace(/\.jpg$/,'-800.jpg'):x.cover)+'" onerror="this.onerror=null;this.src=\''+esc(x.cover)+'\'" alt="">';
  h+='<div class="tb">'+(up?'<div class="eyebrow" style="color:#C9C3B6">'+esc(t('upcoming'))+'</div>':'')+'<h3>'+esc(L(x.title))+'</h3><div class="meta">'+esc(meta)+'</div>';
  if(up)h+='<div class="cd" data-cd="'+CONFIG.helicopter+'"></div>';
  if(cnt)h+='<div class="meta">'+esc(cnt)+'</div>';
  if(x.people&&x.people.length)h+='<div class="av">'+x.people.map(function(p){return'<img src="'+avatar(p)+'" alt="'+esc(pName(p))+'">'}).join('')+'</div>';
  return h+'</div></a>';
}
var GRIDS={};
function gridHTML(items,key){GRIDS[key]=items;return'<div class="grid">'+items.map(function(it,i){var tr=it._trip;var th=media(tr,it.thumb||it.poster||it.src);var r=it.w&&it.h?(' width="'+it.w+'" height="'+it.h+'"'):'';return'<div class="gi" data-act="lb" data-g="'+key+'" data-i="'+i+'"><img loading="lazy" src="'+esc(th)+'"'+r+' alt="'+esc(L(it.caption))+'">'+(it.type==='video'?'<span class="vd">'+ic('play')+(it.duration?fmt(it.duration):esc(t('video')))+'</span>':'')+'</div>'}).join('')+'</div>'}
function vMemories(mode,pid){
  var h='<div class="wrap"><div class="ph-head"><div class="eyebrow">'+esc(t('t_mem'))+'</div><h1 class="h1">'+esc(t('t_mem'))+'</h1><p class="muted" style="margin-top:6px">'+esc(t('memIntro'))+'</p></div>';
  h+='<div class="seg" style="margin-top:16px"><button class="'+(mode!=='person'?'on':'')+'" data-go="#/memories">'+esc(t('byTrip'))+'</button><button class="'+(mode==='person'?'on':'')+'" data-go="#/memories/person/'+(pid||M.people[0].id)+'">'+esc(t('byPerson'))+'</button></div>';
  if(mode==='person'){
    h+='<div class="rail ppl">'+M.people.map(function(p){return personChip(p,p.id===pid,'#/memories/person/'+p.id)}).join('')+'</div><div id="mres" style="margin-top:18px"><p class="empty">…</p></div>';
    setView(h+foot()+'</div>','memories');
    loadAllTrips().then(function(){var el=$('#mres');if(!el)return;var out='';TRIPS.forEach(function(x){var tr=TRIPCACHE[x.id];if(!tr)return;var its=(tr.items||[]).filter(function(it){return(it.people||[]).indexOf(pid)>=0});if(!its.length)return;out+='<div class="chap"><div class="eyebrow">'+esc(dateFmt(x.date))+'</div><h3><a href="#/trip/'+x.id+'">'+esc(L(x.title))+'</a></h3><p class="muted" style="font-size:12.5px">'+esc(t('itemsN',{n:its.length}))+'</p></div>'+gridHTML(its,'mp'+x.id)});el.innerHTML=out||'<p class="empty">'+esc(t('memNone'))+'</p>'});
    return;
  }
  h+='<div>'+TRIPS.map(tripCard).join('')+'</div><p class="muted" style="text-align:center;font-size:13px;margin-top:8px">'+esc(t('moreSoon'))+'</p>';
  setView(h+foot()+'</div>','memories');
}
function vTrip(id,pid,item){
  var s=TRIPS.filter(function(x){return x.id===id})[0];if(!s)return vMemories();
  setView('<div class="wrap"><p class="empty">…</p></div>','memories');
  loadTrip(id).then(function(tr){
    var items=tr.items||[],up=tr.status==='upcoming';
    var h='';
    if(tr.cover)h+='<img class="hero-img" style="aspect-ratio:16/10;max-height:46vh" src="'+esc(media(tr,/^images\/itinerary\//.test(tr.cover)?tr.cover.replace(/\.jpg$/,'-800.jpg'):tr.cover))+'" onerror="this.onerror=null;this.src=\''+esc(media(tr,tr.cover))+'\'" alt="">';
    h+='<div class="wrap"><a class="back" href="#/memories">'+ic('back')+esc(t('t_mem'))+'</a><div class="ph-head" style="padding-top:10px"><div class="eyebrow">'+esc(up?t('upcoming'):dateFmt(tr.date,{weekday:'long',day:'numeric',month:'long',year:'numeric'}))+'</div><h1 class="h1">'+esc(L(tr.title))+'</h1><p class="muted" style="margin-top:6px">'+esc(L(tr.place))+'</p>';
    if(L(tr.story))h+='<p style="margin-top:12px;color:var(--ink-2)">'+esc(L(tr.story))+'</p>';
    h+='</div>';
    if(up){h+='<div class="tile dark" style="margin-top:18px;min-height:0"><span class="eyebrow" style="color:#C9C3B6">'+esc(t('heliSub'))+'</span><div class="cd" data-cd="'+CONFIG.helicopter+'"></div></div><p class="empty">'+esc(t('tripSoon'))+'</p>'}
    var acts=[];if(tr.guide)acts.push('<a class="btn" href="'+esc(tr.guide)+'">'+esc(t('seeGuide'))+'</a>');if(tr.album&&ALB[tr.album])acts.push('<a class="btn" href="#/album/'+tr.album+'">'+ic('music')+esc(t('tripSongs'))+'</a>');
    if(acts.length)h+='<div class="actions" style="flex-wrap:wrap">'+acts.join('')+'</div>';
    if(items.length){
      var pp=M.people.filter(function(p){return items.some(function(it){return(it.people||[]).indexOf(p.id)>=0})});
      h+='<div class="chips" style="margin-top:14px"><button class="chip'+(!pid?' on':'')+'" data-go="#/trip/'+id+'">'+esc(t('everyone'))+'</button>'+pp.map(function(p){return'<button class="chip'+(pid===p.id?' on':'')+'" data-go="#/trip/'+id+'/p/'+p.id+'">'+esc(lang==='he'?p.he:p.en)+'</button>'}).join('')+'</div>';
      var its=pid?items.filter(function(it){return(it.people||[]).indexOf(pid)>=0}):items;
      var chs=(tr.chapters&&tr.chapters.length)?tr.chapters:[{id:null,title:null}];
      chs.forEach(function(c){var ci=c.id?its.filter(function(it){return it.chapter===c.id}):its;if(!ci.length)return;if(c.title)h+='<div class="chap"><h3>'+esc(L(c.title))+'</h3><p class="muted" style="font-size:12.5px">'+esc(t('itemsN',{n:ci.length}))+'</p></div>';else h+='<div style="height:16px"></div>';h+=gridHTML(ci,'tr-'+(c.id||'all'))});
      if(!its.length)h+='<p class="empty">'+esc(t('memNone'))+'</p>';
    }
    h+='<button class="note-cta" data-act="note" data-trip="'+id+'">'+ic('note')+'<span><b>'+esc(t('noteCta'))+'</b><small>'+esc(t('noteCtaSub'))+'</small></span></button>';
    h+=foot()+'</div>';
    setView(h,'memories');
    if(item){var ix=-1,gk=null;Object.keys(GRIDS).forEach(function(k){GRIDS[k].forEach(function(it,i){if(it.id===item&&ix<0){ix=i;gk=k}})});if(gk)openLB(gk,ix)}
  }).catch(function(){setView('<div class="wrap"><p class="empty">'+esc(t('memNone'))+'</p></div>','memories')});
}

/* ---------- lightbox ---------- */
var LB={g:null,i:0};
function openLB(g,i){LB.g=g;LB.i=i;$('#lb').hidden=false;document.body.style.overflow='hidden';renderLB()}
function closeLB(){var v=$('#lb video');if(v)v.pause();$('#lb').hidden=true;$('#lb').innerHTML='';document.body.style.overflow=''}
function renderLB(){
  var arr=GRIDS[LB.g]||[],it=arr[LB.i];if(!it)return closeLB();var tr=it._trip;
  var src=media(tr,it.src),st;
  if(it.type==='video')st='<video src="'+esc(src)+'" poster="'+esc(media(tr,it.poster||it.thumb||''))+'" controls playsinline autoplay preload="metadata"></video>';
  else st='<img src="'+esc(src)+'" alt="'+esc(L(it.caption))+'">';
  var ch=(tr.chapters||[]).filter(function(c){return c.id===it.chapter})[0];
  var h='<div class="lb-top"><button data-act="lbx" aria-label="Close">'+ic('close')+'</button><span style="font-size:12.5px;color:#A9A296">'+(LB.i+1)+' / '+arr.length+'</span><a class="btn" style="height:34px;padding:0 10px;font-size:12.5px;color:#F5F1EA;border-color:rgba(245,241,234,.3)" href="'+esc(src)+'" target="_blank" rel="noopener">'+esc(t('fullSize'))+'</a></div>';
  h+='<div class="lb-stage">'+st+(LB.i>0?'<button class="lb-nav p" data-act="lbp" aria-label="Previous">'+ic('back')+'</button>':'')+(LB.i<arr.length-1?'<button class="lb-nav n" data-act="lbn" aria-label="Next"><span style="display:inline-block;transform:scaleX(-1)">'+ic('back')+'</span></button>':'')+'</div>';
  h+='<div class="lb-cap">'+(L(it.caption)?'<p dir="auto">'+esc(L(it.caption))+'</p>':'')+'<small>'+esc([L(tr.title),ch?L(ch.title):''].filter(Boolean).join(' · '))+'</small>';
  if(it.people&&it.people.length)h+='<div class="tagp">'+it.people.map(function(p){return'<a href="#/memories/person/'+p+'">'+esc(pName(p))+'</a>'}).join('')+'</div>';
  h+='<div class="row2"><span></span><button class="btn" data-act="note" data-trip="'+tr.id+'" data-item="'+esc(it.id)+'">'+ic('note')+esc(t('addNote'))+'</button></div></div>';
  $('#lb').innerHTML=h;
  if(lang==='he')$$('#lb .lb-nav').forEach(function(b){b.querySelector('svg').style.transform=''});
}
function lbStep(d){var v=$('#lb video');if(v)v.pause();var n=LB.i+d,arr=GRIDS[LB.g]||[];if(n<0||n>=arr.length)return;LB.i=n;renderLB()}
(function(){var x0=null,y0=0;var el=$('#lb');el.addEventListener('touchstart',function(e){if(e.target.closest('video'))return;x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});el.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){var fwd=dx<0;if(lang==='he')fwd=!fwd;lbStep(fwd?1:-1)}else if(dy>90)closeLB()})})();

/* ---------- notes ---------- */
var NOTE={};
function openNote(trip,item){
  NOTE={trip:trip,item:item||null,who:[]};var tr=TRIPCACHE[trip]||TRIPS.filter(function(x){return x.id===trip})[0]||{};
  var it=item&&tr.items?tr.items.filter(function(x){return x.id===item})[0]:null;
  if(it)NOTE.who=(it.people||[]).slice();
  var th=it?media(tr,it.thumb||it.poster||it.src):'';
  var h='<div class="in"><div style="display:flex;gap:12px;align-items:center">'+(th?'<img src="'+esc(th)+'" alt="" style="width:56px;height:56px;object-fit:cover;border-radius:3px">':'')+'<div><div class="eyebrow">'+esc(t('noteFor'))+' '+esc(it?(it.type==='video'?t('video'):t('photo')):'')+'</div><h3>'+esc(L(tr.title))+'</h3></div></div><p>'+esc(t('noteSub'))+'</p>';
  h+='<label for="nn">'+esc(t('yourName'))+'</label><input id="nn" autocomplete="name" value="'+esc(LS.get('name',''))+'">';
  h+='<label>'+esc(t('whoIn'))+'</label><div class="who">'+M.people.map(function(p){return'<button class="chip'+(NOTE.who.indexOf(p.id)>=0?' on':'')+'" data-act="who" data-p="'+p.id+'">'+esc(lang==='he'?p.he:p.en)+'</button>'}).join('')+'</div>';
  h+='<label for="nt">'+esc(t('whatHappened'))+'</label><textarea id="nt" dir="auto"></textarea>';
  h+='<div class="acts"><button class="btn pri" data-act="send" data-via="wa">'+esc(t('sendWa'))+'</button><button class="btn" data-act="send" data-via="mail">'+esc(t('sendMail'))+'</button></div><div style="text-align:center;margin-top:10px"><button class="muted" data-act="notex" style="font-size:13.5px">'+esc(t('cancel'))+'</button></div></div>';
  var m=$('#note');m.innerHTML=h;m.hidden=false;
}
function noteText(){
  var tr=TRIPCACHE[NOTE.trip]||TRIPS.filter(function(x){return x.id===NOTE.trip})[0]||{};
  var link=CONFIG.site+'#/trip/'+NOTE.trip+(NOTE.item?'/i/'+NOTE.item:'');
  var who=NOTE.who.map(pName).join(', ');
  var name=$('#nn').value.trim();LS.set('name',name);
  var lines=[(lang==='he'?'הערה לזכרונות':'Memory note')+': '+L(tr.title)+(NOTE.item?' ('+NOTE.item+')':'')];
  if(who)lines.push(t('whoIn')+' '+who);
  var tx=$('#nt').value.trim();if(tx)lines.push(tx);
  if(name)lines.push('— '+name);
  lines.push(link);
  return{subject:(lang==='he'?'הערה: ':'Note: ')+L(tr.title)+(NOTE.item?' · '+NOTE.item:''),body:lines.join('\n')};
}

/* ---------- player ---------- */
var au=$('#au'),Q=[],QI=-1,SHUF=false;
function cur(){return QI>=0?SONG[Q[QI]]:null}
function playList(ids,i,shuffle){
  ids=ids.slice();if(shuffle){for(var k=ids.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1));var x=ids[k];ids[k]=ids[j];ids[j]=x}i=0}
  Q=ids;QI=i||0;load(true);
}
function load(autoplay){
  var s=cur();if(!s)return;au.src=s._src||s.src;au.load();if(autoplay){var p=au.play();if(p&&p.catch)p.catch(function(){})}
  recents=[s.id].concat(recents.filter(function(x){return x!==s.id})).slice(0,40);LS.set('recent',recents);
  if('mediaSession'in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:sTitle(s),artist:t('fam'),album:aName(s.album),artwork:s.cover?[{src:new URL(s.cover,location.href).href,sizes:'360x360',type:'image/jpeg'}]:[]})}catch(e){}}
  document.body.classList.add('has-mini');renderMini();markRows();if(!$('#np').hidden)renderNP();
}
function next(){if(QI<Q.length-1){QI++;load(true)}}
function prev(){if(au.currentTime>4){au.currentTime=0;return}if(QI>0){QI--;load(true)}}
au.addEventListener('ended',function(){var s=cur();if(s)delete s._src;if(QI<Q.length-1)next();else{renderMini();renderNP()}});
au.addEventListener('play',function(){renderMini();updNP()});au.addEventListener('pause',function(){renderMini();updNP()});
au.addEventListener('timeupdate',function(){var p=$('#mini .pg i');if(p&&au.duration)p.style.width=(au.currentTime/au.duration*100)+'%';updNP(true)});
if('mediaSession'in navigator){try{navigator.mediaSession.setActionHandler('nexttrack',next);navigator.mediaSession.setActionHandler('previoustrack',prev);navigator.mediaSession.setActionHandler('play',function(){au.play()});navigator.mediaSession.setActionHandler('pause',function(){au.pause()})}catch(e){}}
function markRows(){var s=cur();$$('.row[data-sid]').forEach(function(r){r.classList.toggle('playing',!!s&&r.getAttribute('data-sid')===s.id)})}
function renderMini(){
  var s=cur(),m=$('#mini');if(!s){m.hidden=true;return}m.hidden=false;
  m.innerHTML='<img src="'+esc(s.cover||'')+'" alt=""><div class="tx" data-act="np"><div class="tt" dir="auto">'+esc(sTitle(s))+'</div><div class="st">'+esc(aName(s.album))+'</div></div><div dir="ltr" style="display:flex"><button data-act="prev" aria-label="Previous">'+ic('prev')+'</button><button data-act="toggle" aria-label="Play">'+ic(au.paused?'play':'pause')+'</button><button data-act="next" aria-label="Next">'+ic('next')+'</button></div><div class="pg"><i></i></div>';
}
var NPTAB='lyrics';
function openNP(){$('#np').hidden=false;document.body.style.overflow='hidden';renderNP()}
function closeNP(){$('#np').hidden=true;document.body.style.overflow=''}
function lyricsHTML(s){
  if(!s.lyrics||!s.lyrics.length)return'<p class="empty">'+esc(t('noLyrics'))+'</p>';
  return s.lyrics.map(function(b){var ls=(lang==='he'&&b.lh&&b.lh.length)?b.lh:b.l;var hd=lang==='he'?(b.th||b.t):b.t;return'<div class="lyr-b">'+(hd?'<div class="lyr-t">'+esc(hd)+'</div>':'')+(ls||[]).map(function(x){return'<span class="lyr-l" dir="'+dirOf(x)+'">'+esc(x)+'</span>'}).join('')+'</div>'}).join('');
}
function renderNP(){
  var s=cur(),el=$('#np');if(!s||el.hidden)return;
  var tease=s.tease?L(s.tease):'';
  var h='<div class="np-top"><button data-act="npx" aria-label="Close">'+ic('down')+'</button><span class="eyebrow">'+esc(t('nowPlaying'))+'</span><button data-act="fav" data-id="'+s.id+'" class="'+(favs.indexOf(s.id)>=0?'on':'')+'" style="color:'+(favs.indexOf(s.id)>=0?'var(--accent)':'inherit')+'">'+ic(favs.indexOf(s.id)>=0?'heart-f':'heart')+'</button></div>';
  h+='<img class="np-art" src="'+esc(s.cover||'')+'" alt=""><div class="np-meta"><h2 dir="auto">'+esc(sTitle(s))+'</h2><p><a href="#/album/'+s.album+'" data-act="npx">'+esc(aName(s.album))+'</a>'+(s.people.length?' · '+s.people.map(pName).join(', '):'')+'</p>'+(tease?'<p style="color:var(--ink-2);font-size:14px;margin-top:10px">'+esc(tease)+'</p>':'')+'</div>';
  h+='<div class="np-bar"><input id="seek" type="range" min="0" max="1000" value="0" aria-label="Seek"><div class="np-time"><span id="tc">0:00</span><span id="td">'+fmt(s.dur)+'</span></div></div>';
  h+='<div class="np-ctl"><button data-act="shuf" class="'+(SHUF?'on':'')+'" aria-label="'+t('shuffle')+'">'+ic('shuffle')+'</button><button data-act="prev" aria-label="Previous">'+ic('prev')+'</button><button class="pl" data-act="toggle" aria-label="Play">'+ic(au.paused?'play':'pause')+'</button><button data-act="next" aria-label="Next">'+ic('next')+'</button><button data-act="nptab" data-tab="queue" aria-label="'+t('queue')+'">'+ic('list')+'</button></div>';
  h+='<div class="np-tabs"><button data-act="nptab" data-tab="lyrics" class="'+(NPTAB==='lyrics'?'on':'')+'">'+esc(t('lyrics'))+'</button><button data-act="nptab" data-tab="queue" class="'+(NPTAB==='queue'?'on':'')+'">'+esc(t('queue'))+'</button></div><div class="np-body">';
  if(NPTAB==='queue'){var up=Q.slice(QI+1).map(function(id){return SONG[id]}).filter(Boolean);LISTS.q=Q.slice();h+=up.length?'<ul class="songs">'+up.slice(0,50).map(function(x,k){return songRow(x,QI+1+k,'q')}).join('')+'</ul>':'<p class="empty">—</p>'}
  else{h+=lyricsHTML(s);if(s.versions&&s.versions.length)h+='<div class="lyr-t" style="margin-top:20px">'+esc(t('versions'))+'</div><div class="ver">'+s.versions.map(function(v,k){return'<button class="chip" data-act="ver" data-k="'+k+'">'+esc(t('take',{n:k+2}))+' · '+fmt(v.dur)+'</button>'}).join('')+'</div>'}
  el.innerHTML=h+'</div>';
  var sk=$('#seek');sk.addEventListener('input',function(){if(au.duration)au.currentTime=sk.value/1000*au.duration});updNP(true);
}
function updNP(timeOnly){var el=$('#np');if(el.hidden)return;var sk=$('#seek');if(sk&&au.duration&&document.activeElement!==sk)sk.value=au.currentTime/au.duration*1000;var tc=$('#tc');if(tc)tc.textContent=fmt(au.currentTime);var td=$('#td');if(td&&au.duration&&isFinite(au.duration))td.textContent=fmt(au.duration);if(!timeOnly){var b=$('#np .pl');if(b)b.innerHTML=ic(au.paused?'play':'pause')}}

/* ---------- events ---------- */
document.addEventListener('click',function(e){
  var g=e.target.closest('[data-go]');if(g){location.hash=g.getAttribute('data-go');return}
  var a=e.target.closest('[data-act]');if(!a)return;var act=a.getAttribute('data-act');
  if(act==='play'){var ids=LISTS[a.getAttribute('data-list')]||[];var i=+a.getAttribute('data-i');if(a.getAttribute('data-list')==='q'){QI=i;load(true)}else playList(ids,i,false);return}
  if(act==='playlist'){var l=LISTS[a.getAttribute('data-list')]||[];if(l.length){SHUF=a.getAttribute('data-shuffle')==='1';playList(l,0,SHUF);openNP()}return}
  if(act==='fav'){var row=a.closest('[data-sid]');var id=a.getAttribute('data-id')||(row&&row.getAttribute('data-sid'));if(!id)return;var k=favs.indexOf(id);if(k>=0)favs.splice(k,1);else favs.unshift(id);LS.set('favs',favs);var on=favs.indexOf(id)>=0;if(row){a.classList.toggle('fav',on);a.innerHTML=ic(on?'heart-f':'heart')}else renderNP();return}
  if(act==='toggle'){if(au.paused){var p=au.play();if(p&&p.catch)p.catch(function(){})}else au.pause();return}
  if(act==='next')return next();if(act==='prev')return prev();
  if(act==='np')return openNP();if(act==='npx')return closeNP();
  if(act==='shuf'){SHUF=!SHUF;var c=cur();if(c){var rest=Q.slice(QI+1);if(SHUF)for(var x=rest.length-1;x>0;x--){var j=Math.floor(Math.random()*(x+1));var tmp=rest[x];rest[x]=rest[j];rest[j]=tmp}Q=Q.slice(0,QI+1).concat(rest)}renderNP();return}
  if(act==='nptab'){NPTAB=a.getAttribute('data-tab');renderNP();return}
  if(act==='ver'){var s=cur();var v=s.versions[+a.getAttribute('data-k')];if(v){s._src=v.src;au.src=v.src;au.play()}return}
  if(act==='lb')return openLB(a.getAttribute('data-g'),+a.getAttribute('data-i'));
  if(act==='lbx')return closeLB();if(act==='lbn')return lbStep(1);if(act==='lbp')return lbStep(-1);
  if(act==='note')return openNote(a.getAttribute('data-trip'),a.getAttribute('data-item'));
  if(act==='notex'){$('#note').hidden=true;return}
  if(act==='who'){var pid=a.getAttribute('data-p'),w=NOTE.who.indexOf(pid);if(w>=0)NOTE.who.splice(w,1);else NOTE.who.push(pid);a.classList.toggle('on',w<0);return}
  if(act==='send'){var m=noteText();var url=a.getAttribute('data-via')==='wa'?'https://wa.me/'+CONFIG.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(m.body):'mailto:'+encodeURIComponent(CONFIG.notesEmail)+'?subject='+encodeURIComponent(m.subject)+'&body='+encodeURIComponent(m.body);window.open(url,'_blank');$('#note').hidden=true;return}
});
$('#note').addEventListener('click',function(e){if(e.target===this)this.hidden=true});
document.addEventListener('keydown',function(e){if(!$('#lb').hidden){if(e.key==='Escape')closeLB();if(e.key==='ArrowRight')lbStep(lang==='he'?-1:1);if(e.key==='ArrowLeft')lbStep(lang==='he'?1:-1)}else if(!$('#np').hidden&&e.key==='Escape')closeNP()});
window.addEventListener('scroll',function(){$('#bar').classList.toggle('scrolled',scrollY>4)},{passive:true});

/* ---------- router ---------- */
function route(){
  var p=decodeURIComponent(location.hash.replace(/^#\/?/,'')).split('/');
  if(!$('#lb').hidden)closeLB();if(!$('#np').hidden&&p[0]!=='')closeNP();
  switch(p[0]){
    case'music':return vMusic(p[1],p.slice(2).join('/')||null);
    case'album':return vAlbum(p[1]);
    case'person':return vPerson(p[1]);
    case'search':return vSearch(p.slice(1).join('/'));
    case'memories':return p[1]==='person'?vMemories('person',p[2]||M.people[0].id):vMemories();
    case'trip':return vTrip(p[1],p[2]==='p'?p[3]:null,p[2]==='i'?p[3]:null);
    default:return vHome();
  }
}
window.addEventListener('hashchange',route);
applyLang();
Promise.all([fetch('data/music.json?v='+VER).then(function(r){return r.json()}),fetch('data/trips.json?v='+VER).then(function(r){return r.json()})]).then(function(r){
  M=r[0];TRIPS=r[1].trips||[];
  M.songs.forEach(function(s){SONG[s.id]=s});M.albums.forEach(function(a){ALB[a.id]=a});M.people.forEach(function(p){PPL[p.id]=p});
  favs=favs.filter(function(id){return SONG[id]});
  route();
}).catch(function(e){V.innerHTML='<p class="empty">'+esc(String(e))+'</p>'});
})();
