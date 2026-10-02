/* ---------- fun: profiles, points, quiz, charts, song of the week, create a song ---------- */
var PROF=LS.get('prof',null),PTS=LS.get('pts',{});
function me(){if(!PROF)return null;return PTS[PROF]||(PTS[PROF]={p:0,b:[],q:{},pl:{},n:0,sd:{}})}
function save(){LS.set('pts',PTS)}
function badge(k){var m=me();if(!m||m.b.indexOf(k)>=0)return;m.b.push(k);save();setTimeout(function(){toast('🏅 '+t('b_'+k))},900)}
function award(n){var m=me();if(!m)return;m.p+=n;save();toast(t('plusPts',{n:n}))}
function weekKey(){var d=new Date(),y=d.getFullYear(),s=new Date(y,0,1);return y+'-'+Math.ceil(((d-s)/864e5+s.getDay()+1)/7)}
window.funListen=function(id){var m=me();if(!m)return;m.pl[id]=(m.pl[id]||0)+1;var day=new Date().toISOString().slice(0,10),k=day+id;if(!m.sd[k]){m.sd[k]=1;m.p+=2}
  var n=Object.keys(m.pl).length;if(n>=1)badge('first');if(n>=10)badge('ten');if(n>=50)badge('fifty');var hr=new Date().getHours();if(hr>=21||hr<5)badge('owl');save()};
