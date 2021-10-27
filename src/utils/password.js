const strObj = {
    upper: 'ABCDEFGHIJKLMNPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    number: '1234567890',
    symbol: '~!@#$%^&*()[]{}:,./?-_+=<>'
}

/**
 * 生成随机密码
 * 1、先确定 average，平均每类选多少个字符
 * 2、remainder 剩余的从累加字符串中随机取
 * 3、使用乱序算法，打乱字符串 https://blog.csdn.net/yunlliang/article/details/41084785
 * @param {Array} 包含的项，upper 大写字母，lower 小写字母，number 数字，symbol 特殊符号  
 * @param {number} 密码长度 
 * @returns string
 */
const getRandomPassword = (arr = [], length) => {
    const average = Math.floor(length / arr.length)
    const remainder = length % arr.length

    let str = '', allStr = ''
    for (let i of arr) {
        str += getRandomStr(i, average)
    }

    arr.forEach(item => allStr += strObj[item])
    for (let i = 0; i < remainder; i++) {
        str += allStr[random(allStr.length)]
    }

    return shuffle(str.split('')).join('')
}

// 乱序算法，随机洗牌 https://blog.csdn.net/yunlliang/article/details/41084785
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
    return arr
}

// 获取固定个数的字符串
const getRandomStr = (key, average) => {
    let str = strObj[key], result = ''
    for (let i = 0; i < average; i++) {
        result += str[random(str.length)]
    }
    return result
}

/**
 * 生成范围内的随机整数
 * @param {number} max 
 * @param {number} min 
 * @returns number
 */
const random = (max, min = 0) => {
    return Math.floor(Math.random() * (max - min)) + min
}

export {
    getRandomPassword
}
