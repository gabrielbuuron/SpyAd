import { ascii, fail } from './file-validation.mjs';
import { bounds, view } from './binary.mjs';

export function readExif(bytes, absoluteOffset) {
  if (ascii(bytes, 0, 6) === 'Exif\0\0') { bytes = bytes.subarray(6); absoluteOffset += 6; }
  bounds(bytes, 0, 8);
  const signature = ascii(bytes, 0, 2);
  if (!['II', 'MM'].includes(signature)) fail('EXIF', 'EXIF não suportado ou inválido.');
  const little = signature === 'II', data = view(bytes);
  const u16 = o => { bounds(bytes, o, 2); return data.getUint16(o, little); };
  const u32 = o => { bounds(bytes, o, 4); return data.getUint32(o, little); };
  if (u16(2) !== 42) fail('EXIF', 'Apenas EXIF TIFF clássico é suportado.');
  const details = [];
  let patch = null, orientation = 1, orientationFound = false, gps = false;
  const sizes = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
  function entries(offset) {
    const count = u16(offset);
    if (count > 128) fail('EXIF', 'EXIF excede o limite de 128 entradas por diretório.');
    bounds(bytes, offset + 2, count * 12 + 4);
    return Array.from({length:count}, (_, i) => {
      const start = offset + 2 + i * 12, type = u16(start + 2), amount = u32(start + 4);
      const size = sizes[type];
      if (!size || amount > 1_000_000) fail('EXIF', 'Tipo de entrada EXIF não suportado.');
      const length = amount * size, valueOffset = length <= 4 ? start + 8 : u32(start + 8);
      bounds(bytes, valueOffset, length);
      return { tag: u16(start), type, amount, at: valueOffset, length };
    });
  }
  function text(entry) {
    return ascii(bytes, entry.at, Math.min(entry.length, 240)).replace(/\0/g, '').replace(/[\u0000-\u001f]/g, ' ').trim();
  }
  const root = entries(u32(4));
  const orientationEntries = root.filter(e => e.tag === 0x112);
  if (orientationEntries.length > 1) fail('EXIF', 'Orientação EXIF ambígua.');
  for (const entry of root) {
    if (entry.tag === 0x112) {
      if (entry.type !== 3 || entry.amount !== 1) fail('EXIF', 'Orientação EXIF não suportada.');
      orientation = u16(entry.at); orientationFound = true;
      if (orientation < 1 || orientation > 8) fail('EXIF', 'Orientação EXIF inválida.');
      patch = { offset: absoluteOffset + entry.at, little };
      details.push({ label: 'Orientação EXIF', value: String(orientation) });
    }
    if ([0x10f, 0x110, 0x132, 0x131].includes(entry.tag) && entry.type === 2) details.push({ label: ({271:'Fabricante',272:'Modelo',306:'Data EXIF',305:'Software'})[entry.tag], value: text(entry) });
    if (entry.tag === 0x8825) {
      if (entry.type !== 4 || entry.amount !== 1) fail('EXIF', 'Diretório GPS inválido.');
      const gpsEntries = entries(u32(entry.at)); gps = true;
      const latitude = gpsEntries.find(e => e.tag === 2), longitude = gpsEntries.find(e => e.tag === 4);
      const latRef = gpsEntries.find(e => e.tag === 1), lonRef = gpsEntries.find(e => e.tag === 3);
      function coordinate(entry) {
        if (!entry || entry.type !== 5 || entry.amount !== 3) return null;
        const parts = [0, 8, 16].map(delta => {
          const denominator = u32(entry.at + delta + 4);
          return denominator ? u32(entry.at + delta) / denominator : NaN;
        });
        return parts.every(Number.isFinite) ? parts[0] + parts[1] / 60 + parts[2] / 3600 : null;
      }
      const lat = coordinate(latitude), lon = coordinate(longitude);
      const ns = latRef ? text(latRef) : '', ew = lonRef ? text(lonRef) : '';
      if (lat !== null && lon !== null && lat <= 90 && lon <= 180 && ['N','S'].includes(ns) && ['E','W'].includes(ew)) {
        details.push({label:'Latitude GPS',value:((ns==='S'?-1:1)*lat).toFixed(6)}, {label:'Longitude GPS',value:((ew==='W'?-1:1)*lon).toFixed(6)});
      } else details.push({label:'GPS',value:'Diretório encontrado; coordenadas não interpretadas.'});
    }
  }
  return { orientation, orientationFound, patch, gps, details };
}
