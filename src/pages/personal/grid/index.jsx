import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { showToast } from '../../../utils'
import { getUserProfile } from '../../../utils/user'
import TopBar from '../../../components/TopBar/index'
import defaultAvatar from '../../../assets/images/default_avatar.png'
import moreIconUrl from '../../../assets/images/more-icon.png'

import './index.scss'

export default class Home extends Component {
    state = {
        userInfo: null,
        optionList: [
            { name: '安全密码', url: '/pages/personal/password/index' },
            { name: '云同步', url: '/pages/personal/cloudSync/index', needLogin: true },
            { name: '设置授权' },
            { name: '关于', url: '/pages/personal/about/index' },
            { name: '友情链接', url: '/pages/personal/friend/index' },
        ]
    }

    componentDidMount() {
        this.getUserInfo()
    }

    getUserInfo = () => {
        const userInfo = Taro.getStorageSync('userInfo') || null
        this.setState({ userInfo })
    }

    // 跳转页面
    goPage = ({ url, needLogin }) => {
        const { userInfo } = this.state
        if (!url) return
        if (!needLogin || userInfo) return Taro.navigateTo({ url })
        if (!userInfo) {
            getUserProfile().then((res) => {
                this.setState({ userInfo: res }, () => {
                    showToast('授权成功').then(() => {
                        Taro.navigateTo({ url })
                    })
                })
            })
        }
    }

    // 调起小程序设置界面
    openSetting = () => {
        Taro.openSetting()
    }

    render() {
        const { userInfo, optionList } = this.state
        const avatarUrl = userInfo?.avatarUrl || defaultAvatar

        return (
            <View className='full-page'>
                <TopBar title='我的' />

                <View className='container'>
                    <Image className='avatar' src={avatarUrl} />

                    <View className='row-box'>
                        {
                            optionList.map(item => {
                                return (
                                    <View className='row-item' key={item.name} onClick={() => { this.goPage(item) }}>
                                        <View className='title'>{ item.name }</View>
                                        <Image className='more-icon' src={moreIconUrl} />
                                        {
                                            item.name === '设置授权' && <Button className='open-setting' open-type='openSetting' onOpenSetting={this.openSetting}>授权</Button>
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        )
    }
}
