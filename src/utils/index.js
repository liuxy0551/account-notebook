import Taro from '@tarojs/taro'
import { getUuid, initTagList } from './initData'
import { setStorage } from './updateData'

// 获取自定义状态栏高度
const getTopBarHeight = () => {
    const { top: menuTop, height: menuHeight } = Taro.getMenuButtonBoundingClientRect() // 胶囊按钮

    return { menuTop, menuHeight } // 胶囊到顶部的距离, 胶囊高度
}

// toast
const showToast = (title, duration = 1500) => {
    return new Promise((resolve, reject) => {
        Taro.showToast({
            title,
            icon: 'none',
            duration,
            success: () => {
                setTimeout(() => {
                    Taro.hideToast()
                    resolve()
                }, duration)
            },
            fail: (err) => {
                Taro.hideToast()
                reject(err)
            }
        })
    })
}

export {
    getUuid,
    showToast,
    setStorage,
    getTopBarHeight,
    initTagList,
}
