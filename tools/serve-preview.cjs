'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = path.resolve(__dirname,'..','preview');
function latest() {
  const names = fs.readdirSync(base).filter(name => /^\d{4}-/.test(name) && fs.existsSync(path.join(base,name,'preview-report.json'))).sort();
  if (!names.length) throw new Error('No completed preview');
  return path.join(base,names[names.length-1]);
}
const autoLatest = process.argv[2] === 'latest';
let root = autoLatest ? latest() : path.resolve(process.argv[2] || '');
const port = Number(process.argv[3] || 4000);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid preview port');
if (!root.startsWith(base + path.sep) || !fs.existsSync(path.join(root,'preview-report.json'))) throw new Error('Provide a generated project preview');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml'};
http.createServer((req,res) => {
  if (autoLatest) root = latest();
  let filename;
  try { filename = path.resolve(root,'.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname)); } catch (_) { res.writeHead(400).end(); return; }
  if (filename !== root && !filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(filename) && fs.statSync(filename).isDirectory()) filename = path.join(filename,'index.html');
  if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) { res.writeHead(404).end('Not found'); return; }
  res.setHeader('Content-Type',types[path.extname(filename)] || 'application/octet-stream');
  res.setHeader('Cache-Control','no-store');
  fs.createReadStream(filename).pipe(res);
}).listen(port,'127.0.0.1',() => console.log('Preview: http://127.0.0.1:'+port+' (localhost only, no file writes)'));
