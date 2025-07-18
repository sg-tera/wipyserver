/**
 * スケジュールJSONを、指定された降順でKICプロトコル文字列に変換する関数
 * @param {object} integratedData - 内部で統合されたスケジュールデータ
 * @returns {string} 順序制御されたKICプロトコル文字列
 */
function convertJsonToKicWithOrder(integratedData) {
    // 送信時刻をHHMM形式で生成
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const transmissionTime = `${hours}${minutes}`;

    const scheduleBlocks = [];

    // KICプロトコルで定められた曜日記号と、対応するデータキーの降順リスト
    const dayOrder = [
        // { symbol: 9, key: 'extra' },
        // { symbol: 8, key: 'undefined' },
        { symbol: 7, key: 'dimensions' },
        { symbol: 6, key: 'sat' },
        { symbol: 5, key: 'fri' },
        { symbol: 4, key: 'thu' },
        { symbol: 3, key: 'wed' },
        { symbol: 2, key: 'tue' },
        { symbol: 1, key: 'mon' },
        { symbol: 0, key: 'sun' }
    ];

    // 固定された降順リストに従ってループ処理
    for (const dayInfo of dayOrder) {
        let blockContent = '';

        if (dayInfo.symbol === 7) {
            if (integratedData.dimensions && integratedData.dimensions.width && integratedData.dimensions.height) {
                blockContent = `${integratedData.dimensions.width}${integratedData.dimensions.height}`;
            }
        } else {
            if (integratedData.schedules && integratedData.schedules[dayInfo.key] && integratedData.schedules[dayInfo.key].length > 0) {
                blockContent = integratedData.schedules[dayInfo.key].join('');
            }
        }

        if (blockContent) {
            scheduleBlocks.push(`${dayInfo.symbol}${blockContent}`);
        }
    }

    const kicString = `KIC:V1;${transmissionTime};${scheduleBlocks.join(';')};/`;
    return kicString;
}

// ★重要：関数をオブジェクトに含めてエクスポートする
module.exports = {
    convertJsonToKicWithOrder
};