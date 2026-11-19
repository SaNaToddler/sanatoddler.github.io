// Verify the promoted app at its project path, including coexistence with MathMatrix.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,expect}=require(process.env.MM_PLAYWRIGHT||'@playwright/test');
const root=path.resolve(__dirname,'..'),mathRoot=process.env.MATHMATRIX_ROOT;
const prefix='/toddler-games-/',live='https://kidsmathsmatrixpuzzle.github.io/toddler-games-/';
const cacheKey='sana-little-hands-live-v199-sanatoddler-name',results=[];
let browser,mathIdentity;
const check=(name,pass)=>{assert(pass,name);results.push(name);console.log('PASS '+name);};
const server=http.createServer((req,res)=>{try{
 const url=new URL(req.url,'http://local');
 if(url.pathname.endsWith('/__check.html')){res.writeHead(200,{'Content-Type':'text/html'}).end('<!doctype html><title>Installation check</title>'+(mathRoot?'<link rel="manifest" href="/manifest.json">':''));return;}
 const isSaNa=url.pathname.startsWith(prefix),directory=isSaNa?root:mathRoot;
 assert(directory,'MathMatrix fixture not configured');
 const relative=isSaNa?url.pathname.slice(prefix.length):url.pathname.slice(1);
 const file=path.resolve(directory,relative||'index.html');assert(file.startsWith(path.resolve(directory)+path.sep));
 res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.mp3':'audio/mpeg','.json':'application/json','.webmanifest':'application/manifest+json'})[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(fs.readFileSync(file));
}catch{res.writeHead(404).end();}});
(async()=>{
 const worker=fs.readFileSync(path.join(root,'sw.js'),'utf8'),assets=JSON.parse(worker.match(/const ASSETS=(\[[^;]+\]);/)[1]);
 for(const asset of assets){const file=path.resolve(root,decodeURIComponent(new URL(asset,'https://local/').pathname.slice(1)));assert(file.startsWith(root+path.sep));assert(fs.statSync(file).isFile(),asset);}
 check('Every precached asset exists at the Live project root',assets.length>=605);
 const cachedURLs=new Set(assets.map(asset=>new URL(asset,'https://local/toddler-games-/').href));
 for(const file of ['index.html','play.html'])for(const match of fs.readFileSync(path.join(root,file),'utf8').matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g))assert(cachedURLs.has(new URL(match[1],'https://local/toddler-games-/').href),'Offline script missing: '+match[1]);
 check('Welcome and game script URLs exactly match their offline entries',true);
 check('The approved circular puppy welcome has been promoted',fs.existsSync(path.join(root,'sana-puppy-welcome-circle-v199.png'))&&fs.readFileSync(path.join(root,'index.html'),'utf8').includes('data-sana-puppy'));
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
 check('Live has its own name and project-scoped launch paths',manifest.name==='SaNaToddler'&&manifest.short_name==='SaNaToddler'&&manifest.start_url==='./index.html'&&manifest.scope==='./');
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port,base=origin+prefix;
 browser=await chromium.launch();const context=await browser.newContext({viewport:{width:393,height:852}}),page=await context.newPage();page.setDefaultTimeout(15000);
 await page.goto(origin+'/__check.html');
 if(mathRoot){
  await page.evaluate(async()=>{const registration=await navigator.serviceWorker.register('/sw.js',{scope:'/'});const ready=await navigator.serviceWorker.ready,worker=registration.installing||registration.waiting||registration.active||ready.active;if(worker.state!=='activated')await new Promise(resolve=>{worker.addEventListener('statechange',()=>{if(worker.state==='activated')resolve();});});});
  check('Existing MathMatrix root worker installs first',await page.evaluate(()=>navigator.serviceWorker.getRegistration('/').then(item=>item.scope===location.origin+'/')));
  const client=await context.newCDPSession(page);
  mathIdentity=(await client.send('Page.getAppManifest')).manifest.id;
  check('Chromium reports the existing MathMatrix identity',mathIdentity===origin+'/');
 }
 await page.evaluate(async()=>{await caches.open('sana-little-hands-beta-preservation-probe');await caches.open('mathmatrix-live-preservation-probe');localStorage.setItem('mm.live-preservation-probe','keep');});
 await page.goto(base+'install-live-v1.99.html');
 await Promise.race([page.waitForURL('**/toddler-games-/index.html',{timeout:40000}),page.locator('#retry').waitFor({state:'visible',timeout:40000})]);
 check('The Live recovery link opens SaNa with a root worker already installed',page.url()===base+'index.html');
 await expect(page.locator('#offline-status')).toHaveText('Ready for offline play',{timeout:30000});
 fs.mkdirSync(path.join(root,'artifacts/promotion-v199'),{recursive:true});
 await page.screenshot({path:path.join(root,'artifacts/promotion-v199/main-welcome-phone.png')});
 await page.setViewportSize({width:1280,height:800});await page.screenshot({path:path.join(root,'artifacts/promotion-v199/main-welcome-tablet.png')});await page.setViewportSize({width:393,height:852});
 const client=await context.newCDPSession(page),processed=(await client.send('Page.getAppManifest')).manifest;
 check('Chromium gives SaNa its own app identity, distinct from MathMatrix',processed.id===base&&processed.id!==mathIdentity&&processed.name==='SaNaToddler');
 check('Live displays v1.99 without the Beta label',(await page.locator('.preview-tag').textContent()).includes('Live')&&await page.locator('[data-release-version]').first().textContent()==='v1.99');
 const state=await page.evaluate(async()=>({scope:(await navigator.serviceWorker.getRegistration()).scope,script:navigator.serviceWorker.controller.scriptURL,keys:await caches.keys(),marker:localStorage.getItem('mm.live-preservation-probe')}));
 check('SaNa controls only its own project path',state.scope===base&&state.script===base+'sw.js');
 check('Live keeps MathMatrix and unrelated Beta cache entries',state.keys.includes(cacheKey)&&state.keys.includes('mathmatrix-live-preservation-probe')&&state.keys.includes('sana-little-hands-beta-preservation-probe')&&state.marker==='keep');
 await page.getByRole('button',{name:'Share app',exact:true}).click();
 const share=new URL(await page.getByRole('link',{name:'WhatsApp',exact:true}).getAttribute('href'));
 check('Sharing sends only the new Live app link',share.searchParams.get('text')===live+'index.html');
 await page.getByRole('button',{name:'Got it',exact:true}).click();
 await page.locator('#update-app').click();await expect(page.getByRole('dialog')).toContainText('up to date');await page.getByRole('button',{name:'Got it',exact:true}).click();
 check('The in-app updater uses the Live registration',await page.locator('#update-app').isEnabled());
 await page.locator('#play').click();await page.locator('[data-activity="puzzle"]').click();
 await page.locator('#puzzle-file').setInputFiles(path.join(root,'icon-192.png'));await expect(page.locator('[data-puzzle-choice]')).toHaveCount(2);
 check('The promoted Picture Puzzle accepts a saved photo',true);
 await context.setOffline(true);await page.reload();await page.locator('[data-activity="puzzle"]').click();await expect(page.locator('[data-puzzle-choice]')).toHaveCount(2);
 check('The saved photo survives an offline reload',true);
 await page.goto(base+'play.html?age=3');await page.locator('#more-games').click();await page.locator('[data-activity="machines"]').click();await page.locator('#glossy-look').click();
 check('Promoted Machines artwork opens offline',await page.locator('#glossy-look-image').evaluate(async img=>{await img.decode();return img.naturalWidth>0;}));
 if(mathRoot){const math=await context.newPage();await math.goto(origin+'/index.html');check('MathMatrix still opens offline after the SaNa install',/MathMatrix|Maths Matrix/.test(await math.title()));}
 fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});await page.screenshot({path:path.join(root,'artifacts/live-machines-offline.png')});
 console.log(JSON.stringify({checks:results.length,failed:0,cacheKey}));
})().catch(error=>{console.error(error.stack);process.exitCode=1;}).finally(async()=>{await browser?.close();server.closeAllConnections();server.close();});
