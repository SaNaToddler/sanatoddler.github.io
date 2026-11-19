// Verify the independent public site. Native share payload checks do not emulate Android installation.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium,webkit,expect}=require(process.env.MM_PLAYWRIGHT||'@playwright/test');
const root=path.resolve(__dirname,'..'),publicURL='https://sanatoddler.github.io/',release='sana-toddler-public-v199-org-r1';
const engine=process.argv.includes('--webkit')?'webkit':'chromium',shareOnly=process.argv.includes('--share-only');
const results=[],errors=[];let browser,context,serverUnavailable=false;
const check=(name,pass)=>{assert(pass,name);results.push(name);console.log('PASS '+name);};
const server=http.createServer((req,res)=>{
 if(serverUnavailable){req.socket.destroy();return;}
 try{
  const url=new URL(req.url,'http://local'),file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  assert(file.startsWith(root+path.sep));
  const type=({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.mp3':'audio/mpeg','.jpg':'image/jpeg'})[path.extname(file)]||'application/octet-stream';
  res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'}).end(fs.readFileSync(file));
 }catch{res.writeHead(404).end('Not found');}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 browser=await({chromium,webkit}[engine]).launch();
 context=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:shareOnly?'block':'allow',...(engine==='chromium'?{permissions:['clipboard-read','clipboard-write']}: {})});
 await context.addInitScript(()=>{
  window.__sharedPayloads=[];
  Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.__sharedPayloads.push(data);}});
  Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
 });
 const page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',error=>errors.push(error.message));
 await page.goto(origin+'/');
 await page.getByRole('button',{name:'Share app',exact:true}).click();
 check('Visible share link uses only the branded public address',await page.locator('.share-link input').inputValue()===publicURL);
 check('WhatsApp invitation uses the branded address',new URL(await page.getByRole('link',{name:'WhatsApp',exact:true}).getAttribute('href')).searchParams.get('text')===publicURL);
 await page.getByRole('button',{name:'Copy link',exact:true}).click();
 await expect(page.locator('#share-result')).toContainText('Link copied');
 if(engine==='chromium')check('Actual browser clipboard contains the public address',await page.evaluate(()=>navigator.clipboard.readText())===publicURL);
 await page.getByRole('button',{name:'More apps',exact:true}).click();
 check('Native-share payload construction uses the branded address',await page.evaluate(url=>window.__sharedPayloads.length===1&&window.__sharedPayloads[0].url===url,publicURL));
 await page.getByRole('button',{name:'Got it',exact:true}).click();
 if(shareOnly)return;

 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
 check('Installed identity is rooted on the separate app hostname',manifest.id==='/'&&manifest.scope==='./'&&manifest.start_url==='./index.html'&&new URL(manifest.id,publicURL).href===publicURL);
 check('Both installed labels retain SaNaToddler',manifest.name==='SaNaToddler'&&manifest.short_name==='SaNaToddler');
 check('Green puppy icons are retained',manifest.icons.every(icon=>icon.src.startsWith('sana-puppy-green-r2-v199-')));
 for(const name of ['index.html','play.html']){
  const text=fs.readFileSync(path.join(root,name),'utf8');
  check(name+' has matching independent release',text.includes('content="'+release+'"'));
  check(name+' canonical and social URLs use only the new hostname',!text.includes('kidsmathsmatrixpuzzle.github.io')&&!text.includes('grajapm-hue.github.io')&&text.includes('https://sanatoddler.github.io/'));
 }
 const worker=fs.readFileSync(path.join(root,'sw.js'),'utf8');
 check('Service worker has the independent cache namespace',worker.includes("const CACHE='"+release+"'")&&worker.includes("const PREFIX='sana-toddler-public-'"));
 await(await import('./build-offline-integrity.mjs')).checkIntegrity(worker);
 check('All offline asset digests match the release files',true);
 const source=JSON.parse(fs.readFileSync(path.join(root,'tools/approved-main-source.json'),'utf8'));
 let preserved=0;
 for(const [name,expected]of Object.entries(source.files)){
  if(source.changedFiles.includes(name))continue;
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex'),expected,'Approved source changed: '+name);preserved++;
 }
 check(preserved+' approved files retain their exact source bytes',preserved>630);
 for(const [name,expected]of Object.entries(source.unchangedPageBodies)){
  const body=fs.readFileSync(path.join(root,name),'utf8').replace(/\r\n/g,'\n').match(/<body\b[\s\S]*/)[0];
  assert.equal(crypto.createHash('sha256').update(body).digest('hex'),expected,'Approved page body changed: '+name);
 }
 check('Welcome and gameplay HTML bodies retain their approved content',true);
 for(const file of fs.readdirSync(root).filter(name=>name.endsWith('.html')&&!['index.html','play.html'].includes(name))){
  const text=fs.readFileSync(path.join(root,file),'utf8');
  assert(!text.includes('kidsmathsmatrixpuzzle.github.io'),'Old-host link in '+file);
  assert(!text.includes('sana-little-hands-live-v199-'),'Old release in '+file);
 }
 check('Bundled HTML helpers use the current origin and release',true);
 await expect(page.locator('#offline-status')).toHaveText('Ready for offline play',{timeout:90000});
 const state=await page.evaluate(async()=>({scope:(await navigator.serviceWorker.getRegistration()).scope,worker:navigator.serviceWorker.controller?.scriptURL,keys:await caches.keys()}));
 check('Root page is controlled by the independent worker',state.scope===origin+'/'&&state.worker===origin+'/sw.js'&&state.keys.includes(release));
 if(engine==='chromium'){
  const client=await context.newCDPSession(page),parsed=(await client.send('Page.getAppManifest')).manifest;
  check('Chromium processes the new root manifest identity',parsed.id===origin+'/'&&parsed.scope===origin+'/'&&parsed.name==='SaNaToddler');
 }
 check('Welcome shows approved Main v1.99',(await page.locator('.preview-tag').textContent()).includes('Live')&&(await page.locator('[data-release-version]').first().textContent())==='v1.99');
 const artifacts=path.join(root,'artifacts/public-site');fs.mkdirSync(artifacts,{recursive:true});
 await page.screenshot({path:path.join(artifacts,engine+'-phone-welcome.png'),fullPage:true});
 await page.setViewportSize({width:1280,height:800});await page.screenshot({path:path.join(artifacts,engine+'-tablet-welcome.png'),fullPage:true});await page.setViewportSize({width:393,height:852});
 await page.locator('#update-app').click();await expect(page.getByRole('dialog')).toContainText('up to date');await page.getByRole('button',{name:'Got it',exact:true}).click();
 check('Update recognizes the complete independent release',await page.locator('#update-app').isEnabled());
 await page.locator('#play').click();await page.locator('[data-activity="puzzle"]').click();
 await page.locator('#puzzle-file').setInputFiles(path.join(root,'sana-puppy-green-r2-v199-192.png'));await expect(page.locator('[data-puzzle-choice]')).toHaveCount(2);
 // Windows WebKit's offline emulation also fails on the untouched approved app.
 // Block the server instead: every uncached HTTP request fails, while the real worker must serve the app.
 if(engine==='webkit')serverUnavailable=true;else await context.setOffline(true);
 await page.reload();await page.locator('[data-activity="puzzle"]').click();await expect(page.locator('[data-puzzle-choice]')).toHaveCount(2);
 check('Picture Puzzle saves a selected image across '+(engine==='webkit'?'server-unavailable':'offline')+' reload',true);
 await page.goto(origin+'/play.html?age=3');await page.locator('#more-games').click();await page.locator('[data-activity="machines"]').click();await page.locator('#glossy-look').click();
 check('Approved Machines artwork opens with '+(engine==='webkit'?'server unavailable':'the browser offline'),await page.locator('#glossy-look-image').evaluate(async image=>{await image.decode();return image.naturalWidth>0;}));
 await page.goto(origin+'/');await expect(page.locator('#play')).toBeVisible();
 check('Canonical root welcome opens with '+(engine==='webkit'?'server unavailable':'the browser offline'),true);
 serverUnavailable=false;await context.setOffline(false);await page.goto(origin+'/install-sanatoddler-v1.99.html');
 try{await page.waitForURL(origin+'/index.html',{timeout:30000});}catch(error){
  console.error('Recovery state:',await page.evaluate(()=>({url:location.href,status:document.querySelector('#progress')?.textContent,retryHidden:document.querySelector('#retry')?.hidden})));
  throw error;
 }
 check('Recovery helper reaches the independent app without a checking loop',true);
 check('Browser reports no uncaught script errors',errors.length===0);
 fs.writeFileSync(path.join(artifacts,engine+'-results.json'),JSON.stringify({engine,checks:results.length,errors,results},null,2));
})().then(()=>console.log(JSON.stringify({engine,checks:results.length,failed:0,shareOnly}))).catch(error=>{console.error(error.stack);process.exitCode=1;}).finally(async()=>{await context?.close();await browser?.close();server.closeAllConnections();server.close();});
