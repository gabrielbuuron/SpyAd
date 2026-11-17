import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
