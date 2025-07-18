require('dotenv').config();
const express = require('express');
const kicRoutes = require('./src/api/kic.routes');
const settingRoutes = require('./src/api/setting.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // JSONボディをパースするためのミドルウェア
app.use(express.static('public')); // publicディレクトリを静的ファイルとして提供

// ルートの設定
app.use('/kic-data', kicRoutes);
app.use('/api/settings', settingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
