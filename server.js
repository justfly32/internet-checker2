const express = require('express');
const { checkAll } = require('./providers');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// ===== API =====
app.post('/api/check', async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: '주소를 입력해주세요.' });

  console.log(`[${new Date().toISOString()}] 조회: ${address}`);
  const start = Date.now();

  try {
    const data = await checkAll(address);

    const elapsed = Date.now() - start;
    console.log(`완료: ${elapsed}ms`);

    res.json({ ...data, elapsed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`서버: http://localhost:${PORT}`));
