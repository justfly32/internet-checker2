const { wait, shortenAddress, setupPage, setNativeValue } = require('./common');

async function checkKT(browser, address) {
  const result = { provider: 'KT', status: 'error', products: [], raw: '' };
  const page = await browser.newPage();
  try {
    await setupPage(page);

    await page.goto('https://help.kt.com/serviceinfo/AddrSearchList.do', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    await wait(2000);

    const shortAddr = shortenAddress(address);
    await page.evaluate((addr) => {
      const el = document.querySelector('#searchFindNm');
      if (!el) throw new Error('주소 입력란을 찾을 수 없습니다');
      setNativeValue(el, addr);
    }, shortAddr);
    await wait(1000);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 20000 }).catch(() => {}),
      page.evaluate(() => document.querySelector('#search')?.click())
    ]);

    await wait(1000);
    const afterSearch = await page.evaluate(() => document.body.innerText);
    if (afterSearch.includes('검색된 주소가 없습니다')) {
      result.status = 'unknown';
      result.raw = afterSearch.substring(0, 3000);
      await page.close();
      return result;
    }

    await page.waitForSelector('#choice-1', { timeout: 10000 }).catch(() => {});
    await page.evaluate(() => {
      const radio = document.querySelector('#choice-1');
      if (radio) radio.click();
    });
    await wait(1500);

    await page.evaluate(() => {
      const el = document.querySelector('#bldgNmDetail');
      if (el) {
        setNativeValue(el, '101호');
      }
    });
    await wait(500);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 20000 }).catch(() => {}),
      page.evaluate(() => document.querySelector('#detailSearch')?.click())
    ]);

    await wait(3000);

    const hasChoiceSearch = await page.$('input[name="choiceSearch"]');
    if (hasChoiceSearch) {
      await page.evaluate(() => {
        const radios = document.querySelectorAll('input[name="choiceSearch"]');
        if (radios.length > 0) radios[0].click();
      });
      await wait(500);

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 20000 }).catch(() => {}),
        page.click('#choiceChk')
      ]);
      await wait(3000);
    }

    const finalUrl = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText);
    result.raw = bodyText.substring(0, 3000);

    if (finalUrl.includes('SearchServiceResultByAddr') && bodyText.includes('이용 가능한 상품을 안내해 드립니다')) {
      result.status = 'available';

      const startIdx = bodyText.indexOf('이용 가능한 상품을 안내해 드립니다');
      const endIdx = bodyText.indexOf('IPTV', startIdx);
      const section = bodyText.substring(startIdx, endIdx > -1 ? endIdx : startIdx + 1000);
      const lines = section.split('\n').map(l => l.trim()).filter(l => l.length > 2);

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('인터넷 ')) {
          const speed = (i + 1 < lines.length) ? ' ' + lines[i + 1] : '';
          result.products.push({ category: '인터넷', name: lines[i] + speed });
        }
      }
    } else if (bodyText.includes('이용 가능한 상품이 없습니다')) {
      result.status = 'unknown';
    } else if (bodyText.includes('조회 결과') && !bodyText.includes('검색된 주소가 없습니다')) {
      result.status = 'available';
    } else {
      result.status = 'unknown';
    }
  } catch (e) {
    result.error = e.message;
  }
  try { await page.close(); } catch (e) {}
  return result;
}

module.exports = { checkKT };
