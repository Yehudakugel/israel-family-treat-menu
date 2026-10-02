/* ---------- covers, rows ---------- */
function albumCover(a,big){
  var ss=M.songs.filter(function(s){return s.a===a.id&&s.c}).slice(0,3);
  return'<div class="acov k-'+a.id+(big?' big':'')+'"><div class="m">'+ss.map(function(s){return'<img loading="lazy" decoding="async" width="56" height="56" src="'+cov(s)+'" alt="">'}).join('')+'</div><div><small>'+esc(t('lbl'))+'</small><b>'+esc(lang==='he'?a.he:a.en)+'</b></div></div>';
}
function albumCard(a){return'<a class="acard" href="#/album/'+a.id+'">'+albumCover(a)+'<div class="t">'+esc(lang==='he'?a.he:a.en)+'</div><div class="s">'+esc(t('songsN',{n:a.n}))+'</div></a>'}
function personChip(p,on,href){return'<a class="pp'+(on?' on':'')+'" href="'+href+'"><img loading="lazy" decoding="async" width="64" height="64" src="'+avatar(p.id)+'" alt="">'+esc(lang==='he'?p.he:p.en)+'</a>'}
var LISTS={};
function songRow(s,i,key){
  var on=cur()&&cur().id===s.id,f=favs.indexOf(s.id)>=0;
  var sub=s.s?[aName(s.a),fmt(s.d)]:[aName(s.a),t('soon')];
  if(s.st&&s.st.length)sub.unshift('★ '+s.st.map(pName).join(', '));
  return'<li class="row'+(on?' playing':'')+(s.s?'':' nosrc')+'" data-sid="'+s.id+'"><button class="cvb" data-act="play" data-list="'+key+'" data-i="'+i+'" aria-label="'+esc(t('play'))+'"><img class="cv" loading="lazy" decoding="async" width="48" height="48" src="'+cov(s)+'" alt=""></button>'+
   '<a class="tx" href="#/song/'+s.id+'" data-act="play" data-list="'+key+'" data-i="'+i+'"><div class="tt" dir="auto">'+esc(sTitle(s))+'</div><div class="st">'+esc(sub.join(' · '))+'</div></a>'+
   '<button class="ic'+(f?' fav':'')+'" data-act="fav" aria-label="'+esc(t('favs'))+'">'+ic(f?'heart-f':'heart')+'</button></li>';
}
function songList(arr,key,limit){LISTS[key]=arr.map(function(s){return s.id});if(!arr.length)return'';var h='<ul class="songs" data-key="'+key+'">'+arr.slice(0,limit||9999).map(function(s,i){return songRow(s,i,key)}).join('')+'</ul>';if(limit&&arr.length>limit)h+='<button class="btn wide" data-act="more" data-key="'+key+'" data-from="'+limit+'">'+esc(t('more'))+'</button>';return h}
function moreRows(btn){var key=btn.getAttribute('data-key'),from=+btn.getAttribute('data-from'),ids=LISTS[key]||[],ul=$('ul[data-key="'+key+'"]');if(!ul)return;var to=Math.min(ids.length,from+60);ul.insertAdjacentHTML('beforeend',ids.slice(from,to).map(function(id,k){return songRow(SONG[id],from+k,key)}).join(''));if(to>=ids.length)btn.remove();else btn.setAttribute('data-from',to)}
function playBtns(key){return'<div class="actions"><button class="btn pri" data-act="playlist" data-list="'+key+'" data-shuffle="0">'+ic('play')+esc(t('play'))+'</button><button class="btn" data-act="playlist" data-list="'+key+'" data-shuffle="1">'+ic('shuffle')+esc(t('shuffle'))+'</button></div>'}
function vName(id){var v=(M.voices||[]).filter(function(x){return x.id===id})[0];return v?(lang==='he'?v.he:v.en):''}

