/* Bernshtein family hub v5 */
var VER='7';
var CONFIG={whatsapp:'',notesEmail:'',site:'https://yehudakugel.github.io/israel-family-treat-menu/',helicopter:'2026-10-05T09:00:00+03:00'};
var T={
en:{fam:'The Bernshtein Family',hubsub:'Songs · Trips · Memories',t_home:'Home',t_trips:'Trips',t_mem:'Memories',t_songs:'Songs',t_fun:'Fun',t_search:'Search',
 welcome:'Our songs, our trips, our family',heroP:'Every song we sing together and every trip we take, kept in one place.',
 songsN:'{n} songs',morning:'Morning',afternoon:'Afternoon',evening:'Evening',songsN1:'1 song',albumsN:'{n} albums',tripsN:'{n} trips',tripsN1:'1 trip',photosN:'{n} photos',photosN1:'1 photo',videosN:'{n} videos',videosN1:'1 video',itemsN:'{n} memories',itemsN1:'1 memory',
 seeAll:'See all',albums:'Albums',album:'Album',lbl:'Bernshtein',people:'People',songs:'Songs',recent:'Recently played',favs:'Favourites',all:'All',starring:'Starring',
 fresh:'From the Chol HaMoed trip',latest:'Latest trip',everyone:'Everyone',upcoming:'Coming up',heliSub:'Monday 5 October, be’ezras Hashem',days:'days',hrs:'hrs',min:'min',
 guide:'The trip guide',guideSub:'Thursday, step by step',play:'Play',shuffle:'Shuffle',soon:'Audio coming soon',
 searchPh:'Songs, words, names, memories…',noRes:'Nothing found. Try another word.',searchHint:'Search any word from a song, in English, Yiddish or Hebrew letters, or a name.',
 lyrics:'Lyrics',queue:'Up next',noLyrics:'No lyrics for this one.',nowPlaying:'Now playing',
 starName:'Starring {p}',alsoIn:'Also appears in',inMem:'{p} in our memories',
 tripsIntro:'Every outing, one page each: the story, the songs and the photos.',memIntro:'All our photos and videos. Pick a person or a trip.',
 noteCta:'Know who’s in it or what happened?',noteCtaSub:'Send us a note and we’ll add it.',addNote:'Add a note',noteTitle:'Send a note',
 noteSub:'Tell us who’s in the picture or what happened. It opens WhatsApp or email with your note ready.',yourName:'Your name',whoIn:'Who’s in it?',whatHappened:'What happened?',
 sendWa:'WhatsApp',sendMail:'Email',cancel:'Cancel',noteFor:'Note for',photo:'Photo',video:'Video',fullSize:'Full size',
 tripSoon:'Photos will appear here after the trip.',seeGuide:'Open the trip guide',tripSongs:'Songs from this trip',
 favsEmpty:'Tap the heart on any song to keep it here.',recentEmpty:'Songs you play will show up here.',
 lang_he:'Hebrew',lang_yi:'Yiddish',lang_en:'English',memNone:'No memories with this filter yet.',peopleSub:'Songs and memories for each of us',
 sing:'Sing',singAlong:'Sing-along',vocals:'Vocals',vocOff:'Instrumental',vocOn:'Full vocals',karNoInst:'Sing-along with the full song',karSoon:'Synced lyrics coming soon for this one',
 more:'Load more',allTrips:'All trips',
 /* fun */
 funIntro:'Quizzes, charts and points for the whole family.',whoPlays:'Who’s playing?',switchP:'Switch',points:'points',pointsN:'{n} points',
 quiz:'Trip trivia',quizSub:'10 questions about our trips and songs',start:'Start',next:'Next',correct:'Correct!',wrong:'Nice try!',quizDone:'Quiz done!',quizScore:'{n} of {m} right',again:'Play again',
 charts:'Charts',chartsSub:'Top songs on this phone',topPlayed:'Most played',topFav:'Most loved',topFor:'Top 10 for {p}',noPlays:'Play some songs and the chart fills up.',
 sotw:'Song of the week',sotwSub:'Vote for your favourite. One vote each per week.',vote:'Vote',voted:'Your vote',votes:'votes',
 board:'Family board',boardSub:'Everyone earns badges. Family points add up together.',famTotal:'Family points together',goal:'Next family goal',
 badges:'Badges',earned:'earned',pickName:'Pick your name to start collecting points',
 b_first:'First song',b_ten:'10 songs',b_fifty:'Superfan',b_quiz:'Quiz whiz',b_ace:'Perfect quiz',b_note:'Memory keeper',b_vote:'Voter',b_owl:'Night owl',b_explorer:'Trip explorer',b_singer:'Sing-along star',
 plusPts:'+{n} points',
 shareNote:'Share',dataNote:'Points and votes are saved on this phone.'},
he:{fam:'משפחת ברנשטיין',hubsub:'שירים · טיולים · זכרונות',t_home:'בית',t_trips:'טיולים',t_mem:'זכרונות',t_songs:'שירים',t_fun:'כיף',t_search:'חיפוש',
 welcome:'השירים שלנו, הטיולים שלנו, המשפחה שלנו',heroP:'כל שיר שאנחנו שרים יחד וכל טיול שאנחנו עושים, במקום אחד.',
 songsN:'{n} שירים',morning:'בוקר',afternoon:'צהריים',evening:'ערב',songsN1:'שיר אחד',albumsN:'{n} אלבומים',tripsN:'{n} טיולים',tripsN1:'טיול אחד',photosN:'{n} תמונות',photosN1:'תמונה אחת',videosN:'{n} סרטונים',videosN1:'סרטון אחד',itemsN:'{n} זכרונות',itemsN1:'זכרון אחד',
 seeAll:'הכל',albums:'אלבומים',album:'אלבום',lbl:'ברנשטיין',people:'אנשים',songs:'שירים',recent:'הושמעו לאחרונה',favs:'אהובים',all:'הכל',starring:'בכיכובם',
 fresh:'מטיול חול המועד',latest:'הטיול האחרון',everyone:'כולם',upcoming:'בקרוב',heliSub:'יום שני, 5 באוקטובר, בעזרת השם',days:'ימים',hrs:'שעות',min:'דקות',
 guide:'מדריך הטיול',guideSub:'יום חמישי, שלב אחרי שלב',play:'נגן',shuffle:'ערבב',soon:'השמע יעלה בקרוב',
 searchPh:'שירים, מילים, שמות, זכרונות…',noRes:'לא נמצא. נסו מילה אחרת.',searchHint:'חפשו כל מילה משיר, באנגלית, באידיש או באותיות עבריות, או שם.',
 lyrics:'מילים',queue:'הבא בתור',noLyrics:'אין מילים לשיר הזה.',nowPlaying:'מתנגן עכשיו',
 starName:'בכיכוב {p}',alsoIn:'מופיע/ה גם ב־',inMem:'{p} בזכרונות שלנו',
 tripsIntro:'כל יציאה בעמוד משלה: הסיפור, השירים והתמונות.',memIntro:'כל התמונות והסרטונים שלנו. בחרו אדם או טיול.',
 noteCta:'יודעים מי בתמונה או מה קרה?',noteCtaSub:'שלחו לנו הערה ונוסיף אותה.',addNote:'הוספת הערה',noteTitle:'שליחת הערה',
 noteSub:'ספרו לנו מי בתמונה או מה קרה. ייפתח וואטסאפ או מייל עם ההודעה מוכנה.',yourName:'השם שלך',whoIn:'מי בתמונה?',whatHappened:'מה קרה?',
 sendWa:'וואטסאפ',sendMail:'מייל',cancel:'ביטול',noteFor:'הערה על',photo:'תמונה',video:'סרטון',fullSize:'גודל מלא',
 tripSoon:'התמונות יופיעו כאן אחרי הטיול.',seeGuide:'למדריך הטיול',tripSongs:'השירים של הטיול',
 favsEmpty:'לחצו על הלב ליד שיר כדי לשמור אותו כאן.',recentEmpty:'שירים שתשמיעו יופיעו כאן.',
 lang_he:'עברית',lang_yi:'אידיש',lang_en:'אנגלית',memNone:'אין עדיין זכרונות בסינון הזה.',peopleSub:'השירים והזכרונות של כל אחד מאיתנו',
 sing:'שירה',singAlong:'שרים יחד',vocals:'קול',vocOff:'רק מוזיקה',vocOn:'שירה מלאה',karNoInst:'שרים יחד עם השיר המלא',karSoon:'מילים מסונכרנות יגיעו בקרוב',
 more:'עוד',allTrips:'כל הטיולים',
 funIntro:'חידונים, מצעדים ונקודות לכל המשפחה.',whoPlays:'מי משחק?',switchP:'החלפה',points:'נקודות',pointsN:'{n} נקודות',
 quiz:'חידון טיולים',quizSub:'10 שאלות על הטיולים והשירים שלנו',start:'מתחילים',next:'הבא',correct:'נכון!',wrong:'ניסיון יפה!',quizDone:'סיימת!',quizScore:'{n} מתוך {m} נכונות',again:'עוד פעם',
 charts:'מצעד',chartsSub:'השירים המובילים בטלפון הזה',topPlayed:'הכי מושמעים',topFav:'הכי אהובים',topFor:'הטופ 10 של {p}',noPlays:'תשמיעו כמה שירים והמצעד יתמלא.',
 sotw:'שיר השבוע',sotwSub:'הצביעו לשיר האהוב. קול אחד לכל אחד בשבוע.',vote:'הצבעה',voted:'ההצבעה שלך',votes:'קולות',
 board:'לוח המשפחה',boardSub:'כולם מרוויחים תגים. הנקודות של כולם מצטרפות יחד.',famTotal:'נקודות המשפחה ביחד',goal:'היעד המשפחתי הבא',
 badges:'תגים',earned:'הושגו',pickName:'בחרו את השם שלכם כדי לצבור נקודות',
 b_first:'שיר ראשון',b_ten:'10 שירים',b_fifty:'מעריץ על',b_quiz:'אלוף חידונים',b_ace:'חידון מושלם',b_note:'שומר הזכרונות',b_vote:'מצביע',b_owl:'ינשוף לילה',b_explorer:'חוקר טיולים',b_singer:'כוכב שירה',
 plusPts:'+{n} נקודות',shareNote:'שיתוף',dataNote:'הנקודות וההצבעות נשמרות בטלפון הזה.'}
};
var LS={get:function(k,d){try{var v=localStorage.getItem('bh_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:function(k,v){try{localStorage.setItem('bh_'+k,JSON.stringify(v))}catch(e){}}};
var qs=new URLSearchParams(location.search);
var lang=qs.get('lang')||LS.get('lang',null)||((navigator.language||'').indexOf('he')===0?'he':'en');if(lang!=='he'&&lang!=='en')lang='he';
var M=null,TRIPS=[],TRIPCACHE={},SONG={},ALB={},PPL={},LYR=null,FUN=null;
var favs=LS.get('favs',[]),recents=LS.get('recent',[]),plays=LS.get('plays',{});
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
function t(k,o){if(o&&o.n===1&&(T[lang][k+'1']))k=k+'1';var s=(T[lang][k]!=null?T[lang][k]:T.en[k]);if(s==null)s=k;if(o)for(var x in o)s=s.replace('{'+x+'}',o[x]);return s}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function L(o){if(o==null)return'';if(typeof o==='string')return o;return o[lang]||o.en||o.he||''}
function ic(n){return'<svg aria-hidden="true"><use href="#i-'+n+'"/></svg>'}
function fmt(s){s=Math.max(0,Math.round(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function hasHe(s){return/[\u0590-\u05FF]/.test(s||'')}
function dirOf(s){return hasHe(s)?'rtl':'ltr'}
function sTitle(s){return lang==='he'?(s.th||s.t):(s.te||s.t)}
function aName(id){var a=ALB[id];return a?(lang==='he'?a.he:a.en):''}
function pName(id){var p=PPL[id];return p?(lang==='he'?p.he:p.en):id}
function cov(s,big){return s&&s.c?'music/covers/'+(big?'m':'t')+'/'+s.c+'.webp':''}
function avatar(id){return'images/people/w/'+id+'.webp?v='+VER}
function dateFmt(d,o){try{return new Intl.DateTimeFormat(lang==='he'?'he-IL':'en-GB',o||{day:'numeric',month:'long',year:'numeric'}).format(new Date(d+'T12:00:00'))}catch(e){return d}}
function media(trip,u){if(!u)return'';if(/^(https?:)?\/\//.test(u)||!trip||!trip.base)return u;return trip.base.replace(/\/?$/,'/')+u}
function idle(f){(window.requestIdleCallback||function(c){return setTimeout(c,200)})(f)}
function getJSON(u){return fetch(u+(u.indexOf('?')<0?'?v='+VER:'')).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
var lyrP=null;function needLyrics(){if(!lyrP)lyrP=getJSON('data/lyrics.json').then(function(d){LYR=d;return d}).catch(function(){LYR={};return LYR});return lyrP}
var funP=null;function needFun(){if(!funP)funP=getJSON('data/fun.json').then(function(d){FUN=d;return d});return funP}
function toast(msg){var el=$('#toast');el.textContent=msg;el.hidden=false;el.classList.remove('go');void el.offsetWidth;el.classList.add('go');clearTimeout(toast.t);toast.t=setTimeout(function(){el.hidden=true},2200)}
