import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import noDataUrl from '../../assets/images/no-data.png'

import './index.scss'

class Empty extends Component {
    static defaultProps = {
        tip: '暂无数据'
    }

    componentDidMount() {
        
    }

    render() {
        const { tip } = this.props

        return (
            <View className='empty-box'>
                <Image className='no-data' src={noDataUrl} />
                <View className='tip'>{ tip }</View>
            </View>
        )
    }
}

export default Empty
