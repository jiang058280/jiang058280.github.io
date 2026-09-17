(function () {
 'use strict';
 if(window.gfStudyReady) return;
 window.gfStudyReady=true;
 var current='all-notes', page=1, size=12;
 function render() {
  var study=document.querySelector('.gf-study'); if(!study) return;
  var sections=Array.from(study.querySelectorAll(':scope > .gf-section'));
  var active=sections.find(function(s){return s.id===current;})||sections[sections.length-1];
  current=active.id;
  sections.forEach(function(s){s.hidden=s!==active;});
  var cards=Array.from(active.querySelectorAll('.gf-article'));
  var pages=Math.max(1,Math.ceil(cards.length/size));page=Math.max(1,Math.min(page,pages));
  cards.forEach(function(c,i){c.hidden=i<(page-1)*size||i>=page*size;});
  study.querySelectorAll('.gf-study-tabs a').forEach(function(a){if(a.hash==='#'+current)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
  var pager=study.querySelector('.gf-study-pager');
  if(!pager){pager=document.createElement('div');pager.className='gf-study-pager';pager.innerHTML='<button type="button" data-study-prev>上一页</button><span role="status" aria-live="polite"></span><button type="button" data-study-next>下一页</button>';study.appendChild(pager);}
  pager.querySelector('span').textContent='第 '+page+' / '+pages+' 页 · '+cards.length+' 篇';
  pager.querySelector('[data-study-prev]').disabled=page===1;
  pager.querySelector('[data-study-next]').disabled=page===pages;
 }
 function init(){current=location.hash.slice(1)||'all-notes';page=1;render();}
 document.addEventListener('click',function(e){
  var tab=e.target.closest('.gf-study-tabs a');
  if(tab){e.preventDefault();current=tab.hash.slice(1);page=1;history.replaceState(null,'','#'+current);render();return;}
  if(e.target.closest('[data-study-prev],[data-study-next]')){page+=e.target.closest('[data-study-next]')?1:-1;render();document.querySelector('.gf-study-tabs')?.scrollIntoView({block:'start',behavior:'instant'});}
 });
 window.addEventListener('hashchange',init);
 document.addEventListener('pjax:complete',init);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
