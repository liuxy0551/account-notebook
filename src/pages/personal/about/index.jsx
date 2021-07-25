import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import TopBar from '../../../components/TopBar/index'
import shareImgUrl from '../../../assets/images/share.jpg'
import wechatQrcodeUrl from '../../../assets/images/wechat-qrcode.png'
import { version } from '../../../../package.json'

import './index.scss'

export default class Home extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <View className='full-page'>
                <TopBar title='关于' />

                <View className='container'>
                    <View className='row-box logo'>
                        <Image className='logo-img' src={shareImgUrl} />
                        <View className='logo-title'>账号簿</View>
                        <View className='gray-text'>v{ version }</View>
                    </View>

                    <View className='row-box'>
                        <View className='row-title'>关于『账号簿』</View>
                        <View className='row-text back'>记录账号密码，数据加密后存储在本地，不自动上传服务器。删除小程序或其他涉及微信存储的操作，会使数据丢失，提供云同步功能。</View>
                    </View>

                    <View className='row-box center'>
                        <View className='row-title'>关于作者</View>
                        <Image className='logo-img' src={wechatQrcodeUrl} />
                        <View className='row-text'>Liuxy0551</View>
                        <View className='row-text'>在体会生活的时候，感受技术的魅力</View>
                    </View>
                </View>
            </View>
        )
    }
}
