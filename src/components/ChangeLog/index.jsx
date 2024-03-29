import { Component } from 'react'
import { AtFloatLayout } from "taro-ui"
import { View } from '@tarojs/components'

import './index.scss'

class ChangeLog extends Component {
    state = {
        logList: [
            {
                version: 'V2.0.1',
                time: '2022-11-12 20:01',
                pointList: [
                    '不使用腾讯云的云函数'
                ]
            },
            {
                version: 'V1.4.1',
                time: '2021-10-31 10:10',
                pointList: [
                    '修复选择标签后无法保存'
                ]
            },
            {
                version: 'V1.4.0',
                time: '2021-10-27 21:59',
                pointList: [
                    '新增、编辑账号页面在密码输入框附近添加一个密码浮动按钮，点击后弹出弹框，用于生成随机密码',
                    '生成随机密码'
                ]
            },
            {
                version: 'V1.3.11',
                time: '2021-10-21 20:44',
                pointList: [
                    '修复 iPhone 13 进入小程序时一直显示加载中，Face ID 的苹果手机应该有同类问题。'
                ]
            },
            {
                version: 'V1.3.10',
                time: '2021-10-20 14:49',
                pointList: [
                    'ios 端导入导出页样式修改'
                ]
            },
            {
                version: 'V1.3.9',
                time: '2021-10-17 22:34',
                pointList: [
                    '首页新增备份按钮，悬浮在添加按钮上方'
                ]
            },
            {
                version: 'V1.3.8',
                time: '2021-09-21 17:00',
                pointList: [
                    '导入导出页面，输入框占满剩余区域'
                ]
            },
            {
                version: 'V1.3.7',
                time: '2021-09-15 21:22',
                pointList: [
                    '新增 清除本地数据、清除云端数据，入口在：云同步 -> 数据管理'
                ]
            },
            {
                version: 'V1.3.6',
                time: '2021-09-12 17:36',
                pointList: [
                    '登录状态下可以进行导入导出',
                    '首页选择全部账号时，账号数量大于 10，则可以在账号列表显示数量'
                ]
            },
            {
                version: 'V1.3.5',
                time: '2021-09-11 18:40',
                pointList: [
                    '账号列表顶部添加搜索框',
                    '账号列表按时间倒序展示，新添加的在上面',
                    '新增账号页面、查询账号详情两处的标签移到备注上方',
                    '点击弹出账号详情弹框后，弹出内容可复制提示确认框，仅展示一次'
                ]
            },
            {
                version: 'V1.3.4',
                time: '2021-08-26 23:04',
                pointList: [
                    '自动同步功能支持开发者配置开启，开启后可关闭，关闭后再次开启需要联系开发者'
                ]
            },
            {
                version: 'V1.3.3',
                time: '2021-08-01 23:53',
                pointList: [
                    '代码开源',
                    'README.md'
                ]
            },
            {
                version: 'V1.3.2',
                time: '2021-08-01 21:35',
                pointList: [
                    '可以分享给朋友、朋友圈了',
                    '友情链接可以打开“记账啦”微信小程序',
                    '去除设置授权页面，无用'
                ]
            },
            {
                version: 'V1.3.1',
                time: '2021-08-01 18:02',
                pointList: [
                    '修复 更新后进入小程序跳到更新日志页面但提示指纹解锁',
                    '更新日志用弹出框显示',
                    '点击“关于”页面中的版本号，可检查更新'
                ]
            },
            {
                version: 'V1.3.0',
                time: '2021-08-01 12:39',
                pointList: [
                    '支持开发者后可以使用云同步啦~',
                    '指纹解锁可开关'
                ]
            },
            {
                version: 'V1.2.0',
                time: '2021-07-29 23:07',
                pointList: [
                    '进入小程序可以使用指纹解锁啦~'
                ]
            },
            {
                version: 'V1.1.0',
                time: '2021-07-28 22:40',
                pointList: [
                    '新增安全密码编辑页面，支持安全密码设置，打开需要输入安全密码',
                    '忘记密码，清除所有用户数据重置',
                    '检查小程序是否有更新，并提示更新',
                    '关于、更新日志'
                ]
            },
            {
                version: 'V1.0.0',
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
