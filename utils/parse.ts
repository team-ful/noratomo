/**
 * genderを文字列に変換する
 *
 * @param {number} g - gender
 * @returns {string} - 文字列化した性別
 */
export function parseGender(g: number) {
  switch (g) {
    case 1:
      return '男性';
    case 2:
      return '女性';
    case 3:
      return 'その他';
    default:
      return '不明';
  }
}

/**
 * 日時をパースする
 *
 * @param {Date} date - date
 * @param {boolean} isAmbiguous - 曖昧にするかどうか
 * @returns {string} - パースした日時
 */
export function parseDate(date: Date, isAmbiguous = false): string {
  const week = ['日', '月', '火', '水', '木', '金', '土'];

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const weekDay = week[date.getDay()];
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();

  if (isAmbiguous) {
    return `${month}月${day}日${weekDay}曜日 ${hour}時ごろ`;
  }

  return `${year}年${month}月${day}日${weekDay}曜日 ${hour}:${(
    '00' + minutes
  ).slice(-2)}`;
}

/**
 * 相対日時をパースする
 *
 * @param {Date} date - date
 * @returns {string} - パースした日時
 */
export function parseElapsedDate(date: Date): string {
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 3600) {
    return `${Math.floor(diffSec / 60)}分前`;
  } else if (diffSec < 86400) {
    return `${Math.floor(diffSec / 3600)}時間前`;
  } else if (diffSec < 86400 * 7) {
    return `${Math.floor(diffSec / 86400)}日前`;
  } else if (diffSec < 86400 * 30) {
    return `${Math.floor(diffSec / (86400 * 7))}週間前`;
  } else {
    return `${Math.floor(diffSec / (86400 * 30))}ヶ月以上前`;
  }
}

/**
 * input dateの形式に変換する
 * https://qiita.com/udon_tengoku/items/56ceda76d187404ecfc5
 *
 * @param {Date} targetDate - ターゲット
 * @param {boolean} isIncludeTime - 時刻も含めるかどうか
 * @returns {string} - パースされた日時
 */
export function dateString(targetDate: Date, isIncludeTime = false): string {
  const year = targetDate.getFullYear();
  const month = ('0' + (targetDate.getMonth() + 1)).slice(-2);
  const date = ('0' + targetDate.getDate()).slice(-2);
  let result = year + '-' + month + '-' + date;

  if (isIncludeTime) {
    const hours = ('0' + targetDate.getHours()).slice(-2);
    const minutes = ('0' + targetDate.getMinutes()).slice(-2);
    result += 'T' + hours + ':' + minutes;
  }

  return result;
}
