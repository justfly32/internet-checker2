const path = require('path');
const fs = require('fs');

const useSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_KEY);

console.log('DB mode:', useSupabase ? 'Supabase' : 'SQLite (local)');

let db;
if (useSupabase) {
  const { createClient } = require('@supabase/supabase-js');
  db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

function getSqlite() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  let Database;
  try {
    Database = require('better-sqlite3');
  } catch {
    console.error('better-sqlite3 not installed, history disabled');
    return null;
  }
  const sqlite = new Database(path.join(dataDir, 'history.db'));
  sqlite.pragma('encoding = "UTF-8"');
  sqlite.exec(`CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT NOT NULL COLLATE NOCASE,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    elapsed INTEGER,
    results TEXT
  )`);
  return sqlite;
}

async function save(entry) {
  if (useSupabase) {
    const { error } = await db.from('search_history').insert({
      address: entry.address,
      elapsed: entry.elapsed,
      results: entry.results
    });
    if (error) console.error('Supabase save error:', error.message);
  } else {
    const sqlite = getSqlite();
    if (!sqlite) return;
    try {
      sqlite.prepare('INSERT INTO search_history (address, elapsed, results) VALUES (?, ?, ?)')
        .run(entry.address, entry.elapsed, JSON.stringify(entry.results));
    } finally {
      sqlite.close();
    }
  }
}

async function getAll() {
  if (useSupabase) {
    const { data, error } = await db.from('search_history')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data || [];
  } else {
    const sqlite = getSqlite();
    if (!sqlite) return [];
    try {
      const rows = sqlite.prepare('SELECT * FROM search_history ORDER BY id DESC LIMIT 100').all();
      return rows.map(r => ({ ...r, results: JSON.parse(r.results) }));
    } finally {
      sqlite.close();
    }
  }
}

async function clear() {
  if (useSupabase) {
    const { error } = await db.from('search_history').delete().neq('id', 0);
    if (error) throw new Error(error.message);
  } else {
    const sqlite = getSqlite();
    if (!sqlite) return;
    try {
      sqlite.exec('DELETE FROM search_history');
    } finally {
      sqlite.close();
    }
  }
}

async function remove(id) {
  if (useSupabase) {
    const { error } = await db.from('search_history').delete().eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const sqlite = getSqlite();
    if (!sqlite) return;
    try {
      sqlite.prepare('DELETE FROM search_history WHERE id = ?').run(id);
    } finally {
      sqlite.close();
    }
  }
}

module.exports = { save, getAll, clear, remove };
