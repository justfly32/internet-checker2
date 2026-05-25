const { checkAll } = require('./providers');

// CLI 모드
if (require.main === module) {
  const address = process.argv[2];
  if (!address) {
    console.error('Usage: node checker.js "주소"');
    process.exit(1);
  }
  checkAll(address).then(r => console.log(JSON.stringify(r, null, 2)));
}

module.exports = { checkAll };
