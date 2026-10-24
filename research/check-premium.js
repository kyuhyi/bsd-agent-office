async (page) => {
 await page.setViewportSize({width:1600,height:1000});
 await page.waitForSelector('.person-label',{timeout:60000});
 await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraReady==='true');
 await page.screenshot({path:'C:/Users/kyuhy/AI-auto-work/output/premium-browser-stage.png'});
 return await page.evaluate(()=>({labels:document.querySelectorAll('.person-label').length,fallback:document.querySelector('.scene-fallback')?.textContent,canvases:document.querySelectorAll('canvas').length}));
}
