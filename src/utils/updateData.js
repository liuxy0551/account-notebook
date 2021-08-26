// 更新数据，开启云同步的用户更改数据后自动更新
import Taro from '@tarojs/taro'

// 保存数据 sync 为 true 时自动同步数据
const setStorage = (key = '', data = '', sync = false) => {
    return new Promise((resolve, reject) => {
        Taro.setStorage({
            key,
            data,
            success: async () => {
                if (sync) {
                    const { setBackupData } = require('./cloudSync')
                    const autoSync = Taro.getStorageSync('autoSync') === true
                    if (autoSync && ['tagList', 'accountList'].includes(key)) await setBackupData([key])
                }
                resolve(data)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

export {
    setStorage
}
