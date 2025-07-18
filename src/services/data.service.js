// src/services/data.service.js

const db = require('./database.service');

// ... (getIntegratedData 関数は変更なし) ...
function getIntegratedData(deviceId) {
    // Promiseを返すことで、非同期処理の結果を待ちやすくします
    return new Promise((resolve, reject) => {
        try {
            const schedules = db.prepare('SELECT day_of_week, time FROM schedules WHERE device_id = ?').all(deviceId);
            const dims = db.prepare('SELECT width, height FROM dimensions WHERE device_id = ?').get(deviceId);
            const integratedData = {
                schedules: {},
                dimensions: dims || null
            };
            schedules.forEach(row => {
                if (!integratedData.schedules[row.day_of_week]) {
                    integratedData.schedules[row.day_of_week] = [];
                }
                integratedData.schedules[row.day_of_week].push(row.time);
            });
            resolve(integratedData);
        } catch (err) {
            reject(err);
        }
    });
}

function replaceAllSettings(deviceId, settings) {
    console.log(`[Service] Replacing settings for device ${deviceId}...`); // ★追加
    const replace = db.transaction(() => {
        console.log('[Service] Starting transaction...'); // ★追加
        db.prepare('DELETE FROM schedules WHERE device_id = ?').run(deviceId);
        db.prepare('DELETE FROM dimensions WHERE device_id = ?').run(deviceId);
        console.log('[Service] Old data deleted.'); // ★追加

        if (settings.schedules) {
            const stmtSchedules = db.prepare('INSERT INTO schedules (device_id, day_of_week, time) VALUES (?, ?, ?)');
            for (const day in settings.schedules) {
                settings.schedules[day].forEach(time => {
                    stmtSchedules.run(deviceId, day, time);
                });
            }
            console.log('[Service] New schedules inserted.'); // ★追加
        }
        if (settings.dimensions) {
            const stmtDimensions = db.prepare('INSERT INTO dimensions (device_id, width, height) VALUES (?, ?, ?)');
            stmtDimensions.run(deviceId, settings.dimensions.width, settings.dimensions.height);
            console.log('[Service] New dimensions inserted.'); // ★追加
        }
    });

    try {
        replace();
        console.log(`[Service] Transaction successful for device ${deviceId}.`); // ★追加
        return { success: true };
    } catch (err) {
        console.error("[Service] Transaction failed:", err); // ★追加
        return { success: false, error: err.message };
    }
}

module.exports = {
    getIntegratedData,
    replaceAllSettings
};