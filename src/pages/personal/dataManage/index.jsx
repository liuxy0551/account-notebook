import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import TopBar from '../../../components/TopBar/index'
import { clearLocalData, clearCloudData, showToast } from '../../../utils'

import './index.scss'

export default class Home extends Component {
    state = {
    }

    // 清除本地数据
    handleClearLocal = () => {
        Taro.showModal({
            cancelColor: '#333',
            confirmColor: '#999',
            content: `清除本地数据后只能从云端下载数据或手动新增数据，是否确定？`,
            success: ({ confirm }) => {
                confirm && clearLocalData().then(() => {
                    showToast('清理成功').then(() => {
                        Taro.navigateBack({ delta: 3 })
                    })
                })
            }
        })
    }

    // 清除云端数据
    handleClearCloud = () => {
        Taro.showModal({
            cancelColor: '#333',
            confirmColor: '#999',
            content: `将清除云端所有加密数据，确定？`,
            success: ({ confirm }) => {
                confirm && clearCloudData().then(() => {
                    showToast('清理成功').then(() => {
                        Taro.navigateBack({ delta: 3 })
                    })
                })
            }
        })
    }

    render() {
        return (
            <View className='full-page'>
                <TopBar title='数据管理' />

                <View className='container'>
                    <View className='tip'>
                        可以生成本地账号的内容并复制到剪切板，通过微信等方式发送到新设备上，在新设备的导入导出页面粘贴内容到下方文本框，再点击立即导入，就可以将数据迁移到新设备啦！
                    </View>
                    
                    <View className='btn-box'>
                        <Button className='btn' onClick={this.handleClearLocal}>清除本地数据</Button>
                        <Button className='btn' onClick={this.handleClearCloud}>清除云端数据</Button>
                    </View>
                </View>
            </View>
        )
    }
}
