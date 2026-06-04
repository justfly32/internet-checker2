const path = require('path');
const fs = require('fs');

const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY;

let db;
if (useSupabase) {
  const { createClient } = require('@supabase/supabase-js');
  db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
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
    const Database = require('better-sqlite3');
    const dbPath = path.join(__dirname, 'data', 'history.db');
    const sqlite = new Database(dbPath);
    sqlite.pragma('encoding = "UTF-8"');
    sqlite.exec(`CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL COLLATE NOCASE,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      elapsed INTEGER,
      results TEXT
    )`);
    const stmt = sqlite.prepare('INSERT INTO search_history (address, elapsed, results) VALUES (?, ?, ?)');
    stmt.run(entry.address, entry.elapsed, JSON.stringify(entry.results));
    sqlite.close();
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
    const Database = require('better-sqlite3');
    const dbPath = path.join(__dirname, 'data', 'history.db');
    const sqlite = new Database(dbPath);
    sqlite.pragma('encoding = "UTF-8"');
    sqlite.exec(`CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL COLLATE NOCASE,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      elapsed INTEGER,
      results TEXT
    )`);
    const rows = sqlite.prepare('SELECT * FROM search_history ORDER BY id DESC LIMIT 100').all();
    sqlite.close();
      return rows.map(r => ({ ...r, results: JSON.parse(r.results) }));
  }
}

async function clear() {
  if (useSupabase) {
    const { error } = await db.from('search_history').delete().neq('id', 0);
    if (error) throw new Error(error.message);
  } else {
    const Database = require('better-sqlite3');
    const dbPath = path.join(__dirname, 'data', 'history.db');
    const sqlite = new Database(dbPath);
    sqlite.pragma('encoding = "UTF-8"');
    sqlite.exec('DELETE FROM search_history');
    sqlite.close();
  }
}

module.exports = { save, getAll, clear };
