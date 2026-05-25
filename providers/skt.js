const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function checkSKT(browser, address) {
  const result = { provider: 'SKB', status: 'error', products: [], raw: '' };
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto('https://www.bworld.co.kr/myb/product/join/address/svcAveSearch.do', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    await wait(3000);

    // 주소 입력 (네이티브 setter 사용)
    await page.evaluate((addr) => {
      const el = document.querySelector('#inpNameStreet');
      if (!el) throw new Error('주소 입력란을 찾을 수 없습니다');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, addr);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, address);
    await wait(2000);

    // 조회 버튼 클릭
    await page.evaluate(() => {
      document.querySelector('#btnNameSearchStreet').click();
    });
    await wait(3000);

    // 주소 선택 (라디오 버튼)
    const radio = await page.$('input[type="radio"]');
    if (radio) {
      await radio.evaluate(el => el.click());
      await wait(1000);
    }

    // 상세 주소 입력
    const detailInput = await page.$('#inpDetailStreet');
    if (detailInput) {
      await detailInput.click({ clickCount: 3 });
      await detailInput.type('101호', { delay: 30 });
      await wait(500);
    }

    // 서비스 조회 버튼
    await page.evaluate(() => {
      const btn = document.querySelector('#GA_CY_MENU_C00000001');
      if (btn) { btn.click(); return; }
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.textContent.includes('서비스 조회')) { b.click(); break; }
      }
    });

    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 20000 }).catch(() => {});
    await wait(3000);

    const bodyText = await page.evaluate(() => document.body.innerText);
    result.raw = bodyText.substring(0, 3000);

    const products = [];
    const internetIdx = bodyText.indexOf('인터넷');
    const btvIdx = bodyText.indexOf('B tv');

    if (internetIdx > -1) {
      const section = bodyText.substring(internetIdx, btvIdx > -1 ? btvIdx : internetIdx + 600);
      const items = section.split('\n').map(l => l.trim())
        .filter(l => l.length > 2 && l.length < 50 && l !== '인터넷' && l !== '상품 정보 보기');
      items.forEach(name => products.push({ category: '인터넷', name }));
    }

    result.products = products;
    result.status = products.length > 0 ? 'available' : 'unavailable';
  } catch (e) {
    result.error = e.message;
  } finally {
    await page.close();
  }
  return result;
}

module.exports = { checkSKT };
