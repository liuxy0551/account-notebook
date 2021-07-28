import { Component } from 'react'
import { View } from '@tarojs/components'
import TopBar from '../../../components/TopBar/index'

import './index.scss'

export default class Home extends Component {
    state = {
        logList: [
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

        return (
            <View className='full-page'>
                <TopBar title='更新日志' />

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
            </View>
        )
    }
}