/* ---------- views ---------- */
var V=$('#view');
var FIRSTV=1;function setView(html,tab){V.innerHTML='<div class="'+(FIRSTV?'':'fade')+'">'+html+'</div>';FIRSTV=0;$$('.tabs a').forEach(function(a){var on=a.getAttribute('data-tab')===tab;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});window.scrollTo(0,0);hydrate()}
function hydrate(){$$('[data-cd]').forEach(cdTick);centerOn()}
function centerOn(){$$('.pp.on').forEach(function(e){var r=e.parentNode;if(!r)return;var x=e.offsetLeft-r.clientWidth/2+e.offsetWidth/2;r.scrollLeft=lang==='he'?x-r.scrollWidth+r.clientWidth:x})}
function cdTick(el){var d=new Date(el.getAttribute('data-cd'))-new Date();if(d<0)d=0;var D=Math.floor(d/864e5),H=Math.floor(d/36e5)%24,Mi=Math.floor(d/6e4)%60;el.innerHTML='<span>'+D+'<i>'+t('days')+'</i></span><span>'+H+'<i>'+t('hrs')+'</i></span><span>'+Mi+'<i>'+t('min')+'</i></span>'}
setInterval(function(){$$('[data-cd]').forEach(cdTick)},30000);
function foot(){return'<footer class="foot"><img src="images/brand/monogram.svg" alt="" width="36" height="36">'+esc(t('fam'))+'</footer>'}
function head(eye,title,sub){return'<div class="ph-head"><div class="eyebrow">'+esc(eye)+'</div><h1 class="h1">'+esc(title)+'</h1>'+(sub?'<p class="muted lead">'+esc(sub)+'</p>':'')+'</div>'}

function vHome(){
  var past=TRIPS.filter(function(x){return x.status!=='upcoming'}),up=TRIPS.filter(function(x){return x.status==='upcoming'});
  var h='<section class="hero"><picture><source type="image/webp" srcset="images/hero/hero-480.webp 480w, images/hero/hero-800.webp 800w, images/hero/hero-1200.webp 1200w" sizes="100vw"><img class="hero-img" src="images/itinerary/hero-family-800.jpg" width="800" height="600" fetchpriority="high" alt=""></picture>'+
   '<div class="hero-body"><img class="crest" src="images/brand/monogram.svg" width="96" height="96" alt=""><div class="eyebrow">'+esc(t('fam'))+'</div><h1 class="h1">'+esc(t('welcome'))+'</h1><p>'+esc(t('heroP'))+'</p></div></section>';
  h+='<div class="wrap"><div class="sec"><div class="tiles">'+
   '<a class="tile" href="#/songs"><span class="eyebrow">'+esc(t('t_songs'))+'</span><span><b>'+esc(t('songsN',{n:M.songs.length}))+'</b><small>'+esc(t('albumsN',{n:M.albums.length}))+'</small></span></a>'+
   '<a class="tile" href="#/trips"><span class="eyebrow">'+esc(t('t_trips'))+'</span><span><b>'+esc(t('tripsN',{n:past.length}))+'</b><small>'+esc(t('itemsN',{n:past.reduce(function(a,x){return a+(x.count||0)},0)}))+'</small></span></a>';
  if(up[0])h+='<a class="tile dark" href="#/trip/'+up[0].id+'"><span class="eyebrow">'+esc(t('upcoming'))+'</span><span><b>'+esc(L(up[0].title))+'</b><span class="cd" data-cd="'+CONFIG.helicopter+'"></span></span></a>';
  h+='<a class="tile acc" href="#/fun"><span class="eyebrow">'+esc(t('t_fun'))+'</span><span><b>'+esc(t('quiz'))+'</b><small>'+esc(t('quizSub'))+'</small></span></a></div></div>';
  var rec=recents.map(function(id){return SONG[id]}).filter(Boolean).slice(0,4);
  if(rec.length)h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('recent'))+'</h2><a href="#/songs/songs/recent">'+esc(t('seeAll'))+'</a></div>'+songList(rec,'hrec')+'</div>';
  h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('fresh'))+'</h2><a href="#/album/thursday">'+esc(t('seeAll'))+'</a></div>'+songList(M.songs.filter(function(s){return s.a==='thursday'}).slice(0,5),'hthu')+'</div>';
  h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('starring'))+'</h2><a href="#/songs/artists">'+esc(t('seeAll'))+'</a></div><div class="rail ppl">'+M.people.map(function(p){return personChip(p,false,'#/person/'+p.id)}).join('')+'</div></div>';
  h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('albums'))+'</h2><a href="#/songs/albums">'+esc(t('seeAll'))+'</a></div><div class="rail">'+M.albums.map(albumCard).join('')+'</div></div>';
  if(past[0])h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('latest'))+'</h2><a href="#/trips">'+esc(t('seeAll'))+'</a></div>'+tripCard(past[0])+'</div>';
  setView(h+foot()+'</div>','home');
}

