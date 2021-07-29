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
        title: '账号簿'
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
        if (!showBack) return
        showAvatar ? Taro.navigateTo({ url: `/pages/personal/grid/index` }) : Taro.navigateBack()
    }
  
    render() {
        const { showAvatar, showBack, title } = this.props
        const { menuTop, menuHeight } = this.state
        const avatarStyle = {
            width: `${ menuHeight }Px`,
            height: `${ menuHeight }Px`
        }
        const backIconStyle = {
            width: `${ menuHeight + 6 }rpx`,
            height: `${ menuHeight + 6 }rpx`,
            paddingLeft: '10rpx'
        }
        let leftStyle = showAvatar ? avatarStyle : backIconStyle
        let leftSrc = showAvatar ? defaultAvatar : (showBack ? backIconUrl : '')

        return (
            <View className='top-bar' style={{ padding: `${ menuTop }Px 20rpx 8Px` }}>
                <Image className='avatar' style={leftStyle} src={leftSrc} onClick={this.handleLeftImg} />
                <View className='title'>{ title }</View>
                <View style={avatarStyle}></View>
            </View>
        )
    }
}

export default TopBar
