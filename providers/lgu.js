const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function checkLGU(browser, address) {
  const result = { provider: 'LGU+', status: 'error', products: [], raw: '' };
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    page.on('dialog', async dialog => { await dialog.accept(); });

    await page.goto('https://www.lguplus.com/support/online/coverage-check', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    await wait(3000);

    // 주소 입력 (시/군/구 제거, 동/면/읍 + 번지만 남김)
    const shortAddr = address
      .replace(/^(서울|인천|대전|대구|부산|울산|광주|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)\s+/, '')
      .replace(/^[가-힣]+(시|군|구)\s+/, '');
    await page.evaluate((addr) => {
      const el = document.querySelector('input.c-inp[placeholder*="도로명"]');
      if (!el) throw new Error('주소 입력란을 찾을 수 없습니다');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, addr);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, shortAddr);
    await wait(1000);

    // 주소 검색
    await page.evaluate(() => {
      const btn = document.querySelector('button.c-ibtn-find');
      if (btn) btn.click();
    });
    await wait(4000);

    // 첫 번째 주소 선택
    await page.evaluate(() => {
      const radios = document.querySelectorAll('input[type="radio"]');
      for (const r of radios) { if (r.offsetParent !== null) { r.click(); break; } }
    });
    await wait(1500);

    // 상세 주소 필드 채우기
    await page.evaluate(() => {
      const fields = ['#tiBldNm', '#tiDong', '#tiFlr', '#tiHo'];
      fields.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, '101');
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });
    await wait(500);

    // 조회 버튼 (MouseEvent로 클릭)
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.textContent.trim() === '조회' && b.offsetParent !== null) {
          b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          break;
        }
      }
    });
    await wait(6000);

    const bodyText = await page.evaluate(() => document.body.innerText);
    result.raw = bodyText.substring(0, 3000);

    // 결과 파싱
    const available = bodyText.includes('서비스를 이용하실 수 있습니다');
    const noResult = bodyText.includes('검색결과가 없습니다');

    if (available) {
      result.status = 'available';
      const startMarkers = ['U+기가', '스마트 기가', '스마트 광랜'];
      for (const m of startMarkers) {
        const idx = bodyText.indexOf(m);
        if (idx > -1) {
          const endIdx = bodyText.indexOf('IPTV', idx);
          const section = bodyText.substring(idx, endIdx > -1 ? endIdx : idx + 200);
          const items = section.split('\n').map(l => l.trim())
            .filter(l => l.length > 2 && l.length < 40 && !l.includes('신청'));
          items.forEach(name => result.products.push({ category: '인터넷', name }));
          break;
        }
      }
    } else if (noResult) {
      result.status = 'unavailable';
    } else {
      result.status = 'unavailable';
    }
  } catch (e) {
    result.error = e.message;
  }
  try { await page.close(); } catch (e) {}
  return result;
}

module.exports = { checkLGU };
