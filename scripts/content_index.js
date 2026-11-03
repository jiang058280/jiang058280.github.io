// 构建时生成全站内容索引（含文章所属分类），供左侧导航坞按分类分组动态列出
hexo.extend.generator.register('content-index', function (locals) {
  var posts = locals.posts.sort('knowledge_order').map(function (p) {
    var cats = (p.categories && p.categories.length) ? p.categories.map(function (c) { return c.name; }) : [];
    var tags = (p.tags && p.tags.length) ? p.tags.map(function (t) { return t.name; }) : [];
    return {
      title: p.title || '无标题',
      order: p.knowledge_order,
      seriesIndex: p.series_index,
      seriesTotal: p.series_total,
      url: '/' + p.path,
      date: p.date ? p.date.format('YYYY-MM-DD') : '',
      categories: cats,
      tags: tags
    };
  });
  var categories = locals.categories.map(function (c) {
    return { name: c.name, url: '/' + c.path, count: c.posts.length };
  });
  var tags = locals.tags.map(function (t) {
    return { name: t.name, url: '/' + t.path, count: t.posts.length };
  });
  return {
    path: 'content-index.json',
    data: JSON.stringify({ posts: posts, categories: categories, tags: tags })
  };
});
