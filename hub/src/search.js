/* Smart cross-script search: Latin, Hebrew letters, Yiddish; aliases; phonetic keys. */
var SR=(function(){
var ALIAS={
 mommy:['mommy','mommie','mom','mami','mamy','mamme','mammy','mamele','mameh','momy','מאמי','מאמע','מאמא','אמא','mama','imma','ima'],
 gitty:['gitty','gitti','giti','gittel','gity','kitty','kitti','gidi','gidy','גיטי','גיטל','גיטעלע','גיטל\'ה','גיטילה'],
 henny:['henny','heni','henni','hennie','hendy','honey','hanny','henna','hene','העני','הענני','הני','הנני','הענדי','הענע'],
 shevy:['shevy','shevi','shevvy','chevy','chevi','shevie','sheva','shevee','שבי','שעווי','שעוי','שעווע','שבע','שעוועלע'],
 faigy:['faigy','faigi','feigy','feigi','faygie','faygi','figgy','figgi','faggy','fagi','faiga','feiga','פייגי','פיגי','פייגע','פיגא','פייגא','פייגעלע'],
 zalmy:['zalmy','zalmi','zalman','salmi','salmy','zelmy','zelmi','zomi','zomy','zalmie','zalmen','zalmele','זלמי','זלמן','זלמן\'ל','זלמלה','זלמ\'לה','זלמילה','זאלמי'],
 itty:['itty','itti','ittie','iti','ity','etty','etti','eti','yitty','yitti','yiti','ittel','איטי','איתי','יטי','איטל','איטעלע','איטי\'לה','איטילה'],
 chani:['chani','chanie','chany','khani','khanie','hani','chaney','chanele','חני','חנה','חני\'לה','חנילה','חנעלע','כאני']
};
var NIQ=/[\u0591-\u05C7\u2066-\u2069]/g, FIN={'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'};
function heFold(s){return s.replace(NIQ,'').replace(/[ךםןףץ]/g,function(c){return FIN[c]}).replace(/װ/g,'וו').replace(/ױ/g,'וי').replace(/ײ/g,'יי').replace(/[׳'’`"״]/g,'')}
function norm(s){s=heFold(String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,''));return s.replace(/[^\p{L}\p{N}]+/gu,' ').trim()}
/* phonetic consonant skeleton shared by both scripts */
function keyLat(w){
 w=w.replace(/sch|sh|ch(?=[^aeiou]|$)|tch/g,function(m){return m==='ch'?'K':m==='tch'?'C':'S'})
  .replace(/ch|kh|x/g,'K').replace(/tz|ts|cz/g,'C').replace(/ph/g,'P').replace(/th/g,'T').replace(/ck|q/g,'K')
  .replace(/c(?=[eiy])/g,'S').replace(/c/g,'K').replace(/w|v/g,'B').replace(/f/g,'P').replace(/j/g,'G').replace(/z/g,'Z');
 w=w.toUpperCase().replace(/[AEIOUYH]/g,'');
 return w.replace(/(.)\1+/g,'$1');
}
var HK={'ב':'B','ג':'G','ד':'D','ז':'Z','ח':'K','ט':'T','כ':'K','ל':'L','מ':'M','נ':'N','ס':'S','פ':'P','צ':'C','ק':'K','ר':'R','ש':'S','ת':'T'};
function keyHe(w){w=w.replace(/וו/g,'B').replace(/דזש|זש/g,'Z').replace(/טש/g,'C');var o='';for(var i=0;i<w.length;i++){var c=w[i];o+=HK[c]||(c==='B'||c==='Z'||c==='C'?c:'')}return o.replace(/(.)\1+/g,'$1')}
function key(w){return /[\u05D0-\u05EA]/.test(w)?keyHe(w):keyLat(w)}
var A2P={};for(var p in ALIAS)ALIAS[p].forEach(function(a){A2P[norm(a)]=p});
function lev(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;var v=[];for(var j=0;j<=b.length;j++)v[j]=j;for(var i=1;i<=a.length;i++){var prev=v[0];v[0]=i;var mn=v[0];for(j=1;j<=b.length;j++){var t=v[j];v[j]=Math.min(v[j]+1,v[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=t;if(v[j]<mn)mn=v[j]}if(mn>max)return max+1}return v[b.length]}
/* index: docs = [{id, fields:[[text,weight],...], people:[]}] */
function build(docs){
 var V={};
 docs.forEach(function(doc,di){doc.fields.forEach(function(f){norm(f[0]).split(' ').forEach(function(w){if(!w)return;var e=V[w]||(V[w]={k:key(w),p:{}});if(!(e.p[di]>=f[1]))e.p[di]=f[1]})})});
 var words=Object.keys(V);return{docs:docs,V:V,words:words};
}
function personOf(w){var n=norm(w);if(A2P[n])return A2P[n];if(n.length>=4){for(var a in A2P){if(a.length>=4&&lev(a,n,1)<=1&&a[0]===n[0])return A2P[a]}}return null}
function matchWord(ix,q){
 var nq=norm(q),kq=key(nq),res={},pid=personOf(nq);
 function add(di,s){if(!(res[di]>=s))res[di]=s}
 ix.words.forEach(function(w){var e=ix.V[w],q1=0;
  if(w===nq)q1=1;else if(nq.length>=2&&w.indexOf(nq)===0)q1=.85;else if(nq.length>=4&&w.indexOf(nq)>0)q1=.6;
  else if(!pid&&kq.length>=2&&e.k===kq)q1=.75;else if(pid){}else if(kq.length>=3&&e.k.indexOf(kq)===0&&e.k.length-kq.length<=2)q1=.55;else if(kq.length>=4&&lev(e.k,kq,1)<=1)q1=.45;
  if(pid&&A2P[w]===pid)q1=Math.max(q1,.95);
  if(q1)for(var di in e.p)add(di,q1*e.p[di]);});
 if(pid)ix.docs.forEach(function(d,di){if(d.people&&d.people.indexOf(pid)>=0)add(di,4)});
 return res;
}
function search(ix,q){
 var ws=norm(q).split(' ').filter(Boolean);if(!ws.length)return[];
 var per=ws.map(function(w){return matchWord(ix,w)}),sc={},hits={};
 per.forEach(function(m){for(var di in m){sc[di]=(sc[di]||0)+m[di];hits[di]=(hits[di]||0)+1}});
 var all=Object.keys(sc).filter(function(di){return hits[di]===ws.length});
 if(!all.length)all=Object.keys(sc);
 return all.map(function(di){return{d:ix.docs[di],s:sc[di]*(hits[di]===ws.length?1:.5)}}).sort(function(a,b){return b.s-a.s});
}
return{norm:norm,key:key,build:build,search:search,personOf:personOf,ALIAS:ALIAS};
})();
if(typeof module!=='undefined')module.exports=SR;
