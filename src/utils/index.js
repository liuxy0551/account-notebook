import Taro from '@tarojs/taro'
import { getUuid, initData, clearLocalData, clearCloudData } from './initData'
import { getFingerPrintSupport, startSoterAuthentication, cloudInit, getUpdateInfo } from './system'
import { setStorage } from './updateData'
import { getRandomPassword } from './password'

// 获取当前时间
const getTimeStr = (isDay = false) => {
    const date = new Date()
    const year = date.getFullYear() // 年
    let month = date.getMonth() + 1 // 月
    let day = date.getDate() // 日
    let hour = date.getHours() // 时
    let minute = date.getMinutes() // 分
    let second = date.getSeconds() // 秒
    month = month < 10 ? `0${ month }` : month
    day = day < 10 ? `0${ day }` : day
    hour = hour < 10 ? `0${ hour }` : hour
    minute = minute < 10 ? `0${ minute }` : minute
    second = second < 10 ? `0${ second }` : second
  
    return `${ year }-${ month }-${ day }${ isDay ? '' : ` ${ hour }:${ minute }:${ second }` }`
}

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

// 预览图片
const previewImage = (urls = [], current) => {
    if (!urls.length) return
    if (!current) current = urls[0]
    Taro.previewImage({
        urls,
        current
    })
}

// 显示分享给朋友、朋友圈
const showShareMenu = () => {
    Taro.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
    })
}

export {
    getUuid,
    showToast,
    previewImage,
    showShareMenu,
    setStorage,
    getTimeStr,
    getFingerPrintSupport,
    startSoterAuthentication,
    cloudInit,
    getUpdateInfo,
    getTopBarHeight,
    initData,
    clearLocalData,
    clearCloudData,
    getRandomPassword
}
