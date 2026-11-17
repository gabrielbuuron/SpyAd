import { LabError, abort, MIMES } from './file-validation.mjs';
import { orientationMatrix } from './verify-image.mjs';
import type { ImageFormat, Inspection } from '../types';

export function browserBackend() {
  return {
    async decode(bytes: Uint8Array, mime: string, signal?: AbortSignal) {
      abort(signal);
      if(typeof createImageBitmap!=='function')throw new LabError('BROWSER','Este navegador não oferece a decodificação necessária. Tente uma versão atual.');
      try{
        const bitmap=await createImageBitmap(new Blob([new Uint8Array(bytes)],{type:mime}),{imageOrientation:'from-image',colorSpaceConversion:'default'});
        if(signal?.aborted){bitmap.close();abort(signal);}
        return bitmap;
      }catch(error){
        if(error instanceof DOMException&&error.name==='AbortError')throw error;
        throw new LabError('DECODE','Não foi possível decodificar esta imagem. Ela pode estar corrompida ou usar uma variante não suportada.');
      }
    },
    async encode(bitmap:ImageBitmap, inspection:Inspection, format:ImageFormat, signal?:AbortSignal) {
      abort(signal);
      const {displayWidth:width,displayHeight:height}=inspection;
      const canvas=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(width,height):document.createElement('canvas');
      canvas.width=width;canvas.height=height;
      try{
        const context=canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
        if(!context)throw new LabError('CANVAS','Não foi possível alocar o canvas. Tente uma imagem menor.');
        if(format==='jpeg'){context.fillStyle='#ffffff';context.fillRect(0,0,width,height);}
        const matrix=orientationMatrix(inspection.orientation,inspection.width,inspection.height);
        context.setTransform(matrix[0],matrix[1],matrix[2],matrix[3],matrix[4],matrix[5]);
        context.drawImage(bitmap,0,0);
        abort(signal);
        const blob='convertToBlob' in canvas?await canvas.convertToBlob({type:MIMES[format],quality:.92}):await new Promise<Blob>((resolve,reject)=>{
          (canvas as HTMLCanvasElement).toBlob(value=>value?resolve(value):reject(new LabError('ENCODER','O navegador não conseguiu gerar o arquivo.')),MIMES[format],.92);
        });
        abort(signal);
        if(blob.size>10*1024*1024)throw new LabError('SIZE','O resultado excedeu 10 MiB. Tente WebP/JPEG ou uma imagem menor.');
        return new Uint8Array(await blob.arrayBuffer());
      }finally{canvas.width=0;canvas.height=0;}
    },
  };
}
