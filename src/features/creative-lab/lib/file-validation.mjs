export const LIMITS = Object.freeze({ maxBytes: 10 * 1024 * 1024, maxPixels: 8_000_000, maxDimension: 8192 });
export const MIMES = Object.freeze({ jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' });
export class LabError extends Error {
  constructor(code, message) { super(message); this.name = 'LabError'; this.code = code; }
}
export function fail(code, message) { throw new LabError(code, message); }
export function checkSize(size) {
  if (!Number.isSafeInteger(size) || size <= 0) fail('EMPTY', 'O arquivo está vazio.');
  if (size > LIMITS.maxBytes) fail('SIZE', 'O limite inicial é 10 MiB por imagem.');
}
export function checkDimensions(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) fail('DIMENSIONS', 'Dimensões inválidas.');
  if (width > LIMITS.maxDimension || height > LIMITS.maxDimension || width * height > LIMITS.maxPixels) fail('PIXELS', 'A imagem excede 8 megapixels ou 8.192 px em um dos lados.');
}
export function ascii(bytes, start, length) {
  return String.fromCharCode(...bytes.subarray(start, start + Math.min(length, 4096)));
}
export function formatOf(bytes) {
  checkSize(bytes.length);
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpeg';
  if (bytes.length >= 8 && bytes.slice(0, 8).every((byte, index) => byte === [137,80,78,71,13,10,26,10][index])) return 'png';
  if (bytes.length >= 12 && ascii(bytes,0,4) === 'RIFF' && ascii(bytes,8,4) === 'WEBP') return 'webp';
  fail('FORMAT', 'Formato não reconhecido. Use uma imagem JPEG, PNG ou WebP estática.');
}
export function outputName(name, format) {
  const stem = String(name).replace(/\.[^.]*$/, '').normalize('NFKC').replace(/[\u0000-\u001f\u007f<>:"/\\|?*\u202a-\u202e\u2066-\u2069]/g, '-').replace(/^\.+/, '').trim().slice(0, 80) || 'imagem';
  return stem + '.spyad-limpo.' + (format === 'jpeg' ? 'jpg' : format);
}
export function abort(signal) {
  if (signal?.aborted) throw new DOMException('Processamento cancelado.', 'AbortError');
}
