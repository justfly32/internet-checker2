const express = require('express');
const { checkAll, checkProvider } = require('./providers');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const REQUEST_TIMEOUT = 120000; // 2 minutes
app.use((req, res, next) => {
  req.setTimeout(REQUEST_TIMEOUT);
  res.setTimeout(REQUEST_TIMEOUT);
  next();
});

// ===== API =====

// Check all providers (batch)
app.post('/api/check', async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: '주소를 입력해주세요.' });

  console.log(`[${new Date().toISOString()}] Batch 조회: ${address}`);
  const start = Date.now();

  try {
    const data = await checkAll(address);
    const elapsed = Date.now() - start;
    console.log(`Batch 완료: ${elapsed}ms`);
    res.json({ ...data, elapsed });
    db.save({ address, elapsed, results: data.results }).catch(e => console.error('History save error:', e.message));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Check single provider (streaming)
app.post('/api/check/:provider', async (req, res) => {
  const { address } = req.body;
  const { provider } = req.params;
  if (!address) return res.status(400).json({ error: '주소를 입력해주세요.' });
  if (!['skt', 'kt', 'lgu'].includes(provider)) {
    return res.status(400).json({ error: 'Invalid provider. Use skt, kt, or lgu.' });
  }

  console.log(`[${new Date().toISOString()}] ${provider} 조회: ${address}`);
  const start = Date.now();

  try {
    const result = await checkProvider(provider, address);
    const elapsed = Date.now() - start;
    console.log(`${provider} 완료: ${elapsed}ms`);
    res.json({ provider, result, elapsed });
  } catch (e) {
    res.status(500).json({ provider, error: e.message });
  }
});

// ===== History =====

app.get('/api/history', async (req, res) => {
  try {
    const list = await db.getAll();
    if (req.query.format === 'csv') {
      const header = 'ID,주소,조회시간,소요시간(ms),SKB,KT,LGU+\n';
      const rows = list.map(r => {
        const skt = r.results?.skt?.status || '-';
        const kt = r.results?.kt?.status || '-';
        const lgu = r.results?.lgu?.status || '-';
        const addr = `"${r.address.replace(/"/g, '""')}"`;
        return `${r.id},${addr},${r.timestamp},${r.elapsed},${skt},${kt},${lgu}`;
      }).join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="search_history.csv"');
      return res.send('\uFEFF' + header + rows);
    }
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/history/:id', async (req, res) => {
  try {
    await db.remove(Number(req.params.id));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/history', async (req, res) => {
  try {
    await db.clear();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`서버: http://localhost:${PORT}`));
