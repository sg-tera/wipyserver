// src/controllers/kic.controller.js

const dataService = require('../services/data.service');
const { convertJsonToKicWithOrder } = require('../utils/kic-converter');

async function getKicData(req, res) {
    try {
        const deviceId = req.query.id;
        if (!deviceId) {
            return res.status(400).send('Device ID is required');
        }

        const integratedData = await dataService.getIntegratedData(deviceId);
        const kicString = convertJsonToKicWithOrder(integratedData);

        res.set('Content-Type', 'text/plain');
        res.status(200).send(kicString);
    } catch (error) {
        console.error('Error in getKicData:', error);
        res.status(500).send('Internal Server Error');
    }
}

// ★重要: 関数をオブジェクトに含めてエクスポートする
module.exports = {
    getKicData
};