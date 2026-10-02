/* ---------- search ---------- */
var IDX=null,MIDX=null;
var CHRX=/chorus|refrain|פזמון|רעפֿריין|רעפריין/i;
function buildIdx(){
  IDX=SR.build(M.songs.map(function(s){var f=[[s.t,10],[s.th||'',10],[s.te||'',10],[aName(s.a),3]];(LYR[s.id]||[]).forEach(function(b){var w=CHRX.test((b.t||'')+' '+(b.th||''))?4:1;f.push([(b.l||[]).join(' ')+' '+(b.lh||[]).join(' '),w])});return{id:s.id,people:s.p.concat(s.st||[]),fields:f}}));
}
function buildMIdx(){var its=allItems();MIDX=SR.build(its.map(function(it){var c=it.caption||{};return{id:it.id,it:it,people:it.people||[],fields:[[(c.en||'')+' '+(c.he||''),3],[L(it._trip.title)+' '+(it._trip.title.en||'')+' '+(it._trip.title.he||''),2]]}}))}
function vSearch(q){
  q=q||'';
  setView('<div class="wrap">'+head(t('t_search'),'')+'<label class="sbox">'+ic('search')+'<input id="sq" type="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="'+esc(t('searchPh'))+'" value="'+esc(q)+'"></label><div id="sres"></div></div>','');
  var inp=$('#sq'),tm;inp.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){history.replaceState(null,'','#/search/'+encodeURIComponent(inp.value));doSearch(inp.value)},120)});
  doSearch(q);if(!q)setTimeout(function(){try{inp.focus({preventScroll:true})}catch(e){}},60);
}
function doSearch(q){
  var el=$('#sres');if(!el)return;var n=SR.norm(q);
  if(!n){el.innerHTML='<p class="muted hint">'+esc(t('searchHint'))+'</p><div class="rail ppl">'+M.people.map(function(p){return personChip(p,false,'#/person/'+p.id)}).join('')+'</div>';return}
  el.innerHTML='<p class="empty">…</p>';
  needLyrics().then(function(){
    if(SR.norm($('#sq').value)!==n)return;if(!IDX)buildIdx();
    var res=SR.search(IDX,q).map(function(r){return SONG[r.d.id]});
    var ws=n.split(' '),pp=[];ws.forEach(function(w){var p=SR.personOf(w);if(p&&pp.indexOf(p)<0)pp.push(p)});
    var albs=M.albums.filter(function(a){var x=SR.norm(a.en+' '+a.he);return ws.every(function(w){return x.indexOf(w)>=0})});
    var h='';
    if(pp.length)h+='<div class="sec sm"><div class="rail ppl">'+pp.map(function(p){return personChip(PPL[p],false,'#/person/'+p)}).join('')+'</div></div>';
    if(albs.length)h+='<div class="sec sm"><div class="rail">'+albs.map(albumCard).join('')+'</div></div>';
    if(res.length)h+='<div class="sec sm"><div class="sec-h"><h2 class="h2">'+esc(t('songs'))+'</h2><span class="count">'+res.length+'</span></div>'+songList(res,'srch',40)+'</div>';
    el.innerHTML=(h||'<p class="empty">'+esc(t('noRes'))+'</p>')+'<div id="smem"></div>';
    loadAllTrips().then(function(){var m=$('#smem');if(!m||SR.norm($('#sq').value)!==n)return;if(!MIDX)buildMIdx();var items=SR.search(MIDX,q).filter(function(r){return r.s>=1}).map(function(r){return r.d.it});if(items.length){m.innerHTML='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('t_mem'))+'</h2><span class="count">'+items.length+'</span></div>'+gridHTML(items.slice(0,24),'sm')+'</div>';var e=$('#sres > .empty');if(e)e.remove()}});
  });
}

/* ---------- trips & memories ---------- */
function loadTrip(id){if(TRIPCACHE[id])return Promise.resolve(TRIPCACHE[id]);var s=TRIPS.filter(function(x){return x.id===id})[0];if(!s)return Promise.reject();return getJSON(s.file).then(function(tr){(tr.items||[]).forEach(function(it){it._trip=tr});TRIPCACHE[id]=tr;return tr})}
var allP=null;function loadAllTrips(){if(!allP)allP=Promise.all(TRIPS.filter(function(x){return x.count>0}).map(function(x){return loadTrip(x.id).catch(function(){})}));return allP}
/* solemn trips (e.g. the shloshim seuda) are never mixed into All, person views or search */
function allItems(withSolemn){var a=[];TRIPS.forEach(function(x){var tr=TRIPCACHE[x.id];if(tr&&(withSolemn||!(x.solemn||tr.solemn)))a=a.concat(tr.items||[])});return a}
function coverSrc(x){var c=x.cover;if(!c)return'';if(c==='images/itinerary/hero-family.jpg')return'images/hero/hero-800.webp';return c}
function tripCard(x){
  var up=x.status==='upcoming',meta=up?L(x.place):[dateFmt(x.date),L(x.place)].filter(Boolean).join(' · ');
  var cnt=up?'':[x.photos?t('photosN',{n:x.photos}):'',x.videos?t('videosN',{n:x.videos}):''].filter(Boolean).join(' · ');
  var h='<a class="tcard'+(up?' up':'')+'" href="#/trip/'+x.id+'">';
  if(x.cover)h+='<img class="ti" loading="lazy" decoding="async" width="800" height="500" src="'+esc(coverSrc(x))+'" alt="">';
  h+='<div class="tb">'+(up?'<div class="eyebrow">'+esc(t('upcoming'))+'</div>':'')+'<h3>'+esc(L(x.title))+'</h3><div class="meta">'+esc(meta)+'</div>';
  if(up)h+='<div class="cd" data-cd="'+CONFIG.helicopter+'"></div>';if(cnt)h+='<div class="meta">'+esc(cnt)+'</div>';
  if(x.people&&x.people.length)h+='<div class="av">'+x.people.map(function(p){return'<img loading="lazy" width="26" height="26" src="'+avatar(p)+'" alt="'+esc(pName(p))+'">'}).join('')+'</div>';
  return h+'</div></a>';
}
var GRIDS={};
function gi(it,key,i){var tr=it._trip,th=media(tr,it.thumb||it.poster||it.src),r=it.w&&it.h?' width="'+it.w+'" height="'+it.h+'"':'';var vt=it.type==='video'&&!it.thumb&&!it.poster;return'<button class="gi" data-act="lb" data-g="'+key+'" data-i="'+i+'">'+(vt?'<span class="gv gph" style="aspect-ratio:'+(it.w&&it.h?it.w+'/'+it.h:'9/16')+'">'+ic('play')+'</span>':'<img loading="lazy" decoding="async" src="'+esc(th)+'"'+r+' alt="'+esc(L(it.caption))+'">')+(it.type==='video'?'<span class="vd">'+ic('play')+(it.duration?fmt(it.duration):'')+'</span>':'')+'</button>'}
function gridHTML(items,key,page){GRIDS[key]=items;var n=page||items.length;var h='<div class="grid" data-key="'+key+'">'+items.slice(0,n).map(function(it,i){return gi(it,key,i)}).join('')+'</div>';if(items.length>n)h+='<div class="sentinel" data-key="'+key+'" data-from="'+n+'"></div>';return h}
var io=('IntersectionObserver'in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var s=e.target,key=s.getAttribute('data-key'),from=+s.getAttribute('data-from'),items=GRIDS[key]||[],g=$('.grid[data-key="'+key+'"]');if(!g)return;var to=Math.min(items.length,from+60);g.insertAdjacentHTML('beforeend',items.slice(from,to).map(function(it,k){return gi(it,key,from+k)}).join(''));if(to>=items.length){io.unobserve(s);s.remove()}else s.setAttribute('data-from',to)})},{rootMargin:'800px'}):null;
function watchSentinels(){if(io)$$('.sentinel').forEach(function(s){io.observe(s)})}

