import CryptoJS from './lib/CryptoJS'

const key = CryptoJS.enc.Utf8.parse('0102030405060807') // 十六位十六进制数作为秘钥
const iv = CryptoJS.enc.Utf8.parse('0102030405060807') // 十六位十六进制数作为秘钥偏移量

// aes 加密
const aesEncrypt = (word) => {
    let srcs = CryptoJS.enc.Utf8.parse(word)
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return Base64Encode(encrypted.ciphertext.toString().toUpperCase())
}

// aes 解密
const aesDecrypt = (val) => {
    let word = Base64Decode(val)
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    let decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
}

// base64 加密
const Base64Encode = (val) => {
    let str = CryptoJS.enc.Utf8.parse(val)
    let base64 = CryptoJS.enc.Base64.stringify(str)
    return base64
}

// base64 解密
const Base64Decode = (val) => {
    let words = CryptoJS.enc.Base64.parse(val)
    return words.toString(CryptoJS.enc.Utf8)
}

export {
    aesEncrypt,
    aesDecrypt
}
