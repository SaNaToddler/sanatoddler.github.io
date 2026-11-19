// Exercise the faulty published r1 identity -> corrected r2, keeping a saved photo.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {execFileSync}=require('node:child_process');
const {chromium,expect}=require(process.env.MM_PLAYWRIGHT||'@playwright/test');
const root=path.resolve(__dirname,'..'),prior='da9b6e0b2320b322dec7811814577b4810a01187',legacy=new Map();
const changed=new Set(['index.html','play.html','manifest.webmanifest','sw.js','v1.98.html','update-v1.98.html']);
let old=true,browser,checks=0;
const check=(name,pass)=>{assert(pass,name);checks++;console.log('PASS '+name);};
const server=http.createServer((req,res)=>{try{
 const pathname=new URL(req.url,'http://local').pathname,relative=pathname.replace(/^\/toddler-games-\//,'');
 const file=path.resolve(root,relative);assert(file.startsWith(root+path.sep));let body;
 if(old&&changed.has(relative)){if(!legacy.has(relative))legacy.set(relative,execFileSync('git',['show',prior+':'+relative],{cwd:root,maxBuffer:10000000}));body=legacy.get(relative);}else body=fs.readFileSync(file);
 res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'})[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(body);
}catch{res.writeHead(404).end();}});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port,base=origin+'/toddler-games-/';
 browser=await chromium.launch();const context=await browser.newContext({viewport:{width:393,height:852}}),page=await context.newPage();page.setDefaultTimeout(15000);
 await page.goto(base+'index.html');await expect(page.locator('#offline-status')).toHaveText('Ready for offline play',{timeout:30000});
 const client=await context.newCDPSession(page);
 check('The published r1 reproduces the root app identity collision',(await client.send('Page.getAppManifest')).manifest.id===origin+'/');
 await page.evaluate(async()=>{localStorage.setItem('mm.identity-repair-preserve','keep');await caches.open('mathmatrix-live-preserve-id-repair');});
 await page.locator('#play').click();await page.locator('[data-activity="puzzle"]').click();await page.locator('#puzzle-file').setInputFiles(path.join(root,'icon-192.png'));await expect(page.locator('[data-puzzle-choice]')).toHaveCount(2);
 const settings=await page.evaluate(()=>localStorage.getItem('sanaLittleHandsV1'));
 old=false;await page.goto(base+'install-live-r2.html');await page.waitForURL('**/toddler-games-/index.html',{timeout:40000});await expect(page.locator('#offline-status')).toHaveText('Ready for offline play',{timeout:30000});
 check('The fresh repair entry replaces the cached r1 application',(await page.locator('meta[name="sana-release"]').getAttribute('content'))==='sana-little-hands-live-v199-sanatoddler-name');
 check('Chromium now computes SaNa as its own installed-app identity',(await client.send('Page.getAppManifest')).manifest.id===base);
 check('Game settings survive the identity repair',await page.evaluate(()=>localStorage.getItem('sanaLittleHandsV1'))===settings);
 const keys=await page.evaluate(()=>caches.keys());
 check('Only the previous SaNa release cache is replaced',keys.includes('sana-little-hands-live-v199-sanatoddler-name')&&!keys.includes('sana-little-hands-live-v198-r1')&&keys.includes('mathmatrix-live-preserve-id-repair'));
 check('MathMatrix storage is kept',await page.evaluate(()=>localStorage.getItem('mm.identity-repair-preserve'))==='keep');
 await context.setOffline(true);await page.locator('#play').click();await page.locator('[data-activity="puzzle"]').click();await expect(page.locator('[data-puzzle-choice]')).toHaveCount(2);
 check('The original saved puzzle photo still opens offline',true);
 console.log(JSON.stringify({checks,failed:0}));
})().catch(error=>{console.error(error.stack);process.exitCode=1;}).finally(async()=>{await browser?.close();server.closeAllConnections();server.close();});
