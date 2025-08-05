/*
 * KIC Protocol V3 に従って、スケジュールJSONをKICプロトコル文字列に変換する関数
 * @param {object} integratedData - 内部で統合されたスケジュールデータ
 * @returns {string} KICプロトコル V3 文字列
 */
function convertJsonToKicWithOrder(integratedData) {
    const now = new Date();

    // 1. [送信曜日][送信時刻] フィールドを生成
    const dayOfWeek = now.getDay(); // 日曜=0, 月曜=1, ...
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const transmissionHeader = `${dayOfWeek}${hours}${minutes}`;

    // 2. [黒板長さ] フィールドを生成
    let dimensionsBlock = '00000000'; // データがない場合のデフォルト値
    if (integratedData.dimensions && integratedData.dimensions.width && integratedData.dimensions.height) {
        dimensionsBlock = `${String(integratedData.dimensions.width).padStart(4, '0')}${String(integratedData.dimensions.height).padStart(4, '0')}`;
    }

    // 3. [スケジュールブロック] を曜日番号6->0の降順で生成
    const scheduleBlocks = [];
    const dayOrder = [
        { key: 'sat', symbol: 6 },
        { key: 'fri', symbol: 5 },
        { key: 'thu', symbol: 4 },
        { key: 'wed', symbol: 3 },
        { key: 'tue', symbol: 2 },
        { key: 'mon', symbol: 1 },
        { key: 'sun', symbol: 0 }
    ];

    for (const dayInfo of dayOrder) {
        if (integratedData.schedules && integratedData.schedules[dayInfo.key] && integratedData.schedules[dayInfo.key].length > 0) {
            const timesStr = integratedData.schedules[dayInfo.key].join('');
            scheduleBlocks.push(`${dayInfo.symbol}${timesStr}`);
        }
    }

    // 4. 全てのフィールドを ';' で結合
    const parts = [
        'KIC:V3',
        transmissionHeader,
        dimensionsBlock,
        ...scheduleBlocks
    ];
    const kicString = `${parts.join(';')};/`;

    return kicString;
}

module.exports = {
    convertJsonToKicWithOrder
};