import { Component } from 'react'
import { AtFloatLayout } from "taro-ui"
import { View } from '@tarojs/components'

import './index.scss'

class ChangeLog extends Component {
    state = {
        logList: [
            {
                version: 'v1.3.2',
                time: '2021-08-01 21:35',
                pointList: [
                    '可以分享给朋友、朋友圈了',
                    '友情链接可以打开“记账啦”微信小程序',
                    '去除设置授权页面，无用'
                ]
            },
            {
                version: 'v1.3.1',
                time: '2021-08-01 18:02',
                pointList: [
                    '修复 更新后进入小程序跳到更新日志页面但提示指纹解锁',
                    '更新日志用弹出框显示',
                    '点击“关于”页面中的版本号，可检查更新'
                ]
            },
            {
                version: 'v1.3.0',
                time: '2021-08-01 12:39',
                pointList: [
                    '支持开发者后可以使用云同步啦~',
                    '指纹解锁可开关'
                ]
            },
            {
                version: 'v1.2.0',
                time: '2021-07-29 23:07',
                pointList: [
                    '进入小程序可以使用指纹解锁啦~'
                ]
            },
            {
                version: 'v1.1.0',
                time: '2021-07-28 22:40',
                pointList: [
                    '新增安全密码编辑页面，支持安全密码设置，打开需要输入安全密码',
                    '忘记密码，清除所有用户数据重置',
                    '检查小程序是否有更新，并提示更新',
                    '关于、更新日志'
                ]
            },
            {
                version: 'v1.0.0',
                time: '2021-07-25 15:39',
                pointList: [
                    '标签管理、账号管理等基础功能'
                ]
            }
        ]
    }
  
    render() {
        const { logList } = this.state
        const { logVisible, onClose } = this.props
        
        return (
            <AtFloatLayout title='更新日志' isOpened={logVisible} onClose={onClose}>
                <View className='log-container'>
                    <View className='log-box'>
                        {
                            logList.map(log => (
                                <View className='log-item' key={log.version}>
                                    <View className='version'>{ log.version }</View>
                                    <View className='time'>{ log.time }</View>
                                    <View className='point-box'>
                                        {
                                            log.pointList.map((point, idx) => (
                                                <View className='point-item' key={idx}>{ idx + 1 }、{ point }</View>
                                            ))
                                        }
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </AtFloatLayout>
        )
    }
}

export default ChangeLog
