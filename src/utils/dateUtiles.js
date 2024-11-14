// 处理日期的工具类

/**
 * 比较两个日期是否是同一天
 * @param {string|Date} date1 日期1
 * @param {string|Date} date2 日期2
 * @returns {boolean} 是否同一天
 */
export const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

/**
 * 格式化日期为 'YYYY-MM-DD'
 * @param {string|Date} date 日期
 * @returns {string} 格式化后的日期
 */
export const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * 获取当前日期的 'YYYY-MM-DD' 格式
 * @returns {string} 当前日期
 */
export const getCurrentDate = () => {
    return formatDate(new Date());
}


/**
 * 将时间戳转为指定格式的日期字符串（默认格式：YYYY-MM-DD）
 * @param {number} timestamp 时间戳
 * @param {string} format 格式化字符串，默认为 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
export const timestampToDate = (timestamp, format = 'YYYY-MM-DD') => {
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
}

