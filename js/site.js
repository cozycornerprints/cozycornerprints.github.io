var XL=(document.documentElement.lang||'en').slice(0,2);var T={"en": ["Your 3 free pages are downloading. Happy coloring!", "Nothing to undo yet", "Saved! Happy coloring"], "es": ["Tus 3 páginas gratis se están descargando. ¡A colorear!", "Todavía no hay nada que deshacer", "¡Guardado! Feliz coloreado"], "it": ["Le tue 3 pagine gratis si stanno scaricando. Buon divertimento!", "Ancora niente da annullare", "Salvato! Buon divertimento"]};T=T[XL]||T.en;

(function(){
  var cv=document.getElementById('page');
  var toast=document.getElementById('toast'),tt;
  function say(m){if(!toast)return;toast.textContent=m;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on');},3600);}
  document.querySelectorAll('[data-dl]').forEach(function(a){a.addEventListener('click',function(){say(T[0]);});});
  if(!cv)return;
  var ctx=cv.getContext('2d',{willReadFrequently:true});
  var color='#F4B4C4',hist=[],ready=false;
  var img=new Image();
  img.onload=function(){cv.width=img.naturalWidth;cv.height=img.naturalHeight;ctx.drawImage(img,0,0);ready=true;};
  img.src='/img/color-me-gingerbread-house.png';
  function hex(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
  function fill(x,y){
    var w=cv.width,h=cv.height,d=ctx.getImageData(0,0,w,h),p=d.data,i0=(y*w+x)*4;
    var sr=p[i0],sg=p[i0+1],sb=p[i0+2];
    if(sr+sg+sb<200)return;            // tapped a line
    var t=hex(color);
    if(sr===t[0]&&sg===t[1]&&sb===t[2])return;
    hist.push(ctx.getImageData(0,0,w,h));if(hist.length>12)hist.shift();
    var stack=[x,y],seen=new Uint8Array(w*h);
    function same(i){return p[i]===sr&&p[i+1]===sg&&p[i+2]===sb;}
    while(stack.length){
      var cy=stack.pop(),cx=stack.pop(),xl=cx;
      while(xl>0&&same((cy*w+xl-1)*4)&&!seen[cy*w+xl-1])xl--;
      var up=false,dn=false;
      for(var xx=xl;xx<w;xx++){
        var k=cy*w+xx,i=k*4;
        if(seen[k]||!same(i))break;
        p[i]=t[0];p[i+1]=t[1];p[i+2]=t[2];seen[k]=1;
        if(cy>0){var ku=k-w;if(!seen[ku]&&same(ku*4)){if(!up){stack.push(xx,cy-1);up=true;}}else up=false;}
        if(cy<h-1){var kd=k+w;if(!seen[kd]&&same(kd*4)){if(!dn){stack.push(xx,cy+1);dn=true;}}else dn=false;}
      }
    }
    ctx.putImageData(d,0,0);
  }
  cv.addEventListener('click',function(e){
    if(!ready)return;
    var r=cv.getBoundingClientRect();
    fill(Math.floor((e.clientX-r.left)*cv.width/r.width),Math.floor((e.clientY-r.top)*cv.height/r.height));
  });
  document.querySelectorAll('.swatch').forEach(function(b){
    b.addEventListener('click',function(){
      document.querySelectorAll('.swatch').forEach(function(o){o.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed','true');color=b.dataset.c;
    });
  });
  var hint=document.getElementById('hint');
  cv.addEventListener('click',function(){hint.classList.add('gone');});
  document.getElementById('undo').addEventListener('click',function(){if(hist.length)ctx.putImageData(hist.pop(),0,0);else say(T[1]);});
  document.getElementById('reset').addEventListener('click',function(){if(!ready)return;hist.push(ctx.getImageData(0,0,cv.width,cv.height));ctx.drawImage(img,0,0);});
  document.querySelectorAll('[data-dl]').forEach(function(a){a.addEventListener('click',function(){say(T[0]);});});
  document.getElementById('save').addEventListener('click',function(){
    if(!ready)return;
    var a=document.createElement('a');a.download='my-Cozy Corner-gingerbread-house.png';a.href=cv.toDataURL('image/png');a.click();say(T[2]);
  });
})();


(function(){var s=document.getElementById('slides');if(!s)return;var f=s.querySelectorAll('.slide'),d=s.querySelectorAll('.slides__dots button'),i=0,t;
function go(n){f[i].classList.remove('is-on');d[i].removeAttribute('aria-current');i=(n+f.length)%f.length;f[i].classList.add('is-on');d[i].setAttribute('aria-current','true');}
function play(){clearInterval(t);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)t=setInterval(function(){go(i+1)},5500);}
d.forEach(function(b,k){b.addEventListener('click',function(){go(k);play();});});play();})();

(function(){var sel=document.getElementById('item');if(!sel)return;var m=location.search.match(/item=([a-z-]+)/);if(m)sel.value=m[1];})();
document.addEventListener('click',function(e){document.querySelectorAll('details.lang[open],details.menu[open]').forEach(function(d){if(!d.contains(e.target))d.removeAttribute('open');});});
