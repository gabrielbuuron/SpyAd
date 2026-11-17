import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BRAND_PALETTES } from '../src/brand/signal-s.mjs';
const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');
function token(name) { return css.match(new RegExp('--' + name + ': (#[a-fA-F0-9]{6})'))[1]; }
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
for (const foreground of ['text', 'muted', 'subtle', 'accent']) {
  for (const background of ['background', 'surface', 'surface-raised']) {
    test('contraste AA dos tokens ' + foreground + ' / ' + background, () => {
      assert.ok(contrast(token(foreground), token(background)) >= 4.5);
    });
  }
}
test('botão primário tem contraste AA', () => { assert.ok(contrast('#0b252d', token('accent')) >= 4.5); });
for (const background of ['background', 'surface', 'surface-raised']) {
  test('borda dos controles é distinguível em ' + background, () => { assert.ok(contrast(token('control-border'), token(background)) >= 3); });
}
for (const [name, foreground, background] of [
  ['ação de dossiê', '#c9e9ee', '#1a303e'],
  ['estado salvo', '#c3edf0', '#1e3b44'],
  ['aviso de erro', '#f0b5b5', '#302027'],
  ['badge demo', '#bfdcc8', '#18251e'],
  ['legenda da prévia', '#e5eff2', '#674d30'],
]) test('contraste AA em ' + name, () => { assert.ok(contrast(foreground, background) >= 4.5); });
test('marca usa o ciano da interface e contraste de texto nos dois fundos',()=>{
  assert.equal(BRAND_PALETTES.brand.symbol,token('accent'));
  for(const color of [BRAND_PALETTES.brand.spy,BRAND_PALETTES.brand.ad])assert.ok(contrast(color,token('background'))>=4.5);
  for(const color of [BRAND_PALETTES['on-light'].spy,BRAND_PALETTES['on-light'].ad])assert.ok(contrast(color,'#ffffff')>=4.5);
});
