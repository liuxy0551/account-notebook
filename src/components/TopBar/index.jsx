import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getTopBarHeight } from '../../utils'
import defaultAvatar from '../../assets/images/default_avatar.png'
import backIconUrl from '../../assets/images/back-icon.png'

import './index.scss'

class TopBar extends Component {
    static defaultProps = {
        showAvatar: false,
        showBack: true,
        title: '账号簿',
        userInfo: null
    }
    state = {
        menuTop: 0,
        menuHeight: 0
    }

    componentDidMount() {
        const { menuTop, menuHeight } = getTopBarHeight()
        this.setState({
            menuTop,
            menuHeight
        })
    }

    // 点击左上角图片
    handleLeftImg = () => {
        const { showAvatar, showBack } = this.props
        showAvatar ? Taro.navigateTo({ url: `/pages/personal/grid/index` }) : (showBack ? Taro.navigateBack() : null)
    }
  
    render() {
        const { showAvatar, showBack, title, userInfo } = this.props
        const { menuTop, menuHeight } = this.state
        const avatarStyle = {
            width: `${ menuHeight }Px`,
            height: `${ menuHeight }Px`
        }
        const backIconStyle = {
            width: `${ menuHeight + 6 }rpx`,
            height: `${ menuHeight + 6 }rpx`,
            padding: '10rpx'
        }
        let leftStyle = showAvatar ? avatarStyle : backIconStyle
        let leftSrc = showAvatar ? (userInfo?.avatarUrl || defaultAvatar) : (showBack ? backIconUrl : '')

        return (
            <View className='top-bar' style={{ padding: `${ menuTop }Px 20rpx 8Px` }}>
                <Image className='left-icon' style={leftStyle} src={leftSrc} onClick={this.handleLeftImg} />
                <View className='title'>{ title }</View>
                <View style={avatarStyle}></View>
            </View>
        )
    }
}

export default TopBar
