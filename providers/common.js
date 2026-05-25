const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const REGION_PATTERN = /^(서울|인천|대전|대구|부산|울산|광주|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)\s+/;

function shortenAddress(address) {
  return address
    .replace(REGION_PATTERN, '')
    .replace(/^[가-힣]+(시|군|구)\s+/, '');
}

async function setupPage(page) {
  await page.setViewport({ width: 1280, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  page.on('dialog', async dialog => { await dialog.accept(); });
}

module.exports = { wait, shortenAddress, setupPage };
