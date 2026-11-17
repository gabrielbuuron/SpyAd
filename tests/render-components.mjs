// Renderização SSR de componentes reais, sem navegador e sem novas dependências.
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(new URL('../package.json', import.meta.url));
const cache = new Map();
function moduleURL(path) {
  if (cache.has(path)) return cache.get(path);
  let source = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX }, fileName: path,
  }).outputText;
  source = source.replace(/from\s+["']([^"']+)["']/g, (_match, specifier) => {
    let destination;
    if (specifier.startsWith('.')) {
      const base = resolve(dirname(path), specifier);
      const resolved = [base, base + '.tsx', base + '.ts', base + '.mjs'].find(candidate => existsSync(candidate));
      if (!resolved) throw Error('Unresolved test import: ' + specifier);
      destination = moduleURL(resolved);
    } else destination = pathToFileURL(require.resolve(specifier)).href;
    return 'from ' + JSON.stringify(destination);
  });
  const url = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
  cache.set(path, url);
  return url;
}
export async function renderComponent(name, exported, props) {
  const path = fileURLToPath(new URL('../src/components/' + name + '.tsx', import.meta.url));
  const componentModule = await import(moduleURL(path));
  return renderToStaticMarkup(createElement(componentModule[exported], props));
}
