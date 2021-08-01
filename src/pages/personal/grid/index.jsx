import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { showShareMenu, showToast } from '../../../utils'
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

        showShareMenu()
    }

    getUserInfo = () => {
        const userInfo = Taro.getStorageSync('userInfo') || null
        this.setState({ userInfo })
    }

    login = () => {
        const { userInfo } = this.state
        !userInfo && getUserProfile().then((res) => {
            this.setState({ userInfo: res }, () => {
                showToast('授权成功')
            })
        })
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

    render() {
        const { userInfo, optionList } = this.state
        const avatarUrl = userInfo?.avatarUrl || defaultAvatar

        return (
            <View className='full-page'>
                <TopBar title='我的' />

                <View className='container'>
                    <Image className='avatar' src={avatarUrl} onClick={this.login} />

                    <View className='row-box'>
                        {
                            optionList.map(item => {
                                return (
                                    <View className='row-item' key={item.name} onClick={() => { this.goPage(item) }}>
                                        <View className='name'>{ item.name }</View>
                                        <Image className='more-icon' src={moreIconUrl} />
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
