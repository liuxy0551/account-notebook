
/**
 * 获取小程序更新信息
 */
import Taro from '@tarojs/taro'

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
                success: (result) => {
                    // console.log('success====', result)
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    result.confirm && updateManager.applyUpdate()
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
    getUpdateInfo
}
