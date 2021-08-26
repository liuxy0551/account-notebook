import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button, Switch } from '@tarojs/components'
import TopBar from '../../../components/TopBar/index'
import { getCloudIsPayAutoSync } from '../../../utils/user'
import { previewImage, showToast, showShareMenu, setStorage } from '../../../utils'
import { setBackupData, setDownloadData, updateUserAutoSync } from '../../../utils/cloudSync'
import cloudIconUrl from '../../../assets/images/cloud-icon.png'
import moreIconUrl from '../../../assets/images/more-icon.png'

import './index.scss'

export default class Home extends Component {
    state = {
        isPay: false,
        autoSync: false,
        showAutoSync: false, // 显示的 autoSync
        showContent: false,
        wechatPayUrl: 'https://7072-prod-3g3ayg0q48089ea7-1306246601.tcb.qcloud.la/assets/wechat-pay.png?sign=605b4e680fe23bb4e6c06c3e14c8307d&t=1627720238'
    }

    componentDidMount () {
        Taro.showLoading({ title: '加载中...', mask: true })
        this.getIsPayAutoSync()

        showShareMenu()
    }

    // 是否支付过、自动同步
    getIsPayAutoSync = async () => {
        const { isPay, autoSync } = await getCloudIsPayAutoSync()
        this.setState({
            isPay,
            autoSync,
            showAutoSync: autoSync
        }, () => {
            setStorage('autoSync', autoSync)
            this.setState({ showContent: true })
            Taro.hideLoading()
        })
    }

    // 自动同步状态变化
    autoSyncChange = (e) => {
        let autoSync = e.detail.value
        this.setState({ autoSync })

        if (autoSync) {
            Taro.showModal({
                content: `开启自动同步功能，将在标签、账号发生变化时帮您自动备份，确认开启？`,
                success: ({ cancel }) => {
                    if (cancel) autoSync = false
                    this.setState({
                        autoSync,
                        showAutoSync: autoSync
                    }, setStorage('autoSync', autoSync))
                }
            })
        } else {
            Taro.showModal({
                content: `关闭自动同步功能后，标签、账号发生变化时将不再帮您自动备份，且再次开通需要联系开发者，确认关闭？`,
                success: ({ cancel }) => {
                    if (cancel) autoSync = true
                    this.setState({
                        autoSync,
                        showAutoSync: autoSync
                    }, async () => {
                        if (autoSync) return
                        const result = await updateUserAutoSync(autoSync)
                        showToast(`${ result ? '关闭成功' : '关闭失败' }`)
                        setStorage('autoSync', !result)
                        !result && this.setState({
                            autoSync: !result,
                            showAutoSync: !result
                        })
                    })
                }
            })
        }
    }

    // 备份按钮
    handleBackup = () => {
        Taro.showModal({
            confirmText: '开始备份',
            content: `备份操作会覆盖云端内容，是否立即备份？`,
            success: ({ confirm }) => {
                confirm && setBackupData()
            }
        })
    }

    // 下载按钮
    handleDownload = () => {
        Taro.showActionSheet({
            itemList: ['以本地数据为主合并', '以云端数据为主合并', '清除本地数据再下载备份'],
            success: (res) => {
                setDownloadData(res.tapIndex)
            }
        })
    }

    // 点击自动同步
    handleAutoSync = () => {
        const { showAutoSync } = this.state
        !showAutoSync && showToast('敬请期待')
    }

    render() {
        const { isPay, autoSync, showContent, wechatPayUrl } = this.state
        return (
            <View className='full-page'>
                <TopBar title='云同步' />

                {
                    showContent ? <View className='container'>
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
                                    <View className='row-item' onClick={this.handleAutoSync}>
                                        <View className='name'>自动同步</View>
                                        <Switch checked={autoSync} disabled={!autoSync} onChange={this.autoSyncChange} />
                                    </View>
                                    <View className='row-item' onClick={() => { showToast('敬请期待') }}>
                                        <View className='name'>备份记录</View>
                                        <Image className='more-icon' src={moreIconUrl} />
                                    </View>
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
                    </View> : null
                }
            </View>
        )
    }
}
