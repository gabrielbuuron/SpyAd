import { inspectImage } from './inspect-image.mjs';
import { neutralizeOrientation } from './binary.mjs';
import { abort, fail, outputName, checkSize } from './file-validation.mjs';
import { compareMetadata } from './verify-image.mjs';

async function fingerprint(bytes) {
  if(!globalThis.crypto?.subtle)fail('CRYPTO','Use um navegador moderno em HTTPS ou localhost para verificar o arquivo.');
  const hash=await crypto.subtle.digest('SHA-256',new Uint8Array(bytes));
  return Array.from(new Uint8Array(hash),v=>v.toString(16).padStart(2,'0')).join('');
}
/** @param {(stage: import('../types').LabStage)=>void} [onPhase] @returns {Promise<import('../types').Inspection>} */
export async function inspectAndDecode(bytes,backend,signal,onPhase=()=>{}) {
  abort(signal);onPhase('inspecting');
  const inspection=inspectImage(bytes);
  onPhase('decoding');
  let bitmap;
  try{
    bitmap=await backend.decode(neutralizeOrientation(bytes,inspection),inspection.mime,signal);
    abort(signal);
    if(bitmap.width!==inspection.width||bitmap.height!==inspection.height)fail('DECODE','As dimensões decodificadas não correspondem ao cabeçalho normalizado.');
  }finally{bitmap?.close();}
  inspection.decoded=true;inspection.sha256=await fingerprint(bytes);abort(signal);
  return inspection;
}
/** @param {(stage: import('../types').LabStage)=>void} [onPhase] @param {string|null} [expectedHash] @returns {Promise<import('../types').CleanResult>} */
export async function sanitizeImage(bytes,name,format,backend,signal,onPhase=()=>{},expectedHash=null) {
  abort(signal);
  const before=inspectImage(bytes);
  before.sha256=await fingerprint(bytes);
  if(expectedHash&&before.sha256!==expectedHash)fail('CHANGED','O arquivo mudou desde a inspeção. Importe novamente.');
  let bitmap,encoded;
  try{
    onPhase('decoding');
    bitmap=await backend.decode(neutralizeOrientation(bytes,before),before.mime,signal);abort(signal);
    if(bitmap.width!==before.width||bitmap.height!==before.height)fail('DECODE','Não foi possível garantir a orientação da imagem.');
    before.decoded=true;onPhase('encoding');
    encoded=await backend.encode(bitmap,before,format,signal);abort(signal);
  }finally{bitmap?.close();}
  checkSize(encoded.length);onPhase('verifying');
  const after=await inspectAndDecode(encoded,backend,signal,()=>{});
  if(after.format!==format)fail('ENCODER','Este navegador não exportou o formato solicitado. Tente PNG.');
  if(after.orientation!==1)fail('VERIFY','O resultado ainda contém orientação EXIF não normalizada. A exportação foi bloqueada.');
  if(after.metadata.gps.status==='found')fail('VERIFY','O resultado ainda contém GPS reconhecido. A exportação foi bloqueada.');
  if(after.width!==before.displayWidth||after.height!==before.displayHeight)fail('VERIFY','Dimensões inesperadas no resultado. A exportação foi bloqueada.');
  if(format!=='jpeg'&&before.alpha==='present'&&after.alpha==='not-found')fail('ALPHA','Não foi possível confirmar o canal de transparência no resultado.');
  if(before.sha256!==await fingerprint(bytes))fail('CHANGED','O buffer original foi alterado. A exportação foi bloqueada.');
  abort(signal);
  return {bytes:encoded,before,after,comparison:compareMetadata(before,after),outputName:outputName(name,format)};
}
