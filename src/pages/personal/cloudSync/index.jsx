import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button, Switch } from '@tarojs/components'
import TopBar from '../../../components/TopBar/index'
import { setStorage, previewImage } from '../../../utils'
import { setBackupData } from '../../../utils/cloudSync'
import cloudIconUrl from '../../../assets/images/cloud-icon.png'
import moreIconUrl from '../../../assets/images/more-icon.png'

import './index.scss'

export default class Home extends Component {
    state = {
        isPay: false,
        autoSync: false,
        wechatPayUrl: 'https://7072-prod-3g3ayg0q48089ea7-1306246601.tcb.qcloud.la/assets/wechat-pay.png?sign=605b4e680fe23bb4e6c06c3e14c8307d&t=1627720238'
    }

    componentDidMount() {
        const isPay =  this.getPayStatus()
        this.setState({ isPay })
        isPay && this.getAutoSync()
    }

    // 获取云同步功能状态
    getPayStatus = () => {
        const isPay = true
        return isPay
    }

    // 获取自动同步的开关状态
    getAutoSync = () => {
        const autoSync = Taro.getStorageSync('autoSync') || false
        this.setState({ autoSync })
    }

    // 自动同步状态变化
    autoSyncChange = (e) => {
        let autoSync = e.detail.value
        this.setState({ autoSync })
        if (!autoSync) return this.setState({ autoSync }, () => {
            setStorage('autoSync', autoSync)
        })

        Taro.showModal({
            content: `开启自动同步功能，将在标签、账号发生变化时帮您自动备份，确认开启？`,
            success: ({ cancel }) => {
                if (cancel) {
                    autoSync = false
                }
                this.setState({ autoSync }, () => {
                    setStorage('autoSync', autoSync)
                })
            }
        })
    }

    // 备份按钮
    handleBackup = () => {
        Taro.showModal({
            confirmText: '开始备份',
            content: `备份操作会覆盖云端内容，是否立即备份？`,
            success: ({ confirm }) => {
                if (confirm) {
                    setBackupData()
                }
            }
        })
    }

    // 下载按钮
    handleDownload = () => {
        Taro.showActionSheet({
            itemList: ['和本地数据合并', '清除本地数据再下载备份'],
            success: (res) => {
                switch (res.tapIndex) {
                    case 0:
                        // const { tagList, accountList } = setBackupData()
                        // console.log(111111, tagList, accountList)
                        break
                    case 1:
                        
                        break
                    default:
                        break
                }
            }
        })
    }

    render() {
        const { isPay, autoSync, wechatPayUrl } = this.state
        return (
            <View className='full-page'>
                <TopBar title='云同步' />

                <View className='container'>
                    {
                        isPay ? 
                        <View className='is-pay'>
                            <Image className='cloud-icon' src={cloudIconUrl} />
                            <View className='tip'>备份到云端，数据不再丢失</View>
                            <View className='btn-box'>
                                <Button className='backup-btn' onClick={this.handleBackup}>立即备份</Button>
                                <Button className='backup-btn' onClick={this.handleDownload}>备份下载</Button>
                            </View>

                            <View className='row-box'>
                                <View className='row-item'>
                                    <View className='name'>自动同步</View>
                                    <Switch className='sync-switch' checked={autoSync} onChange={this.autoSyncChange} />
                                </View>
                                {/* <View className='row-item'>
                                    <View className='name'>备份下载</View>
                                    <Image className='more-icon' src={moreIconUrl} />
                                </View> */}
                                <View className='row-item'>
                                    <View className='name'>联系开发者</View>
                                    <Image className='more-icon' src={moreIconUrl} />
                                    <Button className='contact-btn' type='primary' open-type='contact'>联系开发者</Button>
                                </View>
                            </View>
                        </View> :
                        <View className='no-pay'>
                            <Image className='wechat-pay' src={wechatPayUrl} onClick={() => { previewImage([wechatPayUrl]) }} />
                            <View className='tip'>扫码二维码，支持开发者。支付后点击下方“联系开发者”按钮，发送支付截图，开发者会在第一时间帮您开通云同步功能。</View>
                            <Button className='contact-btn' type='primary' open-type='contact'>联系开发者</Button>
                        </View>
                    }
                </View>
            </View>
        )
    }
}