function pickHTML(back){return'<div class="pick"><h2 class="h2">'+esc(t('whoPlays'))+'</h2><p class="muted sm">'+esc(t('pickName'))+'</p><div class="pgrid">'+M.people.map(function(p){return'<button class="pp big'+(PROF===p.id?' on':'')+'" data-act="prof" data-p="'+p.id+'" data-back="'+(back||'')+'"><img src="'+avatar(p.id)+'" width="72" height="72" alt="">'+esc(lang==='he'?p.he:p.en)+'</button>'}).join('')+'</div></div>'}
function vFun(sub){
  needFun().then(function(){
    var m=me(),h='<div class="wrap">'+head(t('t_fun'),t('t_fun'),t('funIntro'));
    if(!PROF){setView(h+pickHTML('#/fun')+'</div>','fun');return}
    var p=PPL[PROF],ttl=FUN.titles[PROF];
    h+='<div class="profile"><img src="'+avatar(PROF)+'" width="64" height="64" alt=""><div><b>'+esc(pName(PROF))+'</b><small>🏅 '+esc(L(ttl))+'</small><span class="pts">'+esc(t('pointsN',{n:m.p}))+' · '+m.b.length+' '+esc(t('badges'))+'</span></div><button class="btn sm" data-go="#/fun/pick">'+esc(t('switchP'))+'</button></div>';
    h+='<div class="tiles">'+[['quiz','quiz','quizSub','q'],['charts','charts','chartsSub','c'],['sotw','sotw','sotwSub','s'],['board','board','boardSub','b']].map(function(x){return'<a class="tile fun-'+x[3]+'" href="#/fun/'+x[0]+'"><span class="emo">'+({q:'❓',c:'📈',s:'🗳️',b:'🏅'})[x[3]]+'</span><span><b>'+esc(t(x[1]))+'</b><small>'+esc(t(x[2]))+'</small></span></a>'}).join('')+'<a class="tile fun-w wide" href="#/create"><span class="emo">✍️</span><span><b>'+esc(lang==='he'?'יוצרים שיר':'Create a song')+'</b><small>'+esc(lang==='he'?'ספרו לנו רעיון, ואנחנו נכין ממנו שיר':'Tell us an idea and we’ll turn it into a song')+'</small></span></a></div>';
    h+='<p class="muted xs center">'+esc(t('dataNote'))+'</p>'+foot()+'</div>';
    setView(h,'fun');
  });
}
function vFunSub(sub){
  needFun().then(function(){
    if(sub==='pick')return setView('<div class="wrap"><a class="back" href="#/fun">'+ic('back')+esc(t('t_fun'))+'</a>'+pickHTML('#/fun')+'</div>','fun');
    if(!PROF&&sub!=='charts')return setView('<div class="wrap"><a class="back" href="#/fun">'+ic('back')+esc(t('t_fun'))+'</a>'+pickHTML('#/fun/'+sub)+'</div>','fun');
    var back='<a class="back" href="#/fun">'+ic('back')+esc(t('t_fun'))+'</a>';
    if(sub==='quiz')return startQuiz(back);
    if(sub==='charts')return vCharts(back,null);
    if(sub==='sotw')return vSotw(back);
    if(sub==='board')return vBoard(back);
    vFun();
  });
}
/* quiz */
var QZ=null;
function startQuiz(back){var pool=FUN.quiz.map(function(q,i){return i});for(var k=pool.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),x=pool[k];pool[k]=pool[j];pool[j]=x}QZ={qs:pool.slice(0,10),i:0,ok:0,ans:null,back:back};renderQuiz()}
function optLabel(o){return typeof o==='string'?pName(o):L(o)}
function renderQuiz(){
  var q=FUN.quiz[QZ.qs[QZ.i]],h='<div class="wrap">'+QZ.back;
  if(QZ.i>=QZ.qs.length){var m=me();if(QZ.ok>=7)badge('quiz');if(QZ.ok===QZ.qs.length)badge('ace');
    h+='<div class="qdone"><div class="big-emo">'+(QZ.ok>=8?'🏆':QZ.ok>=5?'🎉':'👏')+'</div><h2 class="h1">'+esc(t('quizDone'))+'</h2><p class="lead">'+esc(t('quizScore',{n:QZ.ok,m:QZ.qs.length}))+'</p><p class="muted">'+esc(t('pointsN',{n:m.p}))+'</p><button class="btn pri" data-act="quizagain">'+esc(t('again'))+'</button></div></div>';return setView(h,'fun')}
  if(!q.order){q.order=q.a.map(function(_,i){return i});for(var k=q.order.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),x=q.order[k];q.order[k]=q.order[j];q.order[j]=x}}
  h+='<div class="quiz"><div class="qbar"><i style="transform:scaleX('+(QZ.i/QZ.qs.length)+')"></i></div><div class="eyebrow">'+(QZ.i+1)+' / '+QZ.qs.length+'</div><h2 class="qq" dir="auto">'+esc(L(q.q))+'</h2><div class="opts">'+q.order.map(function(oi){var o=q.a[oi],cls='';if(QZ.ans!=null){if(oi===q.k)cls=' right';else if(oi===QZ.ans)cls=' wrong'}return'<button class="opt'+cls+(typeof o==='string'?' person':'')+'" data-act="qans" data-o="'+oi+'"'+(QZ.ans!=null?' disabled':'')+'>'+(typeof o==='string'?'<img src="'+avatar(o)+'" width="40" height="40" alt="">':'')+'<span>'+esc(optLabel(o))+'</span></button>'}).join('')+'</div>';
  if(QZ.ans!=null)h+='<div class="qfb '+(QZ.ans===q.k?'ok':'no')+'"><b>'+esc(QZ.ans===q.k?t('correct'):t('wrong'))+'</b>'+(q.f?'<span>'+esc(L(q.f))+'</span>':'')+'</div><button class="btn pri wide" data-act="qnext">'+esc(t('next'))+'</button>';
  setView(h+'</div></div>','fun');
}
function quizAnswer(oi){var q=FUN.quiz[QZ.qs[QZ.i]];QZ.ans=oi;var m=me(),qi=QZ.qs[QZ.i];if(oi===q.k){QZ.ok++;if(!m.q[qi]){m.q[qi]=1;award(10)}else award(2)}save();var y=scrollY;renderQuiz();window.scrollTo(0,y)}
/* charts */
function vCharts(back,pid){
  var src=pid?((PTS[pid]||{}).pl||{}):plays,top=Object.keys(src).filter(function(id){return SONG[id]}).sort(function(a,b){return src[b]-src[a]}).slice(0,10).map(function(id){return SONG[id]});
  var h='<div class="wrap">'+back+head(t('charts'),t('charts'),t('chartsSub'))+'<div class="chips"><button class="chip'+(!pid?' on':'')+'" data-act="chart" data-p="">'+esc(t('topPlayed'))+'</button>'+M.people.map(function(p){return'<button class="chip'+(pid===p.id?' on':'')+'" data-act="chart" data-p="'+p.id+'">'+esc(lang==='he'?p.he:p.en)+'</button>'}).join('')+'</div>';
  h+='<h2 class="h3">'+esc(pid?t('topFor',{p:pName(pid)}):t('topPlayed'))+'</h2>'+(top.length?'<ol class="chart">'+songList(top,'ch').replace('<ul class="songs"','<ul class="songs ranked"')+'</ol>':'<p class="empty">'+esc(t('noPlays'))+'</p>');
  var fv=favs.map(function(id){return SONG[id]}).filter(Boolean).slice(0,10);
  if(!pid)h+='<h2 class="h3">'+esc(t('topFav'))+'</h2>'+(fv.length?songList(fv,'chf'):'<p class="empty">'+esc(t('favsEmpty'))+'</p>');
  setView(h+foot()+'</div>','fun');
}
/* song of the week */
function sotwCands(){var c=[],add=function(id){if(SONG[id]&&SONG[id].s&&c.indexOf(id)<0&&c.length<6)c.push(id)};favs.forEach(add);Object.keys(plays).sort(function(a,b){return plays[b]-plays[a]}).forEach(add);M.songs.filter(function(s){return s.a==='thursday'}).forEach(function(s){add(s.id)});return c}
function vSotw(back){
  var wk=weekKey(),V=LS.get('sotw',{}),w=V[wk]||{},mine=w[PROF],cands=sotwCands(),tally={};Object.keys(w).forEach(function(p){tally[w[p]]=(tally[w[p]]||0)+1});
  var h='<div class="wrap">'+back+head(t('sotw'),t('sotw'),t('sotwSub'))+'<ul class="songs vote">'+cands.map(function(id){var s=SONG[id],n=tally[id]||0,on=mine===id;LISTS.sw=cands;return'<li class="row'+(on?' voted':'')+'"><img class="cv" width="48" height="48" src="'+cov(s)+'" alt=""><a class="tx" href="#/song/'+id+'"><div class="tt" dir="auto">'+esc(sTitle(s))+'</div><div class="st">'+n+' '+esc(t('votes'))+(n?' · '+Object.keys(w).filter(function(p){return w[p]===id}).map(pName).join(', '):'')+'</div></a><button class="btn sm'+(on?' pri':'')+'" data-act="vote" data-id="'+id+'">'+esc(on?t('voted'):t('vote'))+'</button></li>'}).join('')+'</ul>'+foot()+'</div>';
  setView(h,'fun');
}
function vote(id){var wk=weekKey(),V=LS.get('sotw',{}),w=V[wk]||(V[wk]={}),first=!w[PROF];w[PROF]=id;LS.set('sotw',V);if(first){award(3);badge('vote')}vSotw('<a class="back" href="#/fun">'+ic('back')+esc(t('t_fun'))+'</a>')}
/* family board: friendly, no ranking */
function vBoard(back){
  var tot=0;M.people.forEach(function(p){tot+=(PTS[p.id]||{}).p||0});var goal=Math.max(250,Math.ceil((tot+1)/250)*250);
  var h='<div class="wrap">'+back+head(t('board'),t('board'),t('boardSub'))+'<div class="famgoal"><b>'+esc(t('famTotal'))+': '+tot+'</b><div class="meter"><i style="transform:scaleX('+(tot/goal)+')"></i></div><small>'+esc(t('goal'))+': '+goal+'</small></div><ul class="board">'+M.people.map(function(p){var x=PTS[p.id]||{p:0,b:[]};return'<li class="'+(PROF===p.id?'me':'')+'"><img src="'+avatar(p.id)+'" width="52" height="52" alt=""><div><b>'+esc(lang==='he'?p.he:p.en)+'</b><small>🏅 '+esc(L(FUN.titles[p.id]))+'</small><div class="bdg">'+(x.b||[]).map(function(k){return'<span>'+esc(t('b_'+k))+'</span>'}).join('')+'</div></div><span class="pts">'+(x.p||0)+'</span></li>'}).join('')+'</ul>'+foot()+'</div>';
  setView(h,'fun');
}
/* create a song */
var CS={who:[],occ:null,lng:null,sty:null};
function vCreate(){
  var occ=lang==='he'?[['bday','יום הולדת'],['trip','טיול'],['shabbos','שבת ויום טוב'],['funny','סתם בשביל הכיף'],['thanks','תודה'],['other','אחר']]:[['bday','Birthday'],['trip','A trip'],['shabbos','Shabbos & Yom Tov'],['funny','Just for fun'],['thanks','A thank-you'],['other','Something else']];
  var sty=lang==='he'?[['upbeat','קצבי'],['funny','מצחיק'],['lullaby','שיר ערש'],['niggun','ניגון'],['heart','מרגש']]:[['upbeat','Upbeat'],['funny','Funny'],['lullaby','Lullaby'],['niggun','Niggun'],['heart','Heartfelt']];
  function chips(arr,key){return'<div class="who">'+arr.map(function(x){return'<button class="chip'+(CS[key]===x[0]?' on':'')+'" data-act="cs" data-k="'+key+'" data-v="'+x[0]+'">'+esc(x[1])+'</button>'}).join('')+'</div>'}
  var h='<div class="wrap"><a class="back" href="#/fun">'+ic('back')+esc(t('t_fun'))+'</a>'+head(lang==='he'?'שיר חדש':'New song',lang==='he'?'יוצרים שיר':'Create a song',lang==='he'?'ספרו לנו על מי, לאיזה אירוע, ופרטים מצחיקים. אנחנו נכין ממנו שיר ונוסיף אותו לאתר.':'Tell us who it’s about, the occasion and the funny details. We’ll make the song and add it to the site.')+'<div class="form">';
  h+='<label>'+esc(lang==='he'?'על מי השיר?':'Who is it about?')+'</label><div class="who">'+M.people.map(function(p){return'<button class="chip'+(CS.who.indexOf(p.id)>=0?' on':'')+'" data-act="csw" data-p="'+p.id+'">'+esc(lang==='he'?p.he:p.en)+'</button>'}).join('')+'</div><input id="cso" placeholder="'+esc(lang==='he'?'עוד מישהו? (לא חובה)':'Someone else? (optional)')+'">';
  h+='<label>'+esc(lang==='he'?'לאיזה אירוע?':'What’s the occasion?')+'</label>'+chips(occ,'occ');
  h+='<label>'+esc(lang==='he'?'שפה':'Language')+'</label>'+chips([['yi',t('lang_yi')],['he',t('lang_he')],['en',t('lang_en')]],'lng');
  h+='<label>'+esc(lang==='he'?'סגנון':'Style')+'</label>'+chips(sty,'sty');
  h+='<label for="csd">'+esc(lang==='he'?'פרטים מצחיקים, משפטים, מה קרה':'Funny details, catchphrases, what happened')+'</label><textarea id="csd" dir="auto" rows="5"></textarea><label for="nn">'+esc(t('yourName'))+'</label><input id="nn" value="'+esc(LS.get('name',''))+'"></div>'+sendBtns('song')+foot()+'</div>';
  setView(h,'fun');
}
function songMsg(){var name=$('#nn').value.trim();LS.set('name',name);var who=CS.who.map(pName);var o=$('#cso').value.trim();if(o)who.push(o);
  var lines=[lang==='he'?'🎵 בקשה לשיר חדש':'🎵 New song request'];if(who.length)lines.push((lang==='he'?'על: ':'About: ')+who.join(', '));
  var oc=$('[data-k=occ].on'),lg=$('[data-k=lng].on'),st=$('[data-k=sty].on');if(oc)lines.push((lang==='he'?'אירוע: ':'Occasion: ')+oc.textContent);if(lg)lines.push((lang==='he'?'שפה: ':'Language: ')+lg.textContent);if(st)lines.push((lang==='he'?'סגנון: ':'Style: ')+st.textContent);
  var d=$('#csd').value.trim();if(d)lines.push(d);if(name)lines.push('— '+name);return{subject:lang==='he'?'בקשה לשיר חדש':'New song request',body:lines.join('\n')}}
