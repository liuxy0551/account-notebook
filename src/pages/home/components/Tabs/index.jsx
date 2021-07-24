import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import settingIconUrl from '../../../../assets/images/setting-icon.png'

import './index.scss'

class Tabs extends Component {
    static defaultProps = {
        tagList: [],
        selectedTagId: null
    }
    state = {
        
    }

    componentDidMount() {
        
    }

    // 跳转页面
    goPage = () => {
        Taro.navigateTo({ url: `/pages/tag/list/index` })
    }
  
    render() {
        const { tagList, selectedTagId, tagChange } = this.props
        
        return (
            <View className='tag-box'>
                {
                    tagList.map(item => {
                        return (
                            <View className={`tag-item ${ selectedTagId === item.id ? 'active' : '' }`} key={item.id} onClick={() => { tagChange(item) }}>
                                <View className='name'>{ item.name }</View>
                            </View>
                        )
                    })
                }
                <View className='tag-item' onClick={this.goPage}>
                    <Image className='setting-icon' src={settingIconUrl} />
                </View>
            </View>
        )
    }
}

export default Tabs
