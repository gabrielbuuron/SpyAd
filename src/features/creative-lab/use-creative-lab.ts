'use client';
import { useEffect, useRef, useState } from 'react';
import { LabError, checkSize, MIMES } from './lib/file-validation.mjs';
import { readLocalFile, runJob } from './lib/run-job';
import type { Inspection, Comparison, ImageFormat, LabStage } from './types';

type Original={file:File;inspection:Inspection;url:string};
type Output={blob:Blob;after:Inspection;comparison:Comparison;name:string;url:string};
type State={stage:LabStage;original:Original|null;output:Output|null;error:string;notice:string};
const empty:State={stage:'idle',original:null,output:null,error:'',notice:''};

export function useCreativeLab(){
  const [state,setState]=useState<State>(empty);
  const job=useRef<AbortController|null>(null),version=useRef(0),urls=useRef<string[]>([]);
  function release(){for(const url of urls.current)URL.revokeObjectURL(url);urls.current=[];}
  useEffect(()=>()=>{job.current?.abort();for(const url of urls.current)URL.revokeObjectURL(url);urls.current=[];},[]);
  function reset(notice=''){version.current++;job.current?.abort();job.current=null;release();setState({...empty,notice});}
  function reject(message:string){reset();setState({...empty,stage:'error',error:message});}
  function progress(token:number,stage:LabStage){if(token===version.current&&!job.current?.signal.aborted)setState(current=>({...current,stage}));}
  async function importFile(file:File):Promise<ImageFormat|null>{
    reset();
    const token=version.current,controller=new AbortController();job.current=controller;
    setState({...empty,stage:'reading'});
    try{
      checkSize(file.size);
      const buffer=await readLocalFile(file,controller.signal);
      const result=await runJob('inspect',{buffer,name:'',format:'png',expectedHash:null},controller.signal,stage=>progress(token,stage));
      if(token!==version.current||controller.signal.aborted)return null;
      const url=URL.createObjectURL(new Blob([file],{type:result.inspection.mime}));urls.current.push(url);
      setState({...empty,stage:'ready',original:{file,inspection:result.inspection,url}});
      return result.inspection.format;
    }catch(error){
      if(token!==version.current||controller.signal.aborted)return null;
      setState({...empty,stage:'error',error:error instanceof LabError?error.message:'Não foi possível inspecionar a imagem. Tente um arquivo menor ou outro navegador.'});
      return null;
    }finally{if(token===version.current)job.current=null;}
  }
  async function clean(format:ImageFormat){
    if(!state.original)return;
    const original=state.original,token=++version.current,controller=new AbortController();
    job.current?.abort();job.current=controller;
    if(state.output){URL.revokeObjectURL(state.output.url);urls.current=urls.current.filter(url=>url!==state.output!.url);}
    setState({...state,stage:'encoding',output:null,error:'',notice:''});
    try{
      const buffer=await readLocalFile(original.file,controller.signal);
      const result=await runJob('clean',{buffer,name:original.file.name,format,expectedHash:original.inspection.sha256},controller.signal,stage=>progress(token,stage));
      if(token!==version.current||controller.signal.aborted)return;
      const clean=result.clean;if(!clean)throw new LabError('PROCESS','Resultado de limpeza ausente.');
      const blob=new Blob([new Uint8Array(clean.bytes)],{type:MIMES[clean.after.format]});
      const url=URL.createObjectURL(blob);urls.current.push(url);
      setState({stage:'complete',original,output:{blob,url,after:clean.after,comparison:clean.comparison,name:clean.outputName},error:'',notice:'Novo arquivo gerado e reinspecionado. O original não foi sobrescrito.'});
    }catch(error){
      if(token!==version.current||controller.signal.aborted)return;
      setState({stage:'ready',original,output:null,error:error instanceof LabError?error.message:'A conversão falhou. O original foi preservado; tente PNG ou uma imagem menor.',notice:''});
    }finally{if(token===version.current)job.current=null;}
  }
  return {state,importFile,clean,reset,reject,cancel:()=>reset('Processamento cancelado. Os arquivos foram retirados desta sessão.')};
}
