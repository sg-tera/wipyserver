const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');

// デバイスIDを指定して、全ての設定を一度に更新する
router.post('/:deviceId', settingController.updateAllSettings);

module.exports = router;