function vSongs(sub,filter){
  sub=sub||'songs';filter=filter||'all';
  var playable=M.songs.filter(function(s){return s.s}).length;
  var h='<div class="wrap">'+head(t('t_songs'),t('songsN',{n:M.songs.length}))+'<a class="sbox mini-s" href="#/search">'+ic('search')+'<span>'+esc(t('searchPh'))+'</span></a>';
  h+='<div class="seg">'+[['songs',t('songs')],['albums',t('albums')],['artists',lang==='he'?'אמנים':'Artists'],['types',lang==='he'?'סוגים':'Types']].map(function(k){return'<button class="'+(k[0]===sub?'on':'')+'" data-go="#/songs/'+k[0]+'">'+esc(k[1])+'</button>'}).join('')+'</div>';
  if(sub==='albums')h+='<div class="agrid">'+M.albums.map(albumCard).join('')+'</div>';
  else if(sub==='artists'){
    h+='<h2 class="h3">'+esc(lang==='he'?'הקולות':'Voices')+'</h2><div class="vgrid">'+(M.voices||[]).filter(function(v){return M.songs.some(function(s){return s.v===v.id})}).map(function(v){var n=M.songs.filter(function(s){return s.v===v.id}).length;return'<a class="vcard v-'+v.id+'" href="#/voice/'+v.id+'"><span class="vic">'+ic('mic')+'</span><b>'+esc(lang==='he'?v.he:v.en)+'</b><small>'+esc(t('songsN',{n:n}))+'</small></a>'}).join('')+'</div>';
    h+='<h2 class="h3">'+esc(t('starring'))+'</h2><ul class="songs">'+M.people.map(function(p){var n=M.songs.filter(function(s){return(s.st||[]).indexOf(p.id)>=0}).length,m=M.songs.filter(function(s){return s.p.indexOf(p.id)>=0}).length;return'<li class="row"><img class="cv round" loading="lazy" width="48" height="48" src="'+avatar(p.id)+'" alt=""><a class="tx" href="#/person/'+p.id+'"><div class="tt">'+esc(lang==='he'?p.he:p.en)+'</div><div class="st">★ '+n+' · '+esc(t('songsN',{n:m}))+'</div></a><span class="ic">'+ic('chev')+'</span></li>'}).join('')+'</ul>';
  }else if(sub==='types'){
    h+='<div class="vgrid">'+M.types.filter(function(x){return M.songs.some(function(s){return s.y===x.id})}).map(function(x){var n=M.songs.filter(function(s){return s.y===x.id}).length;return'<a class="vcard ty-'+x.id+'" href="#/songs/songs/type:'+x.id+'"><b>'+esc(lang==='he'?x.he:x.en)+'</b><small>'+esc(t('songsN',{n:n}))+'</small></a>'}).join('')+['he','yi','en'].map(function(l){var n=M.songs.filter(function(s){return s.g===l}).length;return'<a class="vcard lg" href="#/songs/songs/lang:'+l+'"><b>'+esc(t('lang_'+l))+'</b><small>'+esc(t('songsN',{n:n}))+'</small></a>'}).join('')+'</div>';
  }else{
    var chips=[['all',t('all')],['favs',t('favs')],['recent',t('recent')],['star',t('starring')],['sing',t('singAlong')]].concat(M.types.filter(function(x){return M.songs.some(function(s){return s.y===x.id})}).map(function(x){return['type:'+x.id,lang==='he'?x.he:x.en]})).concat(['he','yi','en'].map(function(l){return['lang:'+l,t('lang_'+l)]}));
    h+='<div class="chips">'+chips.map(function(c){return'<button class="chip'+(c[0]===filter?' on':'')+'" data-go="#/songs/songs/'+c[0]+'">'+(c[0]==='star'?'★ ':'')+esc(c[1])+'</button>'}).join('')+'</div>';
    var arr=M.songs.slice().sort(function(a,b){return(b.s?1:0)-(a.s?1:0)});
    if(filter==='favs')arr=favs.map(function(id){return SONG[id]}).filter(Boolean);
    else if(filter==='recent')arr=recents.map(function(id){return SONG[id]}).filter(Boolean);
    else if(filter==='star')arr=arr.filter(function(s){return s.st&&s.st.length});
    else if(filter==='sing')arr=arr.filter(function(s){return s.k});
    else if(filter.indexOf('type:')===0)arr=arr.filter(function(s){return s.y===filter.slice(5)});
    else if(filter.indexOf('lang:')===0)arr=arr.filter(function(s){return s.g===filter.slice(5)});
    else if(filter.indexOf('star:')===0)arr=arr.filter(function(s){return(s.st||[]).indexOf(filter.slice(5))>=0});
    h+=playBtns('mus').replace('</div>','<span class="count">'+esc(t('songsN',{n:arr.length}))+'</span></div>');
    h+=arr.length?songList(arr,'mus',60):'<p class="empty">'+esc(filter==='favs'?t('favsEmpty'):t('recentEmpty'))+'</p>';
  }
  setView(h+'</div>','songs');
}
function vVoice(id){
  var arr=M.songs.filter(function(s){return s.v===id}).sort(function(a,b){return(b.s?1:0)-(a.s?1:0)});
  setView('<div class="wrap"><a class="back" href="#/songs/artists">'+ic('back')+esc(lang==='he'?'אמנים':'Artists')+'</a>'+head(lang==='he'?'קול':'Voice',vName(id),t('songsN',{n:arr.length}))+playBtns('voi')+songList(arr,'voi',60)+foot()+'</div>','songs');
}
function vAlbum(id){
  var a=ALB[id];if(!a)return vSongs('albums');
  var arr=M.songs.filter(function(s){return s.a===id});
  var mins=Math.round(arr.reduce(function(x,s){return x+(s.d||0)},0)/60),trip=TRIPS.filter(function(x){return x.album===id})[0];
  var h='<div class="wrap"><a class="back" href="#/songs/albums">'+ic('back')+esc(t('albums'))+'</a><div class="ahead">'+albumCover(a,1)+'<div><div class="eyebrow">'+esc(t('album'))+'</div><h1>'+esc(lang==='he'?a.he:a.en)+'</h1><p class="muted sm">'+esc(lang==='he'?a.sub_he:a.sub_en)+'</p><p class="muted xs">'+esc(t('songsN',{n:arr.length}))+' · '+mins+' '+esc(t('min'))+'</p></div></div>';
  h+=playBtns('alb').replace('</div>',(trip?'<a class="btn" href="#/trip/'+trip.id+'">'+ic('photo')+esc(t('t_trips'))+'</a>':'')+'</div>');
  setView(h+songList(arr,'alb')+foot()+'</div>','songs');
}
function vPerson(id){
  var p=PPL[id];if(!p)return vHome();var nm=lang==='he'?p.he:p.en;
  var st=M.songs.filter(function(s){return(s.st||[]).indexOf(id)>=0}),also=M.songs.filter(function(s){return s.p.indexOf(id)>=0&&(s.st||[]).indexOf(id)<0});
  var h='<div class="wrap"><a class="back" href="#/songs/artists">'+ic('back')+esc(t('people'))+'</a><div class="person-hero"><img src="'+avatar(id)+'" width="120" height="120" alt=""><h1 class="h1">'+esc(nm)+'</h1><p class="muted sm">★ '+st.length+' · '+esc(t('songsN',{n:st.length+also.length}))+'</p></div>';
  h+='<div class="rail ppl">'+M.people.map(function(q){return personChip(q,q.id===id,'#/person/'+q.id)}).join('')+'</div>';
  if(st.length)h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('starName',{p:nm}))+'</h2></div>'+playBtns('pst')+songList(st,'pst')+'</div>';
  if(also.length)h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('alsoIn'))+'</h2><span class="count">'+also.length+'</span></div>'+songList(also,'pal',10)+'</div>';
  h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('inMem',{p:nm}))+'</h2><a href="#/memories/person/'+id+'">'+esc(t('seeAll'))+'</a></div><div id="pmem"><p class="empty">…</p></div></div>'+foot()+'</div>';
  setView(h,'songs');
  loadAllTrips().then(function(){var items=allItems().filter(function(it){return(it.people||[]).indexOf(id)>=0});var el=$('#pmem');if(el)el.innerHTML=items.length?gridHTML(items.slice(0,12),'pm'):'<p class="empty">'+esc(t('memNone'))+'</p>'});
}
function vSong(id){
  var s=SONG[id];if(!s)return vSongs();
  var h='<div class="wrap"><a class="back" href="#/album/'+s.a+'">'+ic('back')+esc(aName(s.a))+'</a><div class="song-hero"><img class="sh-art" src="'+cov(s,1)+'" width="300" height="300" alt=""><h1 class="h2" dir="auto">'+esc(sTitle(s))+'</h1><p class="muted sm"><a href="#/album/'+s.a+'">'+esc(aName(s.a))+'</a> · <a href="#/voice/'+s.v+'">'+esc(vName(s.v))+'</a> · '+fmt(s.d)+'</p>'+(s.x?'<p class="tease">'+esc(L(s.x))+'</p>':'')+'</div>';
  LISTS.one=[id];
  h+='<div class="actions center">'+(s.s?'<button class="btn pri" data-act="play" data-list="one" data-i="0">'+ic('play')+esc(t('play'))+'</button>':'<span class="muted">'+esc(t('soon'))+'</span>')+'<button class="btn" data-act="kar" data-id="'+id+'">'+ic('mic')+esc(t('sing'))+'</button><button class="btn icon'+(favs.indexOf(id)>=0?' fav':'')+'" data-act="fav" data-id="'+id+'" aria-label="'+esc(t('favs'))+'">'+ic(favs.indexOf(id)>=0?'heart-f':'heart')+'</button></div>';
  if(s.st&&s.st.length)h+='<div class="sec"><div class="eyebrow">'+esc(t('starring'))+'</div><div class="rail ppl">'+s.st.map(function(p){return personChip(PPL[p],false,'#/person/'+p)}).join('')+'</div></div>';
  h+='<div class="sec"><h2 class="h3">'+esc(t('lyrics'))+'</h2><div id="slyr" class="lyr"><p class="empty">…</p></div></div>'+foot()+'</div>';
  setView(h,'songs');
  needLyrics().then(function(){var el=$('#slyr');if(el)el.innerHTML=lyricsHTML(s)});
}
function lyricsHTML(s){
  var b=LYR&&LYR[s.id];if(!b||!b.length)return'<p class="empty">'+esc(t('noLyrics'))+'</p>';
  return b.map(function(x){var ls=(lang==='he'&&x.lh&&x.lh.length)?x.lh:x.l,hd=lang==='he'?(x.th||x.t):x.t;return'<div class="lyr-b">'+(hd?'<div class="lyr-t">'+esc(hd)+'</div>':'')+(ls||[]).map(function(l){return'<span class="lyr-l" dir="'+dirOf(l)+'">'+esc(l)+'</span>'}).join('')+'</div>'}).join('');
}
