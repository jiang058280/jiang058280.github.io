'use strict';
// Fresh, unique preview output; no Hexo generate/clean and no deletion of old files.
const fs = require('node:fs');
const path = require('node:path');
const {pipeline} = require('node:stream/promises');
const Hexo = require('hexo');
const base = path.resolve(__dirname,'..');
async function main() {
  const destination = path.join(base,'preview',new Date().toISOString().replace(/[:.]/g,'-'));
  const hexo = new Hexo(base,{silent:true});
  await hexo.init();
  // Work with a fresh in-memory database: Hexo's database recovery can delete db.json.
  hexo._dbLoaded = true;
  await hexo.load();
  const routes = hexo.route.list();
  for (const route of routes) {
    const target = path.resolve(destination,route);
    if (!target.startsWith(destination + path.sep)) throw new Error('Unsafe route: ' + route);
    fs.mkdirSync(path.dirname(target),{recursive:true});
    await pipeline(hexo.route.get(route),fs.createWriteStream(target,{flags:'wx'}));
  }
  const report = {output:destination,routes:routes.length,posts:hexo.locals.get('posts').length};
  fs.writeFileSync(path.join(destination,'preview-report.json'),JSON.stringify(report,null,2),{flag:'wx'});
  console.log(JSON.stringify(report));
  // Do not save database/cache or call generate: all source and previous output stays intact.
}
main().catch(error => { console.error(error); process.exitCode = 1; });
