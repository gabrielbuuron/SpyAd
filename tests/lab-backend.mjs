// Adaptador de testes Node; NÃO é o canvas do browser e não homologa Safari/Chrome.
import sharp from 'sharp';
import { orientationMatrix } from '../src/features/creative-lab/lib/verify-image.mjs';
export function testBackend(){
  let closed=0;
  return {
    get closed(){return closed;},
    async decode(bytes){
      const {data,info}=await sharp(Buffer.from(bytes),{failOn:'error'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      return {width:info.width,height:info.height,data,close(){closed++;}};
    },
    async encode(bitmap,inspection,format){
      const {width,height}=bitmap,output=Buffer.alloc(inspection.displayWidth*inspection.displayHeight*4);
      const [a,b,c,d,e,f]=orientationMatrix(inspection.orientation,width,height);
      for(let y=0;y<height;y++)for(let x=0;x<width;x++){
        const dx=Math.round(a*(x+.5)+c*(y+.5)+e-.5),dy=Math.round(b*(x+.5)+d*(y+.5)+f-.5);
        bitmap.data.copy(output,(dy*inspection.displayWidth+dx)*4,(y*width+x)*4,(y*width+x+1)*4);
      }
      let encoder=sharp(output,{raw:{width:inspection.displayWidth,height:inspection.displayHeight,channels:4}});
      if(format==='jpeg')encoder=encoder.flatten({background:'#ffffff'}).jpeg({quality:92});
      else if(format==='webp')encoder=encoder.webp({quality:92});
      else encoder=encoder.png();
      return new Uint8Array(await encoder.toBuffer());
    },
  };
}
