import { browserBackend } from './browser-backend';
import { inspectAndDecode, sanitizeImage } from './sanitize-image.mjs';
import { LabError, abort } from './file-validation.mjs';
import type { CleanResult, Inspection, ImageFormat, LabStage } from '../types';

type Payload={buffer:ArrayBuffer;name:string;format:ImageFormat;expectedHash:string|null};
export type JobResult={inspection:Inspection;clean?:CleanResult};
type Reply={type:'ready';supported:boolean}|{type:'phase';stage:LabStage}|{type:'done';result:JobResult}|{type:'error';code:string;message:string};

async function workerJob(command:'inspect'|'clean',payload:Payload,signal:AbortSignal,phase:(stage:LabStage)=>void):Promise<JobResult|null>{
  if(typeof Worker==='undefined')return null;
  return new Promise((resolve,reject)=>{
    let worker:Worker,sent=false;
    try{worker=new Worker(new URL('./image.worker.ts',import.meta.url),{type:'module'});}catch{resolve(null);return;}
    const finish=(result:JobResult|null,error?:Error)=>{
      clearTimeout(timeout);signal.removeEventListener('abort',cancel);worker.terminate();
      if(error)reject(error);else resolve(result);
    };
    const cancel=()=>finish(null,new DOMException('Processamento cancelado.','AbortError'));
    const timeout=setTimeout(()=>finish(null,new LabError('TIMEOUT','O processamento excedeu 60 segundos. Tente uma imagem menor.')),60_000);
    signal.addEventListener('abort',cancel,{once:true});
    worker.onerror=()=>{if(sent)finish(null,new LabError('WORKER','O processamento isolado foi interrompido. Tente uma imagem menor.'));else finish(null);};
    worker.onmessage=(event:MessageEvent<Reply>)=>{
      const data=event.data;
      if(data.type==='ready'){
        if(!data.supported){finish(null);return;}
        if(signal.aborted){cancel();return;}
        sent=true;worker.postMessage({command,...payload},[payload.buffer]);
      }else if(data.type==='phase')phase(data.stage);
      else if(data.type==='done')finish(data.result);
      else if(data.type==='error')finish(null,new LabError(data.code,data.message));
    };
    if(signal.aborted)cancel();
  });
}
export async function runJob(command:'inspect'|'clean',payload:Payload,signal:AbortSignal,phase:(stage:LabStage)=>void):Promise<JobResult>{
  abort(signal);
  const isolated=await workerJob(command,payload,signal,phase);
  if(isolated)return isolated;
  abort(signal);
  const bytes=new Uint8Array(payload.buffer),backend=browserBackend();
  if(command==='inspect')return {inspection:await inspectAndDecode(bytes,backend,signal,phase)};
  const clean=await sanitizeImage(bytes,payload.name,payload.format,backend,signal,phase,payload.expectedHash);
  return {inspection:clean.before,clean};
}
export function readLocalFile(file:File,signal:AbortSignal):Promise<ArrayBuffer>{
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    const cancel=()=>reader.abort();
    const done=()=>signal.removeEventListener('abort',cancel);
    reader.onload=()=>{done();resolve(reader.result as ArrayBuffer);};
    reader.onerror=()=>{done();reject(new LabError('READ','Não foi possível ler o arquivo local.'));};
    reader.onabort=()=>{done();reject(new DOMException('Processamento cancelado.','AbortError'));};
    if(signal.aborted){reject(new DOMException('Processamento cancelado.','AbortError'));return;}
    signal.addEventListener('abort',cancel,{once:true});reader.readAsArrayBuffer(file);
  });
}
