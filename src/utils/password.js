// import Taro from '@tarojs/taro'

const strObj = {
    upper: 'ABCDEFGHIJKLMNPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    number: '1234567890',
    symbol: '~!@#$%^&*()[]{}:,./?-_+=<>'
}

/**
 * 生成随机密码
 * @param {Array} 包含的项，upper 大写字母，lower 小写字母，number 数字，symbol 特殊符号  
 * @param {number} 密码长度 
 * @returns string
 */
const getRandomPassword = async (arr = [], length) => {
    let str = '', result = ''
    arr.forEach(item => str += strObj[item])
    for (let i = 0; i < length; i++) {
        result += str[random(str.length)]
    }
    console.log(222, result)
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
