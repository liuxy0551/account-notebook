
/**
 * 获取小程序更新信息
 */
import Taro from '@tarojs/taro'
import { getTimeStr, setStorage } from './index'

// 获取本机支持的 SOTER 生物认证方式 - 仅查询是否支持指纹识别
const getFingerPrintSupport = () => {
    return new Promise((resolve) => {
        const fingerPrintSupport = Taro.getStorageSync('fingerPrintSupport') || false
        if (fingerPrintSupport) return resolve(fingerPrintSupport)
        Taro.checkIsSupportSoterAuthentication({
            success: (res) => {
                if (!res?.supportMode.includes('fingerPrint')) return
                Taro.checkIsSoterEnrolledInDevice({
                    checkAuthMode: 'fingerPrint',
                    success: (result) => {
                        setStorage('fingerPrintSupport', result.isEnrolled)
                        resolve(result.isEnrolled)
                    },
                    fail: (err) => {
                        console.log('checkIsSoterEnrolledInDevice', err)
                        setStorage('fingerPrintSupport', false)
                        resolve(false)
                    }
                })
            },
            fail: (err) => {
                console.log('checkIsSupportSoterAuthentication', err)
                setStorage('fingerPrintSupport', false)
                resolve(false)
            }
        })
    })
}

// 开始 SOTER 生物认证
const startSoterAuthentication = () => {
    return new Promise((resolve) => {
        Taro.startSoterAuthentication({
            requestAuthModes: ['fingerPrint'],
            challenge: getTimeStr(),
            authContent: '请用指纹解锁',
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                console.log('startSoterAuthentication', err)
                resolve(err)
            }
        })
    })
}

// 云开发初始化
const cloudInit = () => {
    Taro.cloud.init({
        env: 'prod-3g3ayg0q48089ea7',
        traceUser: true
    })
}

// 检测小程序更新
const getUpdateInfo = () => {
    if (!Taro.canIUse('getUpdateManager')) return
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(res => {
        // console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (!res.hasUpdate) return
        // console.log('res.hasUpdate====')
        updateManager.onUpdateReady(() => {
            Taro.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: ({ confirm }) => {
                    // console.log('success====', result)
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    confirm && updateManager.applyUpdate()
                }
            })
        })
        updateManager.onUpdateFailed(() => {
            // 新的版本下载失败
            Taro.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
        })
    })
}

export {
    getFingerPrintSupport,
    startSoterAuthentication,
    cloudInit,
    getUpdateInfo
}
