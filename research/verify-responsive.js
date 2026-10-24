async (page) => {
  await page.setViewportSize({width:1440,height:1000});
  await page.waitForSelector('.person-label');
  await page.waitForFunction(()=>!document.querySelector('.scene-loading'));
  const desktop=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,characters:document.querySelectorAll('.person-label').length}));
  await page.screenshot({path:'C:/Users/kyuhy/AI-auto-work/output/desktop-verified.png'});
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>innerWidth===390);
  const mobile=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,textarea:!!document.querySelector('textarea'),characters:document.querySelectorAll('.person-label').length}));
  await page.screenshot({path:'C:/Users/kyuhy/AI-auto-work/output/mobile-verified.png',fullPage:true});
  await page.getByRole('button',{name:'설정',exact:true}).click();
  await page.locator('#project-path').fill('C:\\Users\\kyuhy\\AI-auto-work\\examples\\studio-brief');
  await page.getByRole('button',{name:'프로젝트 연결',exact:true}).click();
  await page.waitForFunction(()=>!document.querySelector('[role="dialog"]'));
  const project=await page.locator('.project-footer').innerText();
  await page.setViewportSize({width:1440,height:1000});
  return {desktop,mobile,project};
}
