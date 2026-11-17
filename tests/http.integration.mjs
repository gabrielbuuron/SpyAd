import assert from 'node:assert/strict';
import { readdir,readFile } from 'node:fs/promises';
const response = await fetch('http://127.0.0.1:3230');
assert.equal(response.status, 200);
const html = await response.text();
for (const text of ['Visão geral', 'Ambiente demonstrativo', 'Workspace de estudo', 'Sem conta conectada', 'Referências para explorar', 'main-content']) assert.ok(html.includes(text), text);
for (const id of ['dashboard', 'explorer', 'creative-lab', 'radar', 'dna', 'collections', 'settings']) assert.ok(html.includes('href="#' + id + '"'), id);
assert.equal(response.headers.get('x-powered-by'), null);
assert.ok(response.headers.get('content-security-policy').includes("connect-src 'none'"));
assert.ok(response.headers.get('content-security-policy').includes("worker-src 'self'"));
assert.equal(response.headers.get('referrer-policy'),'no-referrer');
const styles = [...html.matchAll(/href="([^"<>]+\.css[^"<>]*)"/g)].map(match => match[1]);
assert.ok(styles.length > 0);
for (const style of styles) assert.equal((await fetch(new URL(style.replaceAll('&amp;', '&'), 'http://127.0.0.1:3230'))).status, 200);
assert.equal((await fetch('http://127.0.0.1:3230/rota-inexistente')).status, 404);
const imageChunks={parser:0,worker:0,launcher:0};
for(const file of await readdir('.next/static/chunks',{recursive:true})){
  if(!file.endsWith('.js'))continue;
  const source=await readFile('.next/static/chunks/'+file,'utf8');
  const parser=source.includes('VP8X'),worker=source.includes('type:"ready"')&&source.includes('OffscreenCanvas'),launcher=source.includes('new Worker');
  if(!parser&&!worker&&!launcher)continue;
  assert.equal((await fetch('http://127.0.0.1:3230/_next/static/chunks/'+file.replaceAll('\\','/'))).status,200);
  if(parser)imageChunks.parser++;if(worker)imageChunks.worker++;if(launcher)imageChunks.launcher++;
}
for(const [part,count] of Object.entries(imageChunks))assert.ok(count>=1,part+' deve estar empacotado e servido');
console.log('Smoke HTTP passou: SSR, sete destinos, CSS, CSP sem conexão, chunks do laboratório/worker e 404. Não valida canvas, cliques ou responsividade.');
