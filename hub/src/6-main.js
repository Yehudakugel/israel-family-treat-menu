/* ---------- i18n chrome ---------- */
function applyLang(){var h=document.documentElement;h.lang=lang;h.dir=lang==='he'?'rtl':'ltr';$$('[data-t]').forEach(function(e){e.textContent=t(e.getAttribute('data-t'))});$$('[data-lang]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-lang')===lang)});document.title=t('fam')}
/* ---------- events ---------- */
document.addEventListener('click',function(e){
  var lb=e.target.closest('[data-lang]');if(lb){lang=lb.getAttribute('data-lang');LS.set('lang',lang);IDX=null;applyLang();route();renderMini();if(!$('#np').hidden)renderNP();if(!$('#kar').hidden)renderKar();return}
  var g=e.target.closest('[data-go]');if(g){location.hash=g.getAttribute('data-go');return}
  var a=e.target.closest('[data-act]');if(!a)return;var act=a.getAttribute('data-act');
  if(act==='play'){var key=a.getAttribute('data-list'),ids=LISTS[key]||[],i=+a.getAttribute('data-i'),s=SONG[ids[i]];if(!s)return;
    if(key==='q'){e.preventDefault();QI=i;load(true);return}
    if(s.s&&!(cur()&&cur().id===s.id&&!au.paused))playList(ids,i,false);
    if(a.tagName!=='A')e.preventDefault();return}
  if(act==='playlist'){var l=LISTS[a.getAttribute('data-list')]||[];SHUF=a.getAttribute('data-shuffle')==='1';if(playList(l,0,SHUF))openNP();return}
  if(act==='fav'){e.preventDefault();var row=a.closest('[data-sid]'),id=a.getAttribute('data-id')||(row&&row.getAttribute('data-sid'));if(!id)return;var k=favs.indexOf(id);if(k>=0)favs.splice(k,1);else favs.unshift(id);LS.set('favs',favs);var on=favs.indexOf(id)>=0;a.classList.toggle('fav',on);a.innerHTML=ic(on?'heart-f':'heart');return}
  if(act==='toggle'){if(!cur())return;if(au.paused){var p=au.play();if(p&&p.catch)p.catch(function(){})}else au.pause();var kp=$('#kar .k-pl');if(kp)setTimeout(function(){kp.innerHTML=ic(au.paused?'play':'pause')},50);return}
  if(act==='next')return next();if(act==='prev')return prev();
  if(act==='np')return openNP();if(act==='npx')return closeNP();
  if(act==='kar'){closeNP();openKar(a.getAttribute('data-id'));badge('singer');return}if(act==='karx')return closeKar();
  if(act==='shuf'){SHUF=!SHUF;var rest=Q.slice(QI+1);if(SHUF)for(var x=rest.length-1;x>0;x--){var j=Math.floor(Math.random()*(x+1)),tmp=rest[x];rest[x]=rest[j];rest[j]=tmp}Q=Q.slice(0,QI+1).concat(rest);renderNP();return}
  if(act==='nptab'){NPTAB=a.getAttribute('data-tab');renderNP();return}
  if(act==='more')return moreRows(a);
  if(act==='lb')return openLB(a.getAttribute('data-g'),+a.getAttribute('data-i'));
  if(act==='lbx')return closeLB();if(act==='lbn')return lbStep(1);if(act==='lbp')return lbStep(-1);
  if(act==='jump'){e.preventDefault();var el=document.getElementById(a.getAttribute('data-to'));if(el)window.scrollTo({top:el.getBoundingClientRect().top+scrollY-70,behavior:'smooth'});return}
  if(act==='note')return openNote(a.getAttribute('data-trip'),a.getAttribute('data-item'));
  if(act==='upload')return openUpload();
  if(act==='csend')return sendSongReq();
  if(act==='nsend')return sendNote();
  if(act==='notex'){$('#note').hidden=true;return}
  if(act==='who'){var pid=a.getAttribute('data-p'),w=NOTE.who.indexOf(pid);if(w>=0)NOTE.who.splice(w,1);else NOTE.who.push(pid);a.classList.toggle('on',w<0);return}
  if(act==='prof'){PROF=a.getAttribute('data-p');LS.set('prof',PROF);me();save();location.hash=a.getAttribute('data-back')||'#/fun';route();return}
  if(act==='qans')return quizAnswer(+a.getAttribute('data-o'));
  if(act==='qnext'){QZ.i++;QZ.ans=null;renderQuiz();return}
  if(act==='quizagain')return startQuiz(QZ.back);
  if(act==='chart')return vCharts('<a class="back" href="#/fun">'+ic('back')+esc(t('t_fun'))+'</a>',a.getAttribute('data-p')||null);
  if(act==='vote')return vote(a.getAttribute('data-id'));
  if(act==='csw'){var q=a.getAttribute('data-p'),z=CS.who.indexOf(q);if(z>=0)CS.who.splice(z,1);else CS.who.push(q);a.classList.toggle('on',z<0);return}
  if(act==='cs'){var kk=a.getAttribute('data-k');CS[kk]=a.getAttribute('data-v');$$('[data-k="'+kk+'"]').forEach(function(b){b.classList.toggle('on',b===a)});return}
});
$('#note').addEventListener('click',function(e){if(e.target===this)this.hidden=true});
document.addEventListener('keydown',function(e){if(!$('#lb').hidden){if(e.key==='Escape')closeLB();if(e.key==='ArrowRight')lbStep(lang==='he'?-1:1);if(e.key==='ArrowLeft')lbStep(lang==='he'?1:-1)}else if(e.key==='Escape'){if(!$('#kar').hidden)closeKar();else if(!$('#np').hidden)closeNP()}});
var bar=$('#bar');window.addEventListener('scroll',function(){bar.classList.toggle('scrolled',scrollY>4)},{passive:true});
/* ---------- router ---------- */
var tripsSeen=LS.get('tseen',[]);
function route(){
  var p=decodeURIComponent(location.hash.replace(/^#\/?/,'')).split('/');
  if(!$('#lb').hidden)closeLB();if(!$('#note').hidden)$('#note').hidden=true;if(!$('#np').hidden&&p[0]!=='')closeNP();if(!$('#kar').hidden)closeKar();
  switch(p[0]){
    case'songs':return vSongs(p[1],p.slice(2).join('/')||null);
    case'music':return vSongs(p[1]==='people'?'artists':p[1],p.slice(2).join('/')||null);
    case'album':return vAlbum(p[1]);
    case'person':return vPerson(p[1]);
    case'voice':return vVoice(p[1]);
    case'song':return vSong(p[1]);
    case'search':return vSearch(p.slice(1).join('/'));
    case'trips':return vTrips();
    case'trip':if(tripsSeen.indexOf(p[1])<0){tripsSeen.push(p[1]);LS.set('tseen',tripsSeen);if(tripsSeen.length>=5)badge('explorer')}return vTrip(p[1],p[2]==='p'?p[3]:null,p[2]==='i'?p[3]:null);
    case'memories':return vMemories(p[1]||'all',p[2]);
    case'fun':return p[1]?vFunSub(p[1]):vFun();
    case'create':return vCreate();
    default:return vHome();
  }
}
window.addEventListener('hashchange',route);
applyLang();
Promise.all([getJSON('data/songs.json'),getJSON('data/trips.json'),fetch('data/config.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():{}}).catch(function(){return{}})]).then(function(r){
  M=r[0];TRIPS=r[1].trips||[];if(r[2]&&typeof r[2].api==='string')CONFIG.api=r[2].api;
  M.songs.forEach(function(s){SONG[s.id]=s});M.albums.forEach(function(a){ALB[a.id]=a});M.people.forEach(function(p){PPL[p.id]=p});
  favs=favs.filter(function(id){return SONG[id]});route();
  loadBackend().then(function(){if(apiOn()&&/^#\/(memories|songs\/albums|album\/new|$)/.test(location.hash||'#/'))route()});
  ['pointerdown','keydown'].forEach(function(e){document.addEventListener(e,function f(){document.removeEventListener(e,f,true);idle(function(){needLyrics()})},true)});
}).catch(function(e){V.innerHTML='<p class="empty">'+esc(String(e))+'</p>'});
if('serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
