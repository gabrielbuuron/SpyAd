import { browserBackend } from './browser-backend';
import { inspectAndDecode, sanitizeImage } from './sanitize-image.mjs';
import { LabError } from './file-validation.mjs';
import type { ImageFormat } from '../types';

const context=globalThis as unknown as {postMessage:(value:unknown,transfer?:Transferable[])=>void;onmessage:((event:MessageEvent)=>void)|null};
context.postMessage({type:'ready',supported:typeof OffscreenCanvas!=='undefined'&&typeof createImageBitmap==='function'});
context.onmessage=async(event:MessageEvent<{command:'inspect'|'clean';buffer:ArrayBuffer;name:string;format:ImageFormat;expectedHash:string|null}>)=>{
  const {command,buffer,name,format,expectedHash}=event.data;
  const phase=(stage:string)=>context.postMessage({type:'phase',stage});
  try{
    const bytes=new Uint8Array(buffer),backend=browserBackend();
    if(command==='inspect'){
      const inspection=await inspectAndDecode(bytes,backend,undefined,phase);
      context.postMessage({type:'done',result:{inspection}});
    }else{
      const clean=await sanitizeImage(bytes,name,format,backend,undefined,phase,expectedHash);
      context.postMessage({type:'done',result:{inspection:clean.before,clean}},[clean.bytes.buffer as ArrayBuffer]);
    }
  }catch(error){
    context.postMessage({type:'error',code:error instanceof LabError?error.code:'PROCESS',message:error instanceof LabError?error.message:'Não foi possível processar a imagem. Tente um arquivo menor ou outro navegador.'});
  }
};
