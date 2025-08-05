// src/controllers/setting.controller.js

const dataService = require('../services/data.service');

async function updateAllSettings(req, res) {
    try {
        const deviceId = parseInt(req.params.deviceId, 10);
        // リクエストの本体（body）からJSONデータを取得
        const settingsData = req.body;

        if (!deviceId && deviceId !== 0) {
            return res.status(400).send('Device ID is required in URL and must be a number.');
        }

        // 取得した deviceId と settingsData をサービスに渡して処理を依頼
        const result = dataService.replaceAllSettings(deviceId, settingsData);

        if (result.success) {
            res.status(200).json({ message: `Settings for device ${deviceId} updated successfully.` });
        } else {
            res.status(500).json({ message: 'Failed to update settings.', error: result.error });
        }
    } catch (error) {
        console.error('Error in updateAllSettings:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    updateAllSettings
};