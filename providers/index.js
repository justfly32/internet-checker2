const { checkSKT } = require('./skt');
const { checkKT } = require('./kt');
const { checkLGU } = require('./lgu');
const puppeteer = require('puppeteer');

async function checkAll(address) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security'
    ]
  });

  try {
    const [skt, kt, lgu] = await Promise.allSettled([
      checkSKT(browser, address),
      checkKT(browser, address),
      checkLGU(browser, address),
    ]);

    return {
      address,
      timestamp: new Date().toISOString(),
      results: {
        skt: skt.status === 'fulfilled' ? skt.value : { provider: 'SKB', status: 'error', error: skt.reason?.message },
        kt: kt.status === 'fulfilled' ? kt.value : { provider: 'KT', status: 'error', error: kt.reason?.message },
        lgu: lgu.status === 'fulfilled' ? lgu.value : { provider: 'LGU+', status: 'error', error: lgu.reason?.message }
      }
    };
  } finally {
    await browser.close();
  }
}

// CLI
if (require.main === module) {
  const address = process.argv[2];
  if (!address) {
    console.error('Usage: node providers/index.js "주소"');
    process.exit(1);
  }
  checkAll(address).then(r => console.log(JSON.stringify(r, null, 2)));
}

module.exports = { checkAll };
