// Upgrade the currently published toddler Main, preserving its identity and user data.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {execFileSync}=require('node:child_process');
const {chromium,expect}=require(process.env.MM_PLAYWRIGHT||'@playwright/test');
const root=path.resolve(__dirname,'..'),prior=process.env.PRIOR_V199?'b01e402906b352f829f750924c71c07b37c71c8e':'050748096331a7ab4c2c36cfa7e219c55c1ba107';
const previous=process.env.PRIOR_V199?'sana-little-hands-live-v199-green-safe-r2':'sana-little-hands-live-v198-r2-distinct-app-id',target='sana-little-hands-live-v199-sanatoddler-name';
const changed=new Set(['index.html','play.html','pwa.js','sw.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','share.js','v1.99.html','v1.98.html','update-v1.98.html','tablet-check.html','install-live-r2.html']);
const legacy=new Map();let old=true,browser,checks=0,musicRequests=0;
const check=(name,pass)=>{assert(pass,name);checks++;console.log('PASS '+name);};
const server=http.createServer((req,res)=>{try{
  const relative=new URL(req.url,'http://local').pathname.replace(/^\/toddler-games-\//,'');
  const file=path.resolve(root,relative);assert(file.startsWith(root+path.sep));let body;
  if(!old&&relative==='bgm-sana-v86.mp3'){musicRequests++;res.writeHead(503).end();return;}
  if(old&&changed.has(relative)){
    if(!legacy.has(relative))legacy.set(relative,execFileSync('git',['show',prior+':'+relative],{cwd:root,maxBuffer:10000000}));
    body=legacy.get(relative);
  }else body=fs.readFileSync(file);
  res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'})[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(body);
}catch{res.writeHead(404).end();}});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port,base=origin+'/toddler-games-/';
  browser=await chromium.launch();const context=await browser.newContext({viewport:{width:393,height:852}}),page=await context.newPage();page.setDefaultTimeout(15000);
  await page.goto(base+'index.html');await expect(page.locator('#offline-status')).toHaveText('Ready for offline play',{timeout:30000});
  const client=await context.newCDPSession(page);
  check('The previous published Main has the correct separate identity',await page.locator('[data-release-version]').first().textContent()===(process.env.PRIOR_V199?'v1.99':'v1.98')&&(await client.send('Page.getAppManifest')).manifest.id===base);
  await page.evaluate(async()=>{localStorage.setItem('mm.promotion-preserve','keep');await caches.open('mathmatrix-live-preserve-promotion');await caches.open('sana-little-hands-beta-preserve-promotion');});
  const game=await context.newPage();await game.goto(base+'play.html?age=3');await game.locator('[data-activity="puzzle"]').click();
  await game.locator('#puzzle-file').setInputFiles(path.join(root,'icon-192.png'));await expect(game.locator('[data-puzzle-choice]')).toHaveCount(2);
  await game.evaluate(()=>{window.promotionGameMarker='playing';});const settings=await game.evaluate(()=>localStorage.getItem('sanaLittleHandsV1'));
  old=false;await page.locator('#update-app').click();await expect(page.locator('meta[name="sana-release"]')).toHaveAttribute('content',target,{timeout:15000});
  check('Main updates to v1.99 without fetching unavailable unchanged music',musicRequests===0&&await page.locator('[data-release-version]').first().textContent()==='v1.99');
  check('Chromium keeps the same toddler Main identity and adopts the puppy icon',(await client.send('Page.getAppManifest')).manifest.id===base&&(await client.send('Page.getAppManifest')).manifest.name==='SaNaToddler'&&(await client.send('Page.getAppManifest')).manifest.icons.some(icon=>icon.url.endsWith('sana-puppy-green-r2-v199-512.png')));
  check('The welcome uses the approved circle and keeps SaNa',await page.locator('[data-sana-puppy]').getAttribute('href')==='sana-puppy-welcome-circle-v199.png'&&await page.locator('#welcome-title').textContent()==='SaNa Little Hands');
  check('An open puzzle keeps running',await game.evaluate(()=>window.promotionGameMarker)==='playing');
  check('Game settings survive the Main upgrade',await page.evaluate(()=>localStorage.getItem('sanaLittleHandsV1'))===settings);
  const keys=await page.evaluate(()=>caches.keys());
  check('Only the previous toddler Main cache is replaced',keys.includes(target)&&!keys.includes(previous)&&keys.includes('mathmatrix-live-preserve-promotion')&&keys.includes('sana-little-hands-beta-preserve-promotion'));
  check('MathMatrix storage is preserved',await page.evaluate(()=>localStorage.getItem('mm.promotion-preserve'))==='keep');
  await context.setOffline(true);await page.reload();await expect(page.locator('#offline-status')).toHaveText('Ready for offline play',{timeout:30000});
  check('The circular welcome opens offline',await page.locator('[data-sana-puppy]').getAttribute('href')==='sana-puppy-welcome-circle-v199.png'&&await page.evaluate(async()=>{const image=new Image();image.src='sana-puppy-welcome-circle-v199.png';await image.decode();return image.naturalWidth===512;}));
  await game.reload();await game.locator('[data-activity="puzzle"]').click();await expect(game.locator('[data-puzzle-choice]')).toHaveCount(2);
  check('The original puzzle photo is still available offline',true);
  console.log(JSON.stringify({checks,failed:0}));
})().catch(error=>{console.error(error.stack);process.exitCode=1;}).finally(async()=>{await browser?.close();server.closeAllConnections();server.close();});
