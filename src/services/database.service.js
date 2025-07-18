// src/services/database.service.js

const Database = require('better-sqlite3');
const fs = require('fs');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || './db/database.sqlite';

// DBファイルが存在するか確認
const dbExists = fs.existsSync(DB_PATH);

// DBに接続
const db = new Database(DB_PATH, { verbose: console.log });

// もしDBファイルが存在しなかった場合、テーブルを作成
if (!dbExists) {
	console.log('Creating new database file and schema...');
	const schema = fs.readFileSync('./db/schema.sql', 'utf8');
	db.exec(schema);
	console.log('Database tables created successfully.');
}

// プロセス終了時にDB接続を閉じる
process.on('exit', () => db.close());

module.exports = db;