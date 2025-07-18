// src/api/kic.routes.js

const express = require('express');
const router = express.Router();
const kicController = require('../controllers/kic.controller');

// GET /kic-data?id=... というリクエストに対応
router.get('/', kicController.getKicData);

// ★重要: 作成したルーターをエクスポートする
module.exports = router;