// src/services/data.service.js

const db = require('./database.service');

function replaceAllSettings(deviceId, settings) {
    try {
        const replace = db.transaction(() => {
            db.prepare('DELETE FROM schedules WHERE device_id = ?').run(deviceId);
            db.prepare('DELETE FROM dimensions WHERE device_id = ?').run(deviceId);
            if (settings.dimensions) {
                const stmtDimensions = db.prepare('INSERT INTO dimensions (device_id, width, height) VALUES (?, ?, ?)');
                stmtDimensions.run(deviceId, settings.dimensions.width, settings.dimensions.height);
            }
            if (settings.schedules) {
                const stmtSchedules = db.prepare('INSERT INTO schedules (device_id, day_of_week, time) VALUES (?, ?, ?)');
                for (const day in settings.schedules) {
                    // 空の時間を除外してからDBに保存
                    const validTimes = settings.schedules[day].filter(time =>
                        time && time.trim() !== '' && time.length === 4
                    );
                    validTimes.forEach(time => {
                        stmtSchedules.run(deviceId, day, time);
                    });
                }
            }
        });
        replace();
        return { success: true };
    } catch (err) {
        console.error("Failed to replace settings:", err);
        return { success: false, error: err.message };
    }
}

// DBからデータを取得し、KIC変換に適した中間オブジェクトを組み立てる関数
function getIntegratedData(deviceId) {
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

module.exports = {
    getIntegratedData,
    replaceAllSettings
};