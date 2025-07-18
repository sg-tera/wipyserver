// src/controllers/setting.controller.js

const dataService = require('../services/data.service');

async function updateAllSettings(req, res) {
    console.log('--- [Controller] Received request to update settings ---'); // ★追加
    try {
        const deviceId = req.params.deviceId;
        const settingsData = req.body;
        console.log(`[Controller] Device ID: ${deviceId}`); // ★追加

        if (!deviceId) {
            return res.status(400).send('Device ID is required in URL.');
        }

        console.log('[Controller] Calling dataService.replaceAllSettings...'); // ★追加
        const result = dataService.replaceAllSettings(deviceId, settingsData);
        console.log('[Controller] Service returned:', result); // ★追加

        if (result.success) {
            console.log('[Controller] Sending success response.'); // ★追加
            res.status(200).json({ message: `Settings for device ${deviceId} updated successfully.` });
        } else {
            console.log('[Controller] Sending failure response.'); // ★追加
            res.status(500).json({ message: 'Failed to update settings.', error: result.error });
        }
    } catch (error) {
        console.error('[Controller] Uncaught error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { updateAllSettings };