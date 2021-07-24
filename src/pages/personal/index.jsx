import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { showToast, initTagList } from '../../utils'
import TopBar from '../../components/TopBar/index'
import defaultAvatar from '../../assets/images/default_avatar.png'
import moreIconUrl from '../../assets/images/more-icon.png'

import './index.scss'

export default class Home extends Component {
    state = {
        optionList: [
            { name: '主密码', url: '/pages/password/index' },
            { name: '云同步', url: '/pages/cloudSync/index' },
            { name: '设置授权' },
            { name: '关于', url: '/pages/about/index' },
            { name: '友情链接', url: '/pages/friend/index' },
        ]
    }

    componentDidMount() {
        
    }

    login = () => {
        console.log(1)
        initTagList()
    }

    // 跳转页面
    goPage = ({ url }) => {
        url && Taro.navigateTo({
            url,
            fail: (err) => {
                err && showToast('敬请期待')
            }
        })
    }

    // 调起小程序设置界面
    openSetting = () => {
        Taro.openSetting()
    }

    render() {
        const { optionList } = this.state

        return (
            <View className='full-page'>
                <TopBar title='我的' />

                <View className='container'>
                    <Image className='avatar' src={defaultAvatar} onClick={this.login} />

                    <View className='row-box'>
                        {
                            optionList.map(item => {
                                return (
                                    <View className='row-item' key={item.name} onClick={() => { this.goPage(item) }}>
                                        <View className='title'>{ item.name }</View>
                                        <Image className='more-icon' src={moreIconUrl} />
                                        {
                                            item.name === '设置授权' && <Button className='open-setting' open-type='openSetting' bindopensetting='openSetting'>授权</Button>
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