function autoCh(items){
  /* no chapters given: build a timeline from the photo dates (by day, or by part of the day) */
  var d=items.filter(function(it){return it.date}).map(function(it){return it.date});if(d.length<items.length*.6)return null;
  var days={};items.forEach(function(it){var k=(it.date||'').slice(0,10);(days[k]=days[k]||[]).push(it)});var dk=Object.keys(days).filter(Boolean).sort();
  var out=[];
  if(dk.length>1){dk.forEach(function(k,i){var id='d'+i;days[k].forEach(function(it){it.chapter=id});out.push({id:id,title:{en:dateFmt(k,{weekday:'long',day:'numeric',month:'long'}),he:null},auto:k})})}
  else{var parts=[['morning',0,12],['afternoon',12,17],['evening',17,24]];parts.forEach(function(p){var n=0;items.forEach(function(it){var h=+((it.date||'').slice(11,13));if(h>=p[1]&&h<p[2]){it.chapter=p[0];n++}});if(n)out.push({id:p[0],title:{en:t(p[0]),he:t(p[0])}})})}
  items.forEach(function(it){if(!it.chapter&&out[0])it.chapter=out[0].id});
  if(out.length<2){items.forEach(function(it){delete it.chapter});return null}
  out.forEach(function(c){if(!c.title.he)c.title.he=c.title.en;var ci=items.filter(function(it){return it.chapter===c.id&&it.date}).map(function(it){return it.date.slice(11,16)}).sort();if(ci.length)c.when=ci[0]+(ci.length>1&&ci[ci.length-1]!==ci[0]?'–'+ci[ci.length-1]:'')});
  return out;
}
function byCat(list){
  /* group trips by category, newest category first */
  var g={},o=[];list.forEach(function(x){var c=x.category||{id:'other',en:'Other',he:'עוד'};if(!g[c.id]){g[c.id]={c:c,items:[]};o.push(g[c.id])}g[c.id].items.push(x)});
  o.forEach(function(k){k.last=k.items.reduce(function(m,x){return x.date>m?x.date:m},'')});o.sort(function(a,b){return a.last<b.last?1:a.last>b.last?-1:0});return o;
}
function catNav(gs,pre){return gs.length>1?'<div class="chips catnav">'+gs.map(function(k){return'<button class="chip" data-act="jump" data-to="'+pre+k.c.id+'">'+esc(L(k.c))+' <span class="cn">'+k.items.length+'</span></button>'}).join('')+'</div>':''}
function vTrips(){
  var up=TRIPS.filter(function(x){return x.status==='upcoming'}),past=TRIPS.filter(function(x){return x.status!=='upcoming'&&!x.newf}),gs=byCat(past);
  var h='<div class="wrap">'+head(t('t_trips'),t('t_trips'),t('tripsIntro'))+catNav(gs,'tc-')+(up.length?'<div class="tlist">'+up.map(tripCard).join('')+'</div>':'');
  gs.forEach(function(k){h+='<section class="catsec" id="tc-'+k.c.id+'"><div class="sec-h"><h2 class="h2">'+esc(L(k.c))+'</h2><span class="count">'+k.items.length+'</span></div><div class="tlist">'+k.items.map(tripCard).join('')+'</div></section>'});
  h+=foot()+'</div>';
  setView(h,'trips');
}
function vTrip(id,pid,item){
  var s=TRIPS.filter(function(x){return x.id===id})[0];if(!s)return vTrips();
  setView('<div class="wrap"><p class="empty">…</p></div>','trips');
  loadTrip(id).then(function(tr){
    var items=tr.items||[],up=tr.status==='upcoming',h='';
    if(tr.cover)h+='<img class="hero-img trip" src="'+esc(media(tr,coverSrc(tr)))+'" width="800" height="500" alt="">';
    h+='<div class="wrap"><a class="back" href="#/trips">'+ic('back')+esc(t('allTrips'))+'</a><div class="ph-head"><div class="eyebrow">'+esc(up?t('upcoming'):dateFmt(tr.date,{weekday:'long',day:'numeric',month:'long',year:'numeric'}))+'</div><h1 class="h1">'+esc(L(tr.title))+'</h1><p class="muted lead">'+esc(L(tr.place))+'</p>'+(L(tr.story)?'<p class="story">'+esc(L(tr.story))+'</p>':'')+'</div>';
    if(up)h+='<div class="tile dark flat"><span class="eyebrow">'+esc(t('heliSub'))+'</span><div class="cd" data-cd="'+CONFIG.helicopter+'"></div></div><p class="empty">'+esc(t('tripSoon'))+'</p>';
    var acts=[];if(tr.guide)acts.push('<a class="btn" href="'+esc(tr.guide)+'">'+ic('map')+esc(t('seeGuide'))+'</a>');
    if(acts.length)h+='<div class="actions wrapf">'+acts.join('')+'</div>';
    /* timeline */
    var chs=(tr.chapters&&tr.chapters.length)?tr.chapters:autoCh(items);
    if(chs&&items.length)h+='<ol class="tline">'+chs.map(function(c){var n=items.filter(function(it){return it.chapter===c.id}).length;return'<li><a href="#ch-'+c.id+'" data-act="jump" data-to="ch-'+c.id+'"><b>'+esc(L(c.title))+'</b><small>'+esc((c.when?c.when+' · ':'')+t('itemsN',{n:n}))+'</small></a></li>'}).join('')+'</ol>';
    if(tr.album&&ALB[tr.album]){var ss=M.songs.filter(function(x){return x.a===tr.album});h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('tripSongs'))+'</h2><a href="#/album/'+tr.album+'">'+esc(t('seeAll'))+'</a></div>'+songList(ss,'trs',4)+'</div>'}
    if(items.length){
      var pp=M.people.filter(function(p){return items.some(function(it){return(it.people||[]).indexOf(p.id)>=0})});
      h+='<div class="sec"><div class="sec-h"><h2 class="h2">'+esc(t('t_mem'))+'</h2><span class="count">'+items.length+'</span></div>';
      if(pp.length)h+='<div class="chips"><button class="chip'+(!pid?' on':'')+'" data-go="#/trip/'+id+'">'+esc(t('everyone'))+'</button>'+pp.map(function(p){return'<button class="chip'+(pid===p.id?' on':'')+'" data-go="#/trip/'+id+'/p/'+p.id+'">'+esc(lang==='he'?p.he:p.en)+'</button>'}).join('')+'</div>';
      var its=pid?items.filter(function(it){return(it.people||[]).indexOf(pid)>=0}):items;
      (chs||[{id:null}]).forEach(function(c){var ci=c.id?its.filter(function(it){return it.chapter===c.id}):its;if(!ci.length)return;if(c.title)h+='<div class="chap" id="ch-'+c.id+'"><h3>'+esc(L(c.title))+'</h3></div>';h+=gridHTML(ci,'tr-'+(c.id||'all'),60)});
      if(!its.length)h+='<p class="empty">'+esc(t('memNone'))+'</p>';h+='</div>';
    }
    if(!tr.solemn)h+='<button class="note-cta" data-act="note" data-trip="'+id+'">'+ic('note')+'<span><b>'+esc(t('noteCta'))+'</b><small>'+esc(t('noteCtaSub'))+'</small></span></button>';h+=foot()+'</div>';
    setView(h,'trips');watchSentinels();
    if(item){Object.keys(GRIDS).some(function(k){var i=GRIDS[k].findIndex(function(it){return it.id===item});if(i>=0){openLB(k,i);return true}})}
  }).catch(function(){setView('<div class="wrap"><p class="empty">'+esc(t('memNone'))+'</p></div>','trips')});
}
function vMemories(mode,arg){
  /* Google-Photos-like: folders by trip / by person, a grid, an upload button */
  var h='<div class="wrap">'+head(t('t_mem'),t('t_mem'),t('memIntro'));
  h+='<div class="memtop"><div class="seg">'+[['all',lang==='he'?'הכל':'All'],['trips',lang==='he'?'תיקיות טיולים':'Trip folders'],['person',t('people')]].map(function(k){return'<button class="'+((mode||'all')===k[0]?'on':'')+'" data-go="#/memories/'+(k[0]==='person'?'person/'+(arg||M.people[0].id):k[0])+'">'+esc(k[1])+'</button>'}).join('')+'</div><button class="btn sm upl" data-act="upload">'+ic('plus')+esc(lang==='he'?'העלאה':'Upload')+'</button></div>';
  if(mode==='trips'){
    var fg=byCat(TRIPS.filter(function(x){return x.count>0}));h+=catNav(fg,'mc-');
    fg.forEach(function(k){h+='<section class="catsec" id="mc-'+k.c.id+'"><h3 class="h3">'+esc(L(k.c))+'</h3><div class="folders">'+k.items.map(function(x){return'<a class="folder" href="#/memories/trip/'+x.id+'"><img loading="lazy" decoding="async" width="300" height="300" src="'+esc(coverSrc(x))+'" alt=""><b>'+esc(L(x.title))+'</b><small>'+esc(t('itemsN',{n:x.count}))+'</small></a>'}).join('')+'</div></section>'});
    return setView(h+foot()+'</div>','memories');
  }
  if(mode==='person')h+='<div class="rail ppl">'+M.people.map(function(p){return personChip(p,p.id===arg,'#/memories/person/'+p.id)}).join('')+'</div>';
  if(mode==='trip'){var x=TRIPS.filter(function(z){return z.id===arg})[0];h+='<a class="back" href="#/memories/trips">'+ic('back')+esc(lang==='he'?'תיקיות':'Folders')+'</a><h2 class="h2">'+esc(x?L(x.title):'')+'</h2>'+(x&&x.newf?'<p class="muted sm">'+esc(L(x.place))+'</p>':'<p><a class="link" href="#/trip/'+arg+'">'+esc(lang==='he'?'לעמוד הטיול':'Open the trip page')+'</a></p>')}
  h+='<div id="mres"><p class="empty">…</p></div>'+foot()+'</div>';
  setView(h,'memories');
  loadAllTrips().then(function(){var el=$('#mres');if(!el)return;var its=allItems(mode==='trip');
    if(mode==='person')its=its.filter(function(it){return(it.people||[]).indexOf(arg)>=0});
    if(mode==='trip')its=its.filter(function(it){return it._trip.id===arg});
    its.sort(function(a,b){return String(b.date||b._trip.date).localeCompare(String(a.date||a._trip.date))});
    el.innerHTML=its.length?gridHTML(its,'mem-'+(mode||'all'),60):'<p class="empty">'+esc(t('memNone'))+'</p>';watchSentinels()});
}
