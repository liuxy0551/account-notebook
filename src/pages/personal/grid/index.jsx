import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { showToast, showShareMenu } from '../../../utils'
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
            { name: '导入导出', url: '/pages/personal/importExport/index', needLogin: true },
            { name: '联系开发者' },
            { name: '审查代码' },
            { name: '关于', url: '/pages/personal/about/index' },
            { name: '友情链接' }
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
    goPage = ({ name, url, needLogin }) => {
        const codeUrl = 'https://github.com/liuxy0551/account-notebook'
        const { userInfo } = this.state
        if (!url && name === '审查代码') return Taro.showModal({
            cancelText: '欢迎star',
            confirmText: '复制地址',
            content: `『账号簿』代码开源，可以访问 ${ codeUrl } 审查代码`,
            success: ({ confirm }) => {
                confirm && Taro.setClipboardData({ data: codeUrl })
            }
        })
        if (!url && name === '友情链接') return Taro.navigateToMiniProgram({ appId: 'wxc3146b74ec7c8e5c' })
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
                                        {
                                            item.name === '联系开发者' && <Button className='contact-btn' type='primary' open-type='contact'>联系开发者</Button>
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
