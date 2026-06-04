const { checkSKT } = require('./skt');
const { checkKT } = require('./kt');
const { checkLGU } = require('./lgu');
const puppeteer = require('puppeteer');

const BROWSER_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--disable-web-security'
];

async function withBrowser(fn) {
  const wsEndpoint = process.env.BROWSERLESS_WS_ENDPOINT;

  let browser;
  if (wsEndpoint) {
    browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });
  } else {
    browser = await puppeteer.launch({ headless: true, args: BROWSER_ARGS });
  }

  try {
    return await fn(browser);
  } finally {
    try { await browser.close(); } catch (e) { /* ignore */ }
  }
}

async function withRetryResult(fn, retries = 1) {
  const result = await fn();
  if (result.status === 'error' && retries > 0) {
    console.log(`Retrying ${result.provider || 'provider'} after error: ${result.error}`);
    await new Promise(r => setTimeout(r, 2000));
    return withRetryResult(fn, retries - 1);
  }
  return result;
}

async function checkProvider(provider, address) {
  const checker = { skt: checkSKT, kt: checkKT, lgu: checkLGU }[provider];
  if (!checker) throw new Error(`Unknown provider: ${provider}`);

  return withBrowser(async (browser) => {
    return withRetryResult(() => checker(browser, address), 1);
  });
}

async function checkAll(address) {
  return withBrowser(async (browser) => {
    const [skt, kt, lgu] = await Promise.allSettled([
      withRetryResult(() => checkSKT(browser, address), 1),
      withRetryResult(() => checkKT(browser, address), 1),
      withRetryResult(() => checkLGU(browser, address), 1),
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
  });
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

module.exports = { checkAll, checkProvider };
