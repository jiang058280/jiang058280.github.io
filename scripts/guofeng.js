'use strict';

// Site-owned presentation layer. Original posts, theme and custom files stay intact.
const fs = require('node:fs');
const path = require('node:path');
const parse5 = require('parse5');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const topics = [
  ['rag', 'RAG 知识库', '从资料解析到可追溯答案', /rag|向量|倒排|混合检索|知识库/i],
  ['agent', 'Agent 与工作流', '理解推理、工具与流程编排', /agent|react|智能体|工作流|coze|dify/i],
  ['prompt', '提示词工程', '约束、评估与可靠生成', /提示词|prompt|幻觉|token|思维链/i],
  ['python', 'Python 与工程基础', '编程、存储与系统基础', /python|mysql|redis|socket|docker|装饰器|闭包|进程|线程|面向对象/i]
];
function attr(node, key) { return (node.attrs || []).find(a => a.name === key)?.value || ''; }
function walk(node, predicate, out = []) { if (predicate(node)) out.push(node); for (const child of node.childNodes || []) walk(child, predicate, out); return out; }
function remove(node) { if (node.parentNode) node.parentNode.childNodes = node.parentNode.childNodes.filter(n => n !== node); }
function fill(node, html) { const frag = parse5.parseFragment(html); node.childNodes = frag.childNodes; for (const n of node.childNodes) n.parentNode = node; }
function append(node, html, first = false) { const children = parse5.parseFragment(html).childNodes; for (const n of children) n.parentNode = node; node.childNodes = first ? [...children, ...node.childNodes] : [...node.childNodes, ...children]; }
function set(node, key, value) { const a = node.attrs.find(a => a.name === key); if (a) a.value = value; else node.attrs.push({name:key,value}); }
function nav() { return `<a class="gf-skip" href="#content-inner">跳到正文</a><nav class="gf-nav gf-glass" aria-label="主导航"><button class="gf-menu" type="button" aria-expanded="false" aria-controls="gf-links">菜单</button><div id="gf-links"><a href="/">首页</a><a href="/#projects">项目</a><a href="/#topics">技术专题</a><a href="/study/">面试复习</a><a href="/about/">关于我</a></div><div class="gf-controls"><button type="button" data-search>搜索</button><label class="gf-theme-label"><span class="gf-sr">主题</span><select data-theme-choice aria-label="主题"><option value="auto">默认主题</option><option value="light">浅色</option><option value="dark">深色</option></select></label><button type="button" data-motion aria-pressed="true">动态：开</button></div></nav>`; }
function card(post) { return `<a class="gf-article" href="/${escape(post.path)}"><span>${escape(post.categories.map(c => c.name).join(' · ') || '技术手记')}</span><h3>${escape(post.title)}</h3><span class="gf-arrow" aria-hidden="true">↗</span></a>`; }
function homepage(posts) {
  const picks = ['17.一个RAG系统的完整', '17RAG系统在实际落地中的常见坑点与优化策略', '06解释ReAct推理行动框架的工作原理与循环流程', '05如何强制大模型输出合法且严格的JSON格式'];
  const selected = picks.map(title => posts.find(p => p.title === title)).filter(Boolean);
  return `<div class="gf-home"><section class="gf-hero"><div class="gf-landscape" aria-hidden="true"><div class="gf-moon"></div><div class="gf-mist"></div></div><div class="gf-hero-copy"><p class="gf-eyebrow">AI 应用开发工程师</p><h1>在山水间，<br>构建智能。</h1><p class="gf-intro">专注 RAG · Agent · AI 应用落地</p><p class="gf-description">我是刘国庆。记录知识库建设、检索优化与应用实践，<br>让答案有据可依，让技术走进真实场景。</p><div class="gf-actions"><a class="gf-button gf-primary" href="#projects">查看项目 <span aria-hidden="true">↗</span></a><a class="gf-button gf-glass" href="/study/">阅读手记</a></div></div><span class="gf-hero-note">知识有源 · 实践有迹</span></section><section id="projects" class="gf-section"><div class="gf-heading"><div><p class="gf-eyebrow">SELECTED WORK</p><h2>精选项目</h2></div><a href="/about/#projects">完整经历 ↗</a></div><div class="gf-project-grid"><a class="gf-project gf-glass" href="/about/#education"><span class="gf-number">01 / AI APPLICATION</span><h3>智慧教研平台</h3><p>教学资料解析 · 知识库建设 · 可追溯检索</p><p class="gf-muted">负责数据清洗与资料整理，参与父子分块、向量入库及检索链路联调。</p><div class="gf-tags"><span>Python</span><span>Milvus</span><span>RAG</span></div><span class="gf-project-arrow" aria-hidden="true">↗</span></a><a class="gf-project gf-glass" href="/about/#tickets"><span class="gf-number">02 / RAG WORKFLOW</span><h3>智能工单系统</h3><p>Dify 工作流 · 检索调优 · 人工兜底</p><p class="gf-muted">负责文档清洗，参与工作流配置与检索调试，通过 Bad Case 迭代知识库与提示词。</p><div class="gf-tags"><span>Dify</span><span>Prompt</span><span>MySQL</span></div><span class="gf-project-arrow" aria-hidden="true">↗</span></a></div></section><section id="topics" class="gf-section"><div class="gf-heading"><div><p class="gf-eyebrow">KNOWLEDGE SHELF</p><h2>技术书架</h2></div><a href="/study/">全部手记 ↗</a></div><div class="gf-topic-grid">${topics.map(([id,title,desc],i) => `<a class="gf-topic gf-glass" href="/study/#${id}"><span class="gf-topic-index">0${i+1}</span><h3>${title}</h3><p>${desc}</p><span aria-hidden="true">↗</span></a>`).join('')}</div></section><section class="gf-section"><div class="gf-heading"><div><p class="gf-eyebrow">READ & REFLECT</p><h2>精选手记</h2></div><a href="/study/">进入复习 ↗</a></div><div class="gf-article-grid">${selected.map(card).join('')}</div></section></div>`;
}
hexo.extend.generator.register('guofeng-study', function(locals) {
  const posts = locals.posts.sort('-date').toArray();
  const body = `<div class="gf-study"><p class="gf-eyebrow">KNOWLEDGE & PRACTICE</p><h1>温故，知新。</h1><p>按专题梳理知识，也按问题寻找答案。</p><div class="gf-actions"><button class="gf-button" type="button" data-search>搜索标题、分类与标签</button><a href="/categories/">原有分类 ↗</a><a href="/tags/">标签 ↗</a></div><div class="gf-study-tabs">${topics.map(([id,title]) => `<a href="#${id}">${title}</a>`).join('')}<a href="#all-notes">全部文章</a></div>${topics.map(([id,title,desc,test]) => `<section id="${id}" class="gf-section"><h2>${title}</h2><p>${desc}</p><div class="gf-note-list">${posts.filter(p => test.test(p.title + ' ' + p.categories.map(c => c.name).join(' '))).map(card).join('')}</div></section>`).join('')}<section id="all-notes" class="gf-section"><h2>全部文章 · ${posts.length}</h2><div class="gf-note-list">${posts.map(card).join('')}</div></section></div>`;
  return {path:'study/index.html', layout:'page', data:{title:'面试复习 · 技术书架', content:body, aside:false, type:'study'}};
});
hexo.extend.filter.register('after_render:html', function(html) {
  if (!html.includes('id="body-wrap"')) return html;
  const doc = parse5.parse(html);
  const id = name => walk(doc, n => attr(n,'id') === name)[0];
  const root = walk(doc,n => n.tagName === 'html')[0];
  const body = walk(doc,n => n.tagName === 'body')[0];
  const canonical = walk(doc,n => n.tagName === 'link' && attr(n,'rel') === 'canonical')[0];
  const pathname = canonical ? new URL(attr(canonical,'href'), hexo.config.url).pathname.replace(/index\.html$/, '') : '';
  const home = pathname === '/' && Boolean(id('recent-posts'));
  const about = pathname === '/about/';
  set(root,'data-gf-page',home ? 'home' : about ? 'about' : pathname === '/study/' ? 'study' : id('post') ? 'post' : 'content');
  set(root,'data-theme','light');
  append(body,nav(),true);
  if (home) fill(id('content-inner'),homepage(hexo.locals.get('posts').sort('-date').toArray()));
  if (home) {
    const scene = walk(doc,n => attr(n,'class').split(/\s+/).includes('gf-landscape'))[0];
    append(scene,'<div class="gf-water" aria-hidden="true"></div>');
  }
  if (about && id('page')) fill(id('page'),fs.readFileSync(path.join(hexo.base_dir,'scripts','guofeng','resume.html'),'utf8'));
  if (about || pathname === '/study/') append(id('content-inner'),'<div class="gf-content-landscape" aria-hidden="true"></div>',true);
  const article = id('article-container'), toc = id('card-toc');
  if (article && toc) {
    const tocContent = walk(toc,n => attr(n,'class').split(/\s+/).includes('toc-content'))[0];
    if (tocContent) {
      const nodes = parse5.parseFragment(`<details class="gf-mobile-toc"><summary>文章目录</summary>${parse5.serialize(tocContent)}</details>`).childNodes;
      const parent = article.parentNode; for (const n of nodes) n.parentNode = parent;
      parent.childNodes.splice(parent.childNodes.indexOf(article),0,...nodes);
    }
  }
  const hidden = ['post-meta-date','article-sort-item-time','year','post-meta-separator'];
  for (const node of walk(doc,n => attr(n,'class').split(/\s+/).some(c => hidden.includes(c)))) remove(node);
  // Remove theme-generated times, preserving dates deliberately written inside articles.
  for (const node of walk(doc,n => n.tagName === 'time')) {
    let ancestor = node.parentNode, inArticle = false;
    while (ancestor) { if (attr(ancestor,'id') === 'article-container') inArticle = true; ancestor = ancestor.parentNode; }
    if (!inArticle) remove(node);
  }
  // Related-post cards use plain divs for dates rather than semantic <time>.
  for (const node of walk(doc,n => attr(n,'class').split(/\s+/).includes('info-item-1') && attr(n.parentNode || {},'class').split(/\s+/).includes('info-1'))) remove(node);
  function text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join(''); }
  function readingCard(link, label) {
    const titleNode = walk(link,n => attr(n,'class').split(/\s+/).includes('info-item-2'))[0];
    const title = titleNode ? text(titleNode) : attr(link,'title');
    return `<a class="gf-reading-card" href="${escape(attr(link,'href'))}"><span class="gf-eyebrow">${label}</span><h3>${escape(title)}</h3><span class="gf-reading-arrow" aria-hidden="true">↗</span></a>`;
  }
  const pagination = id('pagination');
  if (pagination && attr(pagination,'class').includes('pagination-post')) {
    const links = walk(pagination,n => n.tagName === 'a');
    set(pagination,'class','gf-post-navigation');
    fill(pagination,links.map(link => {
      const label = walk(link, node => attr(node,'class').split(' ').includes('info-item-1'))[0];
      return readingCard(link, label ? text(label) : '继续阅读');
    }).join(''));
  }
  const related = walk(doc,n => attr(n,'class').split(/\s+/).includes('relatedPosts'))[0];
  if (related) {
    const links = walk(related,n => n.tagName === 'a');
    set(related,'class','gf-related');
    fill(related,'<div class="gf-reading-heading"><span>延伸阅读</span><h2>循墨，再读一篇。</h2></div><div class="gf-related-grid">'+links.map(link => readingCard(link,'技术手记')).join('')+'</div>');
  }
  // Archive year/month pages keep existing routes, but no chronological page headings.
  if (pathname.startsWith('/archives/')) {
    for (const n of walk(doc,n => attr(n,'class').split(/\s+/).includes('article-sort-title'))) fill(n,'文章索引');
    const title = walk(doc,n => n.tagName === 'title')[0]; if (title) fill(title,`文章索引 | ${escape(hexo.config.title)}`);
  }
  return parse5.serialize(doc);
}, 50);
