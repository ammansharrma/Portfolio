import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';
const root = path.resolve('dist');
const types = { '.html':'text/html; charset=utf-8', '.js':'application/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.pdf':'application/pdf', '.xml':'application/xml', '.txt':'text/plain' };
const accepted = (header, encoding) => String(header || '').split(',').some(part => { const [name,...params]=part.trim().split(';'); return name===encoding && !params.some(p=>/^q=0(?:\.0*)?$/.test(p.trim())); });
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/') { res.writeHead(302, {Location:'/Portfolio/'}); res.end(); return; }
    const relative = decodeURIComponent(url.pathname).replace(/^\/Portfolio\/?/, '').replace(/^\/+/, '');
    let file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); res.end(); return; }
    try { if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html'); await fs.access(file); }
    catch { file = path.join(root, '404.html'); res.statusCode = 404; }
    const ext=path.extname(file);
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Cache-Control', file.startsWith(path.join(root,'assets')+path.sep) ? 'public, max-age=31536000, immutable' : ['.html','.pdf'].includes(ext) || res.statusCode===404 ? 'no-cache' : 'public, max-age=3600');
    let body=await fs.readFile(file);
    if (['.html','.js','.css','.svg','.xml','.txt'].includes(ext)) {
      res.setHeader('Vary','Accept-Encoding');
      if (body.length>1024 && accepted(req.headers['accept-encoding'],'br')) { body=brotliCompressSync(body); res.setHeader('Content-Encoding','br'); }
      else if (body.length>1024 && accepted(req.headers['accept-encoding'],'gzip')) { body=gzipSync(body); res.setHeader('Content-Encoding','gzip'); }
    }
    res.setHeader('Content-Length',body.length);
    res.end(req.method==='HEAD' ? undefined : body);
  } catch { res.writeHead(400); res.end('Bad request'); }
}).listen(Number(process.env.PORT || 4400), '127.0.0.1', () => console.log(`Portfolio ready at http://127.0.0.1:${process.env.PORT || 4400}/Portfolio/`));
