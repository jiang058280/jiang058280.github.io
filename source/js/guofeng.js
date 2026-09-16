(function () {
  'use strict';
  if (window.gfReady) return;
  window.gfReady = true;
  var indexPromise, returnFocus;
  function imageFallback(image) {
    if (!image.closest('#article-container') || image.dataset.gfFallback) return;
    image.dataset.gfFallback = 'true'; image.classList.add('gf-unavailable-image');
    var note = document.createElement('span'); note.className = 'gf-image-note';
    note.textContent = image.alt ? '原图暂不可用：' + image.alt : '文章原图暂不可用';
    image.insertAdjacentElement('afterend',note);
    image.addEventListener('load',function () { image.classList.remove('gf-unavailable-image'); note.remove(); delete image.dataset.gfFallback; },{once:true});
  }
  function closeSearch() {
    var dialog = document.getElementById('gf-search');
    if (dialog && dialog.open) dialog.close();
  }
  function ensureSearch() {
    var dialog = document.getElementById('gf-search');
    if (dialog) return dialog;
    dialog = document.createElement('dialog'); dialog.id = 'gf-search'; dialog.className = 'gf-glass';
    dialog.innerHTML = '<div class="gf-search-head"><h2 id="gf-search-title">寻找一篇手记</h2><button type="button" data-close-search aria-label="关闭搜索">关闭</button></div><label for="gf-query">搜索标题、分类与标签</label><input id="gf-query" type="search" placeholder="例如：RAG、ReAct、Python" autocomplete="off"><p id="gf-search-status" role="status" aria-live="polite"></p><div id="gf-search-results"></div>';
    dialog.setAttribute('aria-labelledby','gf-search-title'); document.body.appendChild(dialog);
    dialog.addEventListener('close',function () { if (returnFocus && returnFocus.isConnected) returnFocus.focus(); });
    dialog.addEventListener('click',function (e) { if (e.target === dialog) { var r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeSearch(); } });
    dialog.querySelector('input').addEventListener('input',renderSearch);
    return dialog;
  }
  function loadIndex() {
    if (!indexPromise) indexPromise = fetch('/content-index.json').then(function (r) { if (!r.ok) throw new Error('index'); return r.json(); }).catch(function (error) { indexPromise = null; throw error; });
    return indexPromise;
  }
  var searchSequence = 0;
  function renderSearch() {
    var sequence = ++searchSequence;
    var input = document.getElementById('gf-query');
    var query = input.value.trim().toLowerCase();
    var results = document.getElementById('gf-search-results'), status = document.getElementById('gf-search-status');
    results.replaceChildren(); if (!query) { status.textContent = '输入关键词查找手记，不搜索文章正文。'; return; }
    status.textContent = '正在查找…';
    loadIndex().then(function (data) {
      if (sequence !== searchSequence) return;
      var terms = query.split(/\s+/);
      var matches = data.posts.filter(function (p) { var haystack = [p.title].concat(p.categories || [],p.tags || []).join(' ').toLowerCase(); return terms.every(function (term) { return haystack.includes(term); }); });
      status.textContent = matches.length ? '找到 ' + matches.length + ' 篇手记' : '没有找到相关手记，可以换一个关键词。';
      matches.forEach(function (p) { var a = document.createElement('a'); a.className = 'gf-search-item'; a.href = p.url; var title = document.createElement('strong'); title.textContent = p.title; var meta = document.createElement('span'); meta.textContent = (p.categories || []).join(' · '); a.append(title,meta); results.appendChild(a); });
    }).catch(function () { if (sequence !== searchSequence) return; status.textContent = '搜索索引暂不可用，请使用技术书架。'; var a = document.createElement('a'); a.href = '/study/'; a.textContent = '打开全部文章'; results.appendChild(a); });
  }
  function initialize() {
    closeSearch();
    var type = document.querySelector('.gf-home') ? 'home' : document.querySelector('.gf-resume') ? 'about' : document.querySelector('.gf-study') ? 'study' : document.getElementById('post') ? 'post' : 'content';
    document.documentElement.dataset.gfPage = type;
    window.gfTheme.apply(type);
    document.querySelectorAll('#article-container img').forEach(function (image) { if (image.complete && !image.naturalWidth) imageFallback(image); });
    document.querySelectorAll('#gf-links a').forEach(function (a) { var active = new URL(a.href).pathname === location.pathname && !new URL(a.href).hash; if (active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    document.querySelectorAll('.gf-menu').forEach(function (b) { b.setAttribute('aria-expanded','false'); });
    document.querySelector('.gf-nav')?.classList.remove('is-open');
  }
  document.addEventListener('change',function (e) { if (e.target.matches('[data-theme-choice]')) window.gfTheme.set(e.target.value); });
  document.addEventListener('error',function (e) { if (e.target.tagName === 'IMG') imageFallback(e.target); },true);
  document.addEventListener('click',function (e) {
    if (e.target.closest('[data-search]')) { returnFocus = e.target.closest('[data-search]'); var dialog = ensureSearch(); if (!dialog.open) dialog.showModal(); dialog.querySelector('input').focus(); renderSearch(); }
    if (e.target.closest('[data-close-search]')) closeSearch();
    if (e.target.closest('[data-motion]')) window.gfTheme.toggleMotion();
    var menu = e.target.closest('.gf-menu'); if (menu) { var expanded = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',String(expanded)); document.querySelector('.gf-nav').classList.toggle('is-open',expanded); if (expanded) document.querySelector('#gf-links a')?.focus(); }
    if (e.target.closest('#gf-links a, .gf-search-item')) { closeSearch(); document.querySelector('.gf-nav')?.classList.remove('is-open'); document.querySelector('.gf-menu')?.setAttribute('aria-expanded','false'); }
  });
  document.addEventListener('keydown',function (e) { if (e.key === 'Escape') { var nav = document.querySelector('.gf-nav'); if (nav?.classList.contains('is-open')) document.querySelector('.gf-menu')?.focus(); nav?.classList.remove('is-open'); document.querySelector('.gf-menu')?.setAttribute('aria-expanded','false'); } });
  document.addEventListener('visibilitychange',function () { document.documentElement.dataset.gfPaused = document.hidden ? 'true' : 'false'; });
  document.addEventListener('pjax:send',closeSearch);
  document.addEventListener('pjax:complete',initialize);
  // Passive, bounded updates: native scrolling, no per-frame layout measurements.
  var scrollIdle;
  window.addEventListener('scroll',function () {
    if (document.documentElement.dataset.gfScrolling !== 'true') document.documentElement.dataset.gfScrolling = 'true';
    clearTimeout(scrollIdle);
    scrollIdle = setTimeout(function () { delete document.documentElement.dataset.gfScrolling; },140);
  },{passive:true});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initialize); else initialize();
})();
