const puppeteer = require('puppeteer');
 
(async () => {
  const browser = await puppeteer.launch({slowMo:5,headless:true});
  const page = await browser.newPage();
  page.on('console', console.log)
  await page.goto('http://teletal.hu/etlap');
  var info = await page.$('.ar .info');
  await info.click();
  console.log(await page.waitForSelector(".osszetevok_cim"));
  console.log(await page.evaluate(() => {
	console.log(document.getElementsByClassName("osszetevok_cim").length);
	return "adsfdsf";
  }))
  await browser.close();
})();