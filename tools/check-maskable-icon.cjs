// Verify that Android's minimum 40%-radius safe area contains a complete green ring.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const sharp=require(process.env.MM_SHARP||'sharp');
const root=path.resolve(__dirname,'..');
(async()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
  const icon=manifest.icons.find(item=>item.purpose.split(/\s+/).includes('maskable'));
  assert(icon,'A maskable Android icon must be declared');
  const {data,info}=await sharp(path.join(root,icon.src)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(info.width,512);assert.equal(info.height,512);
  let best={radius:0,coverage:0};
  for(let radius=.30;radius<=.385;radius+=.005){
    let green=0;
    for(let angle=0;angle<360;angle+=3){
      const x=Math.round((.5+radius*Math.cos(angle*Math.PI/180))*info.width);
      const y=Math.round((.5+radius*Math.sin(angle*Math.PI/180))*info.height);
      const offset=(y*info.width+x)*4,[r,g,b,a]=data.subarray(offset,offset+4);
      if(g>r*1.4&&g>b*1.4&&g>70&&a===255)green++;
    }
    if(green/120>best.coverage)best={radius,coverage:green/120};
  }
  assert(best.coverage>=.95,'Green ring is cropped out of the minimum Android safe area: '+JSON.stringify(best));
  assert.equal(icon.purpose,'maskable','Android must have a dedicated padded icon');
  for(let i=3;i<data.length;i+=4)assert.equal(data[i],255,'Maskable artwork must be fully opaque');
  console.log('PASS Dedicated opaque 512px Android icon retains a complete green ring inside its safe area: '+JSON.stringify(best));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
