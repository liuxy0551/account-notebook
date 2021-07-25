import { Component } from 'react'
import Taro from '@tarojs/taro'
import './app.scss'

class App extends Component {
    componentDidMount() {
      this.getUpdateInfo()
    }

    // 检测小程序更新
    getUpdateInfo() {
        if (Taro.canIUse('getUpdateManager')) {
            const updateManager = Taro.getUpdateManager()
            updateManager.onCheckForUpdate(res => {
                // console.log('onCheckForUpdate====', res)
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
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
                }
            })
        }
    }

    // this.props.children 是将要会渲染的页面
    render() {
        return this.props.children
    }
}

export default App
