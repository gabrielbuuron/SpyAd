import { fail } from './file-validation.mjs';
const table = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
export function crc32(bytes) {
  let c = 0xffffffff;
  for (const byte of bytes) c = table[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
export function view(bytes) { return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength); }
export function bounds(bytes, offset, length) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 0 || offset + length > bytes.length) fail('CORRUPT', 'Estrutura truncada ou corrompida.');
}
export function neutralizeOrientation(bytes, inspection) {
  const copy = new Uint8Array(bytes);
  if (inspection.patch) {
    const { offset, little, crc } = inspection.patch;
    bounds(copy, offset, 2);
    view(copy).setUint16(offset, 1, little);
    if (crc) view(copy).setUint32(crc.offset, crc32(copy.subarray(crc.start, crc.end)));
  }
  return copy;
}
