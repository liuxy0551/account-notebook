// 更新数据，开启云同步的用户更改数据后自动更新
import Taro from '@tarojs/taro'

// 保存数据
const setStorage = (key = '', data = '') => {
    return new Promise((resolve, reject) => {
        Taro.setStorage({
            key,
            data,
            success: () => {
                resolve()
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
